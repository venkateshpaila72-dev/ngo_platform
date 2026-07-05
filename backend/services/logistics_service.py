from datetime import datetime, timedelta, timezone
from itertools import combinations
from typing import Optional

from config.settings import NGOS_COLLECTION
from utils.firestore_helpers import get_all_documents, get_document, update_document
from utils.geo_utils import haversine_distance_km

# Two NGOs are flagged as a synergy candidate if their destinations are
# within this distance AND their estimated arrival times are within this
# time window of each other.
SYNERGY_DISTANCE_KM = 15
SYNERGY_TIME_WINDOW_MINUTES = 45

# An en_route declaration older than this is considered stale (the NGO
# probably already arrived or the trip fell through) and is excluded from
# synergy matching rather than surfacing outdated alerts.
STALE_AFTER_MINUTES = 180


def set_en_route(ngo_id: str, destination: dict, eta_minutes: float) -> dict:
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        raise ValueError(f"NGO not found: {ngo_id}")

    en_route = {
        "destination": destination,
        "eta_minutes": eta_minutes,
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    update_document(NGOS_COLLECTION, ngo_id, {"en_route": en_route})
    return {"ngo_id": ngo_id, "en_route": en_route}


def clear_en_route(ngo_id: str) -> dict:
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        raise ValueError(f"NGO not found: {ngo_id}")
    update_document(NGOS_COLLECTION, ngo_id, {"en_route": None})
    return {"ngo_id": ngo_id, "en_route": None}


def _estimated_arrival(en_route: dict) -> Optional[datetime]:
    try:
        updated_at = datetime.fromisoformat(en_route["updated_at"])
        return updated_at + timedelta(minutes=en_route["eta_minutes"])
    except (KeyError, ValueError, TypeError):
        return None


def _is_stale(en_route: dict) -> bool:
    try:
        updated_at = datetime.fromisoformat(en_route["updated_at"])
    except (KeyError, ValueError, TypeError):
        return True
    age_minutes = (datetime.now(timezone.utc) - updated_at).total_seconds() / 60
    return age_minutes > STALE_AFTER_MINUTES


def find_synergies() -> dict:
    """
    Scans every NGO currently marked en_route (and not stale) and flags
    pairs whose destinations are close together and whose arrival times
    overlap - the 'you're both heading to the same area, want to share
    transport?' alert.
    """
    all_ngos = get_all_documents(NGOS_COLLECTION)
    active = [
        n for n in all_ngos
        if n.get("en_route") and not _is_stale(n["en_route"])
    ]

    alerts = []
    for ngo_a, ngo_b in combinations(active, 2):
        dest_a = ngo_a["en_route"]["destination"]
        dest_b = ngo_b["en_route"]["destination"]
        distance_km = haversine_distance_km(dest_a["lat"], dest_a["lng"], dest_b["lat"], dest_b["lng"])
        if distance_km > SYNERGY_DISTANCE_KM:
            continue

        arrival_a = _estimated_arrival(ngo_a["en_route"])
        arrival_b = _estimated_arrival(ngo_b["en_route"])
        if arrival_a is None or arrival_b is None:
            continue

        time_diff_minutes = abs((arrival_a - arrival_b).total_seconds()) / 60
        if time_diff_minutes > SYNERGY_TIME_WINDOW_MINUTES:
            continue

        alerts.append({
            "ngo_a": {"id": ngo_a["id"], "name": ngo_a.get("name")},
            "ngo_b": {"id": ngo_b["id"], "name": ngo_b.get("name")},
            "destination_distance_km": round(distance_km, 2),
            "arrival_time_diff_minutes": round(time_diff_minutes, 1),
            "message": (
                f"{ngo_a.get('name')} and {ngo_b.get('name')} are both heading to "
                f"nearby destinations around the same time — consider shared transport."
            ),
        })

    return {"count": len(alerts), "alerts": alerts}