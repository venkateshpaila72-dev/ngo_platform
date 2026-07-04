from fastapi import APIRouter, HTTPException

from config.settings import NGOS_COLLECTION
from models.ngo import NGO
from utils.firestore_helpers import add_document, get_all_documents, get_document

router = APIRouter()


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