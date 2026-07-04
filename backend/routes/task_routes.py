from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.task_service import (
    complete_subtask,
    create_split_task,
    drop_subtask,
    get_task,
    reassign_subtask,
)

router = APIRouter()


class SplitItem(BaseModel):
    ngo_id: str
    quantity: Optional[float] = None


class SplitAssignRequest(BaseModel):
    splits: List[SplitItem]


class ReassignRequest(BaseModel):
    new_ngo_id: str


@router.post("/tasks/{need_id}/split-assign")
def split_assign(need_id: str, body: SplitAssignRequest):
    try:
        return create_split_task(need_id, [s.dict() for s in body.splits])
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/tasks/{task_id}")
def fetch_task(task_id: str):
    try:
        return get_task(task_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tasks/{task_id}/subtask/{ngo_id}/drop")
def drop(task_id: str, ngo_id: str):
    try:
        return drop_subtask(task_id, ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tasks/{task_id}/subtask/{ngo_id}/reassign")
def reassign(task_id: str, ngo_id: str, body: ReassignRequest):
    try:
        return reassign_subtask(task_id, ngo_id, body.new_ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/tasks/{task_id}/subtask/{ngo_id}/complete")
def complete(task_id: str, ngo_id: str):
    try:
        return complete_subtask(task_id, ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))