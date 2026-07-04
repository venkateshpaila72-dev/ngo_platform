from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.settings import NGOS_COLLECTION
from models.ngo import NGO
from utils.firestore_helpers import add_document, get_all_documents, get_document, update_document

router = APIRouter()


class AvailabilityUpdate(BaseModel):
    active_capacity: Dict[str, bool]  # e.g. {"water": False}


@router.post("/ngos")
def register_ngo(ngo: NGO):
    """Registers a new NGO with its capability profile."""
    data = ngo.dict(exclude={"id"})
    ngo_id = add_document(NGOS_COLLECTION, data)
    return {"id": ngo_id, **data}


@router.get("/ngos")
def list_ngos():
    """Returns all registered NGOs."""
    return {"ngos": get_all_documents(NGOS_COLLECTION)}


@router.get("/ngos/{ngo_id}")
def get_ngo(ngo_id: str):
    """Returns a single NGO by ID."""
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        raise HTTPException(status_code=404, detail="NGO not found")
    return ngo


@router.patch("/ngos/{ngo_id}/availability")
def update_availability(ngo_id: str, body: AvailabilityUpdate):
    """
    Toggles an NGO's availability per need_type without re-registering them.
    e.g. body: {"active_capacity": {"water": false}} marks them busy for water
    while leaving other capabilities untouched.
    """
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        raise HTTPException(status_code=404, detail="NGO not found")

    merged = {**ngo.get("active_capacity", {}), **body.active_capacity}
    update_document(NGOS_COLLECTION, ngo_id, {"active_capacity": merged})
    return {"id": ngo_id, "active_capacity": merged}