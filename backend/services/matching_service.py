from typing import List, Optional

from config.settings import NEEDS_COLLECTION, NGOS_COLLECTION
from utils.firestore_helpers import get_all_documents, get_document
from services.scoring_utils import score_ngo_for_need


def get_matches_for_need(need_id: str, top_n: int = 5, exclude_ngo_ids: Optional[List[str]] = None) -> dict:
    need = get_document(NEEDS_COLLECTION, need_id)
    if need is None:
        raise ValueError(f"Need not found: {need_id}")

    exclude_ngo_ids = set(exclude_ngo_ids or [])
    all_ngos = get_all_documents(NGOS_COLLECTION)
    candidates = [n for n in all_ngos if n["id"] not in exclude_ngo_ids]

    scored = [score_ngo_for_need(need, ngo) for ngo in candidates]
    scored = [s for s in scored if s is not None]
    scored.sort(key=lambda s: s["match_score"], reverse=True)

    return {
        "need_id": need_id,
        "need_type": need["need_type"],
        "candidates_in_range": len(scored),
        "matches": scored[:top_n],
    }


def assign_task(need_id: str, ngo_ids: List[str]) -> dict:
    """
    Simple multi-NGO assignment with no quantity split. Delegates to
    task_service so every Task in the database uses the same sub_tasks
    schema — this used to create a different, incompatible shape.
    """
    from services.task_service import create_split_task  # local import avoids circular dependency

    splits = [{"ngo_id": ngo_id, "quantity": None} for ngo_id in ngo_ids]
    return create_split_task(need_id, splits)