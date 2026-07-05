from typing import List, Optional

from config.settings import NEEDS_COLLECTION, NGOS_COLLECTION, TASKS_COLLECTION
from utils.firestore_helpers import add_document, get_all_documents, get_document, update_document
from services.scoring_utils import score_ngo_for_need
from services.reliability_service import adjust_reliability, COMPLETE_BONUS, DROP_PENALTY

VALID_SUBTASK_STATUSES = {"assigned", "accepted", "dropped", "completed"}


def create_split_task(need_id: str, splits: List[dict]) -> dict:
    """
    splits: [{"ngo_id": "...", "quantity": 900}, ...]. quantity may be None
    for needs that aren't measured in units (e.g. a generic medical need).
    """
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise ValueError(f"Need not found: {need_id}")

    if not splits:
        raise ValueError("At least one split is required")

    ngo_ids_seen = set()
    for split in splits:
        if get_document(NGOS_COLLECTION, split["ngo_id"]) is None:
            raise ValueError(f"NGO not found: {split['ngo_id']}")
        if split["ngo_id"] in ngo_ids_seen:
            raise ValueError(f"NGO {split['ngo_id']} appears more than once in splits")
        ngo_ids_seen.add(split["ngo_id"])
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

    result = {"task_id": task_id, **task_data}

    # Non-blocking warning if the split doesn't add up to the need's stated quantity.
    declared_total = need.get("quantity")
    split_sum = sum(s.get("quantity") or 0 for s in splits)
    if declared_total is not None and split_sum != declared_total:
        result["warning"] = (
            f"Splits sum to {split_sum} but the need's total_quantity is "
            f"{declared_total} ({need.get('unit') or 'units'}). Coverage may be incomplete."
        )

    return result


def _find_subtask(task: dict, ngo_id: str) -> Optional[dict]:
    for st in task.get("sub_tasks", []):
        if st["ngo_id"] == ngo_id:
            return st
    return None


def _require_sub_tasks_schema(task: dict, task_id: str) -> None:
    if "sub_tasks" not in task:
        raise ValueError(
            f"Task {task_id} doesn't use the sub_tasks schema — "
            f"it may have been created by an older code path."
        )


def drop_subtask(task_id: str, ngo_id: str) -> dict:
    """NGO drops out. Their quantity chunk becomes unclaimed until reassigned
    or the task is explicitly closed via resolve_task_with_gap()."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    _require_sub_tasks_schema(task, task_id)

    sub_task = _find_subtask(task, ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {ngo_id} is not part of task {task_id}")
    if sub_task["status"] == "completed":
        raise ValueError("Cannot drop a sub-task that is already completed")
    if sub_task["status"] == "dropped":
        raise ValueError("This sub-task has already been dropped")

    sub_task["status"] = "dropped"
    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })
    adjust_reliability(ngo_id, DROP_PENALTY)
    return task


def suggest_replacements(task_id: str, dropped_ngo_id: str, top_n: int = 5) -> dict:
    """
    THE 'NO NGO AVAILABLE' SCENARIO: after a drop, call this to search for
    replacement candidates. Excludes every NGO already on this task (so you
    don't re-suggest someone already covering a different chunk). If
    candidates_in_range is 0, there is genuinely nobody nearby right now —
    the admin should either wait and retry later, or call
    resolve_task_with_gap() to close the task with the gap on record.
    """
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    _require_sub_tasks_schema(task, task_id)

    sub_task = _find_subtask(task, dropped_ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {dropped_ngo_id} is not part of task {task_id}")
    if sub_task["status"] != "dropped":
        raise ValueError("Only a 'dropped' sub-task can be searched for a replacement")

    need = get_document(NEEDS_COLLECTION, task["need_id"])
    if need is None:
        raise ValueError(f"Need not found: {task['need_id']}")

    already_involved = {st["ngo_id"] for st in task["sub_tasks"]}
    all_ngos = get_all_documents(NGOS_COLLECTION)
    candidates = [n for n in all_ngos if n["id"] not in already_involved]

    scored = [score_ngo_for_need(need, ngo) for ngo in candidates]
    scored = [s for s in scored if s is not None]
    scored.sort(key=lambda s: s["match_score"], reverse=True)

    return {
        "task_id": task_id,
        "dropped_ngo_id": dropped_ngo_id,
        "quantity_needing_coverage": sub_task.get("quantity"),
        "candidates_in_range": len(scored),
        "suggestions": scored[:top_n],
        "note": (
            "No NGOs currently available nearby. Retry later or call "
            "resolve_task_with_gap to close this task with the gap recorded."
            if not scored else None
        ),
    }


def reassign_subtask(task_id: str, old_ngo_id: str, new_ngo_id: str) -> dict:
    """Fills a dropped sub-task's gap with a new NGO."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    _require_sub_tasks_schema(task, task_id)

    if get_document(NGOS_COLLECTION, new_ngo_id) is None:
        raise ValueError(f"NGO not found: {new_ngo_id}")

    sub_task = _find_subtask(task, old_ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {old_ngo_id} is not part of task {task_id}")
    if sub_task["status"] != "dropped":
        raise ValueError(f"Sub-task for {old_ngo_id} is not in 'dropped' state")

    other_active_ngos = {
        st["ngo_id"] for st in task["sub_tasks"]
        if st["ngo_id"] != old_ngo_id and st["status"] != "dropped"
    }
    if new_ngo_id in other_active_ngos:
        raise ValueError(f"NGO {new_ngo_id} is already covering another part of this task")

    sub_task["ngo_id"] = new_ngo_id
    sub_task["status"] = "assigned"

    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })
    return task


def complete_subtask(task_id: str, ngo_id: str) -> dict:
    """Marks one NGO's portion done. If every sub-task is completed, the
    whole Task (and its parent Need) flips to resolved/verified."""
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    _require_sub_tasks_schema(task, task_id)

    sub_task = _find_subtask(task, ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {ngo_id} is not part of task {task_id}")
    if sub_task["status"] == "dropped":
        raise ValueError("Cannot complete a dropped sub-task — reassign it first")
    if sub_task["status"] == "completed":
        raise ValueError("This sub-task is already completed")

    sub_task["status"] = "completed"
    task["status"] = _recompute_task_status(task)
    update_document(TASKS_COLLECTION, task_id, {
        "sub_tasks": task["sub_tasks"],
        "status": task["status"],
    })
    adjust_reliability(ngo_id, COMPLETE_BONUS)

    if task["status"] == "verified":
        update_document(NEEDS_COLLECTION, task["need_id"], {"status": "resolved"})

    return task


def resolve_task_with_gap(task_id: str) -> dict:
    """
    THE 'NO NGO AVAILABLE, EVER' FALLBACK: closes a task even though one or
    more sub-tasks are permanently 'dropped' and unreassigned. Only allowed
    when the task is currently 'partially_covered'. Marks the task
    'resolved_partial' and the need 'partially_resolved' — both are honest,
    searchable states so this gap shows up in reporting instead of the task
    sitting open forever.
    """
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    _require_sub_tasks_schema(task, task_id)

    if task["status"] != "partially_covered":
        raise ValueError(
            f"Task {task_id} is '{task['status']}', not 'partially_covered' — "
            f"nothing to force-close."
        )

    update_document(TASKS_COLLECTION, task_id, {"status": "resolved_partial"})
    update_document(NEEDS_COLLECTION, task["need_id"], {"status": "partially_resolved"})

    task["status"] = "resolved_partial"
    return task


def list_unclaimed_tasks() -> dict:
    """Returns every task that currently has at least one 'dropped',
    unreassigned sub-task — i.e. needs admin attention right now."""
    all_tasks = get_all_documents(TASKS_COLLECTION)
    unclaimed = [
        t for t in all_tasks
        if "sub_tasks" in t and any(st["status"] == "dropped" for st in t["sub_tasks"])
    ]
    return {"count": len(unclaimed), "tasks": unclaimed}


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


def list_tasks_for_ngo(ngo_id: str, active_only: bool = False) -> dict:
    """Returns every task that has a sub_task belonging to this NGO.

    Volunteers aren't individually assigned to a sub-task until they submit
    a proof (see proof_service.submit_proof), so 'a volunteer's tasks' means
    'their NGO's tasks' - any volunteer at that NGO can pick one up and
    submit proof for it. active_only=True excludes sub-tasks that are
    already 'dropped' or 'completed', for a volunteer's home screen.
    """
    all_tasks = get_all_documents(TASKS_COLLECTION)
    matching = [
        t for t in all_tasks
        if "sub_tasks" in t and any(st["ngo_id"] == ngo_id for st in t["sub_tasks"])
    ]

    if active_only:
        matching = [
            t for t in matching
            if any(
                st["ngo_id"] == ngo_id and st["status"] in ("assigned", "accepted", "pending_verification")
                for st in t["sub_tasks"]
            )
        ]

    return {"count": len(matching), "tasks": matching}