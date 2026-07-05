from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.need import Location
from services.event_service import (
    create_event,
    get_clusters_for_event,
    get_needs_for_event,
    list_events,
    set_event_active,
)

router = APIRouter()


class EventCreateRequest(BaseModel):
    name: str
    location: Location
    radius_km: float = 10.0
    description: str | None = None


class EventActiveUpdate(BaseModel):
    active: bool


@router.post("/events")
def create(body: EventCreateRequest):
    """Creates an event - a venue + radius that scopes the map/needs to one location."""
    return create_event(body.name, body.location.dict(), body.radius_km, body.description)


@router.get("/events")
def list_all(active_only: bool = False):
    return list_events(active_only)


@router.patch("/events/{event_id}/active")
def set_active(event_id: str, body: EventActiveUpdate):
    try:
        return set_event_active(event_id, body.active)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/events/{event_id}/needs")
def event_needs(event_id: str):
    """Needs within this event's venue radius - 'Event Mode' for the needs list."""
    try:
        return get_needs_for_event(event_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/events/{event_id}/clusters")
def event_clusters(event_id: str):
    """Same clustering as GET /clusters, scoped to this event's venue - 'Event Mode' for the heatmap."""
    try:
        return get_clusters_for_event(event_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))