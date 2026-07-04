from typing import Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.settings import NGOS_COLLECTION
from models.need import Location
from utils.firestore_helpers import add_document, get_all_documents, get_document, update_document
from utils.security import hash_password, verify_password

router = APIRouter()


class AvailabilityUpdate(BaseModel):
    active_capacity: Dict[str, bool]  # e.g. {"water": False}


class NGORegisterRequest(BaseModel):
    name: str
    district: str
    location: Location
    contact_email: str
    password: str
    capabilities: Dict[str, int] = {}
    active_capacity: Dict[str, bool] = {}


class NGOLoginRequest(BaseModel):
    contact_email: str
    password: str


def _strip_password(ngo: dict) -> dict:
    return {k: v for k, v in ngo.items() if k != "password_hash"}


@router.post("/ngos")
def register_ngo(body: NGORegisterRequest):
    """Registers a new NGO (organization) with its capability profile and login credentials."""
    all_ngos = get_all_documents(NGOS_COLLECTION)
    if any(n.get("contact_email") == body.contact_email for n in all_ngos):
        raise HTTPException(status_code=400, detail=f"An NGO with email '{body.contact_email}' already exists")

    data = {
        "name": body.name,
        "district": body.district,
        "location": body.location.dict(),
        "contact_email": body.contact_email,
        "password_hash": hash_password(body.password),
        "capabilities": body.capabilities,
        "active_capacity": body.active_capacity,
        "reliability_score": 70.0,
    }
    ngo_id = add_document(NGOS_COLLECTION, data)
    return _strip_password({"id": ngo_id, **data})


@router.post("/ngos/login")
def login_ngo(body: NGOLoginRequest):
    """Organization login — mirrors volunteer login exactly."""
    all_ngos = get_all_documents(NGOS_COLLECTION)
    match = next((n for n in all_ngos if n.get("contact_email") == body.contact_email), None)
    if match is None or not verify_password(body.password, match.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return _strip_password(match)


@router.get("/ngos")
def list_ngos():
    """Returns all registered NGOs."""
    return {"ngos": [_strip_password(n) for n in get_all_documents(NGOS_COLLECTION)]}


@router.get("/ngos/{ngo_id}")
def get_ngo(ngo_id: str):
    """Returns a single NGO by ID."""
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        raise HTTPException(status_code=404, detail="NGO not found")
    return _strip_password(ngo)


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