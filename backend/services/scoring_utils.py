from typing import Optional
from utils.geo_utils import haversine_distance_km

# Candidates farther than this from the need are excluded entirely.
MAX_MATCH_RADIUS_KM = 50

WEIGHT_PROXIMITY = 0.40
WEIGHT_SKILL = 0.35
WEIGHT_RELIABILITY = 0.25

# Applied (not excluded) when an NGO is marked unavailable for this need_type.
UNAVAILABLE_PENALTY = 0.2


def score_ngo_for_need(need: dict, ngo: dict) -> Optional[dict]:
    """Scores one NGO against one need. Returns None if outside match radius."""
    need_type = need["need_type"]
    need_loc = need.get("location")
    ngo_loc = ngo.get("location")
    if not need_loc or not ngo_loc:
        return None

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