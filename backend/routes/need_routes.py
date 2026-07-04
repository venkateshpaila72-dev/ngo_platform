from typing import Optional

from fastapi import APIRouter, HTTPException

from config.settings import NEEDS_COLLECTION
from utils.firestore_helpers import get_all_documents, get_document

router = APIRouter()


@router.get("/needs")
def list_needs(status: Optional[str] = None, need_type: Optional[str] = None):
    """
    Returns all needs, optionally filtered by status ("open" | "assigned" |
    "resolved") and/or need_type ("water" | "food" | ...). This is what a
    frontend uses to render a list/map of needs and pick up their IDs -
    nobody types a need_id by hand.
    """
    needs = get_all_documents(NEEDS_COLLECTION)

    if status:
        needs = [n for n in needs if n.get("status") == status]
    if need_type:
        needs = [n for n in needs if n.get("need_type") == need_type]

    return {"count": len(needs), "needs": needs}


@router.get("/needs/{need_id}")
def get_need(need_id: str):
    """Returns a single need by ID."""
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise HTTPException(status_code=404, detail="Need not found")
    return need