from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.matching_service import assign_task, get_matches_for_need

router = APIRouter()


class AssignRequest(BaseModel):
    ngo_ids: List[str]


@router.get("/match/{need_id}")
def match_need(need_id: str, top_n: int = 5):
    """Returns the top-N ranked NGO matches for a given need."""
    try:
        return get_matches_for_need(need_id, top_n=top_n)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/match/{need_id}/assign")
def assign_ngos_to_need(need_id: str, body: AssignRequest):
    """Assigns one or more NGOs to a need, creating a Task and marking the need 'assigned'."""
    try:
        return assign_task(need_id, body.ngo_ids)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))