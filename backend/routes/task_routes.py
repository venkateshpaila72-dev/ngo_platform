from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.task_service import (
    complete_subtask,
    create_split_task,
    drop_subtask,
    get_task,
    list_tasks_for_ngo,
    list_unclaimed_tasks,
    reassign_subtask,
    resolve_task_with_gap,
    suggest_replacements,
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


@router.get("/tasks/unclaimed")
def unclaimed_tasks():
    """Dashboard endpoint: tasks with a dropped, unreassigned sub-task."""
    return list_unclaimed_tasks()


@router.get("/ngos/{ngo_id}/tasks")
def ngo_tasks(ngo_id: str, active_only: bool = False):
    """Every task touching this NGO. Used by the volunteer dashboard
    (active_only=true - work still open for pickup) and can also back an
    NGO-side 'my tasks' view (active_only=false - full history)."""
    return list_tasks_for_ngo(ngo_id, active_only=active_only)


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
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tasks/{task_id}/subtask/{ngo_id}/suggest-replacement")
def suggest_replacement(task_id: str, ngo_id: str, top_n: int = 5):
    """Call this after a drop to find replacement NGOs. If candidates_in_range
    is 0, nobody is available — see resolve-with-gap instead."""
    try:
        return suggest_replacements(task_id, ngo_id, top_n=top_n)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tasks/{task_id}/subtask/{ngo_id}/reassign")
def reassign(task_id: str, ngo_id: str, body: ReassignRequest):
    try:
        return reassign_subtask(task_id, ngo_id, body.new_ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tasks/{task_id}/resolve-with-gap")
def resolve_with_gap(task_id: str):
    """Force-closes a task when no replacement NGO is available — the gap
    stays on record instead of the task hanging open indefinitely."""
    try:
        return resolve_task_with_gap(task_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/tasks/{task_id}/subtask/{ngo_id}/complete")
def complete(task_id: str, ngo_id: str):
    try:
        return complete_subtask(task_id, ngo_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))