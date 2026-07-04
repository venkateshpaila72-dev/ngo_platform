from typing import List, Optional

from config.settings import NEEDS_COLLECTION, NGOS_COLLECTION, TASKS_COLLECTION
from utils.firestore_helpers import (
    add_document,
    get_all_documents,
    get_document,
    update_document,
)
from utils.geo_utils import haversine_distance_km

# Candidates farther than this from the need are excluded entirely - not
# discounted, excluded - since a specialist 300km away isn't a practical
# option for physical resource delivery.
MAX_MATCH_RADIUS_KM = 50

WEIGHT_PROXIMITY = 0.40
WEIGHT_SKILL = 0.35
WEIGHT_RELIABILITY = 0.25

# Applied (not excluded) when an NGO is marked unavailable for this specific
# need_type right now - they still show up, heavily deprioritized, rather
# than disappearing, so an admin can still see/override if nothing else fits.
UNAVAILABLE_PENALTY = 0.2


def _score_ngo(need: dict, ngo: dict) -> Optional[dict]:
    need_type = need["need_type"]
    need_loc = need["location"]
    ngo_loc = ngo["location"]

    distance_km = haversine_distance_km(
        need_loc["lat"], need_loc["lng"], ngo_loc["lat"], ngo_loc["lng"]
    )
    if distance_km >= MAX_MATCH_RADIUS_KM:
        return None

    proximity = round(1 - (distance_km / MAX_MATCH_RADIUS_KM), 4)
    skill = ngo.get("capabilities", {}).get(need_type, 0) / 100
    reliability = ngo.get("reliability_score", 50) / 100
    available = ngo.get("active_capacity", {}).get(need_type, True)

    raw_score = (
        (WEIGHT_PROXIMITY * proximity)
        + (WEIGHT_SKILL * skill)
        + (WEIGHT_RELIABILITY * reliability)
    )
    if not available:
        raw_score *= UNAVAILABLE_PENALTY

    return {
        "ngo_id": ngo["id"],
        "ngo_name": ngo.get("name", "Unknown"),
        "district": ngo.get("district"),
        "match_score": round(raw_score * 100, 1),
        "distance_km": round(distance_km, 2),
        "skill_weight": ngo.get("capabilities", {}).get(need_type, 0),
        "reliability_score": ngo.get("reliability_score", 50),
        "available": available,
    }


def get_matches_for_need(need_id: str, top_n: int = 5) -> dict:
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise ValueError(f"Need not found: {need_id}")

    all_ngos = get_all_documents(NGOS_COLLECTION)

    scored = [_score_ngo(need, ngo) for ngo in all_ngos]
    scored = [s for s in scored if s is not None]
    scored.sort(key=lambda s: s["match_score"], reverse=True)

    return {
        "need_id": need_id,
        "need_type": need["need_type"],
        "candidates_in_range": len(scored),
        "matches": scored[:top_n],
    }


def assign_task(need_id: str, ngo_ids: List[str]) -> dict:
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise ValueError(f"Need not found: {need_id}")

    for ngo_id in ngo_ids:
        if get_document(NGOS_COLLECTION, ngo_id) is None:
            raise ValueError(f"NGO not found: {ngo_id}")

    assigned_ngos = [{"ngo_id": ngo_id, "status": "accepted"} for ngo_id in ngo_ids]

    task_data = {
        "need_id": need_id,
        "need_type": need["need_type"],
        "status": "in_progress",
        "assigned_ngos": assigned_ngos,
    }
    task_id = add_document(TASKS_COLLECTION, task_data)

    update_document(NEEDS_COLLECTION, need_id, {"status": "assigned"})

    return {"task_id": task_id, **task_data}