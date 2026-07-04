from typing import List, Optional

from config.settings import NEEDS_COLLECTION, NGOS_COLLECTION, TASKS_COLLECTION
from utils.firestore_helpers import add_document, get_document, update_document


def create_split_task(need_id: str, splits: List[dict]) -> dict:
    """
    splits: [{"ngo_id": "...", "quantity": 900}, {"ngo_id": "...", "quantity": 400}, ...]
    Creates one Task with multiple sub_tasks, one per NGO, each tracked independently.
    """
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise ValueError(f"Need not found: {need_id}")

    if not splits:
        raise ValueError("At least one split is required")

    for split in splits:
        if get_document(NGOS_COLLECTION, split["ngo_id"]) is None:
            raise ValueError(f"NGO not found: {split['ngo_id']}")
        if split.get("quantity") is not None and split["quantity"] <= 0:
            raise ValueError(f"Quantity must be positive for NGO {split['ngo_id']}")

    sub_tasks = [
        {"ngo_id": s["ngo_id"], "quantity": s.get("quantity"), "status": "assigned"}
        for s in splits
    ]

    task_data = {
        "need_id": need_id,
        "need_type": need["need_type"],
        "total_quantity": need.get("quantity"),
        "unit": need.get("unit"),
        "status": "in_progress",
        "sub_tasks": sub_tasks,
    }
    task_id = add_document(TASKS_COLLECTION, task_data)

    update_document(NEEDS_COLLECTION, need_id, {"status": "assigned"})

    return {"task_id": task_id, **task_data}


def _find_subtask(task: dict, ngo_id: str) -> Optional[dict]:
    for st in task.get("sub_tasks", []):
        if st["ngo_id"] == ngo_id:
            return st
    return None


def drop_subtask(task_id: str, ngo_id: str) -> dict:
    """NGO drops out. Their sub-task becomes 'dropped' — quantity is now unclaimed
    until an admin reassigns it via reassign_subtask()."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")

    sub_task = _find_subtask(task, ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {ngo_id} is not part of task {task_id}")

    sub_task["status"] = "dropped"

    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })
    return task


def reassign_subtask(task_id: str, old_ngo_id: str, new_ngo_id: str) -> dict:
    """Fills a dropped sub-task's gap with a new NGO, re-opening that quantity chunk."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")

    if get_document(NGOS_COLLECTION, new_ngo_id) is None:
        raise ValueError(f"NGO not found: {new_ngo_id}")

    sub_task = _find_subtask(task, old_ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {old_ngo_id} is not part of task {task_id}")
    if sub_task["status"] != "dropped":
        raise ValueError(f"Sub-task for {old_ngo_id} is not in 'dropped' state")

    sub_task["ngo_id"] = new_ngo_id
    sub_task["status"] = "assigned"

    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })
    return task


def complete_subtask(task_id: str, ngo_id: str) -> dict:
    """Marks one NGO's portion done. If every sub-task is completed, the whole
    Task (and its parent Need) flips to resolved/verified."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")

    sub_task = _find_subtask(task, ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {ngo_id} is not part of task {task_id}")

    sub_task["status"] = "completed"

    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })

    if task["status"] == "verified":
        update_document(NEEDS_COLLECTION, task["need_id"], {"status": "resolved"})

    return task


def _recompute_task_status(task: dict) -> str:
    statuses = [st["status"] for st in task["sub_tasks"]]
    if all(s == "completed" for s in statuses):
        return "verified"
    if any(s == "dropped" for s in statuses):
        return "partially_covered"
    return "in_progress"


def get_task(task_id: str) -> dict:
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    return task