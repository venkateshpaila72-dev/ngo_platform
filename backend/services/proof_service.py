from typing import Optional
from config.settings import NEEDS_COLLECTION, PROOFS_COLLECTION, TASKS_COLLECTION
from utils.firestore_helpers import add_document, get_all_documents, get_document, update_document
from utils.geo_utils import haversine_distance_km
from services.task_service import _find_subtask, complete_subtask, drop_subtask
from services.anomaly_service import detect_ml_anomaly
from services.reliability_service import adjust_reliability, REJECTED_PROOF_PENALTY

ANOMALY_DISTANCE_KM = 20  # flags for admin review, doesn't block submission


def submit_proof(task_id: str, ngo_id: str, photo_url: str, location: dict,
                  volunteer_id: Optional[str] = None, story_text: Optional[str] = None,
                  feedback_rating: Optional[int] = None) -> dict:
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")

    sub_task = _find_subtask(task, ngo_id)
    if sub_task is None:
        raise ValueError(f"NGO {ngo_id} is not part of task {task_id}")
    if sub_task["status"] in ("dropped", "completed"):
        raise ValueError(f"Cannot submit proof — sub-task is already '{sub_task['status']}'")

    need = get_document(NEEDS_COLLECTION, task["need_id"])
    distance_km = haversine_distance_km(
        need["location"]["lat"], need["location"]["lng"], location["lat"], location["lng"]
    )

    distance_flagged = distance_km > ANOMALY_DISTANCE_KM
    reasons = []
    if distance_flagged:
        reasons.append(
            f"Submitted location is {round(distance_km, 1)}km from the need site "
            f"(threshold: {ANOMALY_DISTANCE_KM}km)"
        )

    # ML check runs independently of the distance check above - either one
    # (or both) can flag a submission. See anomaly_service.py for the
    # cold-start fallback when there's too little history to train on.
    ml_flagged, ml_reason = detect_ml_anomaly(distance_km, feedback_rating)
    if ml_flagged:
        reasons.append(ml_reason)

    anomaly_flagged = distance_flagged or ml_flagged
    anomaly_reason = " | ".join(reasons) if reasons else None

    proof_data = {
        "task_id": task_id,
        "ngo_id": ngo_id,
        "volunteer_id": volunteer_id,
        "photo_url": photo_url,
        "location": location,
        "story_text": story_text,
        "feedback_rating": feedback_rating,
        "status": "pending_verification",
        "distance_km": round(distance_km, 2),
        "anomaly_flagged": anomaly_flagged,
        "anomaly_reason": anomaly_reason,
    }
    proof_id = add_document(PROOFS_COLLECTION, proof_data)

    sub_task["status"] = "pending_verification"
    if volunteer_id:
        sub_task["volunteer_id"] = volunteer_id
    update_document(TASKS_COLLECTION, task_id, {"sub_tasks": task["sub_tasks"]})

    return {"proof_id": proof_id, **proof_data}


def verify_proof(proof_id: str, approve: bool) -> dict:
    proof = get_document(PROOFS_COLLECTION, proof_id)
    if proof is None:
        raise ValueError(f"Proof not found: {proof_id}")
    if proof["status"] != "pending_verification":
        raise ValueError(f"Proof is already '{proof['status']}'")

    if approve:
        complete_subtask(proof["task_id"], proof["ngo_id"])
        update_document(PROOFS_COLLECTION, proof_id, {"status": "approved"})
        proof["status"] = "approved"
    else:
        task = get_document(TASKS_COLLECTION, proof["task_id"])
        sub_task = _find_subtask(task, proof["ngo_id"])
        sub_task["status"] = "assigned"  # reopened — volunteer must resubmit
        update_document(TASKS_COLLECTION, proof["task_id"], {"sub_tasks": task["sub_tasks"]})
        update_document(PROOFS_COLLECTION, proof_id, {"status": "rejected"})
        adjust_reliability(proof["ngo_id"], REJECTED_PROOF_PENALTY)
        proof["status"] = "rejected"

    return proof


def list_proofs(status: Optional[str] = None, ngo_id: Optional[str] = None) -> dict:
    """Returns proofs, optionally filtered by status ('pending_verification' |
    'approved' | 'rejected') and/or ngo_id. Newest first. Powers the admin
    Proof Review queue and a volunteer's own submission history."""
    proofs = get_all_documents(PROOFS_COLLECTION)

    if status:
        proofs = [p for p in proofs if p.get("status") == status]
    if ngo_id:
        proofs = [p for p in proofs if p.get("ngo_id") == ngo_id]

    proofs.sort(key=lambda p: p.get("created_at", ""), reverse=True)
    return {"count": len(proofs), "proofs": proofs}