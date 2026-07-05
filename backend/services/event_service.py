from typing import Optional

from config.settings import NEEDS_COLLECTION, EVENTS_COLLECTION
from utils.firestore_helpers import add_document, get_all_documents, get_document, update_document
from utils.geo_utils import haversine_distance_km
from services.clustering_service import get_clusters


def create_event(name: str, location: dict, radius_km: float, description: Optional[str] = None) -> dict:
    data = {
        "name": name,
        "location": location,
        "radius_km": radius_km,
        "active": True,
        "description": description,
    }
    event_id = add_document(EVENTS_COLLECTION, data)
    return {"id": event_id, **data}


def list_events(active_only: bool = False) -> dict:
    events = get_all_documents(EVENTS_COLLECTION)
    if active_only:
        events = [e for e in events if e.get("active", True)]
    return {"count": len(events), "events": events}


def set_event_active(event_id: str, active: bool) -> dict:
    event = get_document(EVENTS_COLLECTION, event_id)
    if event is None:
        raise ValueError(f"Event not found: {event_id}")
    update_document(EVENTS_COLLECTION, event_id, {"active": active})
    event["active"] = active
    return event


def _needs_within_event(event: dict) -> list:
    all_needs = get_all_documents(NEEDS_COLLECTION)
    open_needs = [n for n in all_needs if n.get("status") == "open"]

    center = event["location"]
    radius_km = event["radius_km"]

    return [
        n for n in open_needs
        if haversine_distance_km(
            center["lat"], center["lng"], n["location"]["lat"], n["location"]["lng"]
        ) <= radius_km
    ]


def get_needs_for_event(event_id: str) -> dict:
    event = get_document(EVENTS_COLLECTION, event_id)
    if event is None:
        raise ValueError(f"Event not found: {event_id}")

    needs = _needs_within_event(event)
    return {"event_id": event_id, "event_name": event["name"], "count": len(needs), "needs": needs}


def get_clusters_for_event(event_id: str) -> dict:
    """Same clustering logic as GET /clusters, scoped to only the needs
    within this event's venue radius. Reuses clustering_service.get_clusters
    rather than duplicating the DBSCAN code."""
    event = get_document(EVENTS_COLLECTION, event_id)
    if event is None:
        raise ValueError(f"Event not found: {event_id}")

    needs = _needs_within_event(event)
    result = get_clusters(needs_override=needs)
    return {"event_id": event_id, "event_name": event["name"], **result}