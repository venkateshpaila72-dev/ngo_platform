from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from models.need import Location
from services.logistics_service import clear_en_route, find_synergies, set_en_route

router = APIRouter()


class EnRouteRequest(BaseModel):
    destination: Location
    eta_minutes: float


@router.post("/ngos/{ngo_id}/en-route")
def declare_en_route(ngo_id: str, body: EnRouteRequest):
    """An NGO declares they're currently traveling to a destination."""
    try:
        return set_en_route(ngo_id, body.destination.dict(), body.eta_minutes)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/ngos/{ngo_id}/en-route")
def cancel_en_route(ngo_id: str):
    """Clears an NGO's en-route status (arrived, or trip cancelled)."""
    try:
        return clear_en_route(ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/logistics/synergy")
def synergy_alerts():
    """Returns pairs of NGOs currently heading to nearby destinations around
    the same time - a prompt to coordinate shared transport."""
    return find_synergies()