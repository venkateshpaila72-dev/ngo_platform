from config.settings import NGOS_COLLECTION
from utils.firestore_helpers import get_document, update_document

# Small, deliberately conservative nudges - reliability should drift over
# many tasks, not swing wildly from one outcome.
COMPLETE_BONUS = 4.0
DROP_PENALTY = -8.0
REJECTED_PROOF_PENALTY = -3.0

MIN_SCORE = 0.0
MAX_SCORE = 100.0


def adjust_reliability(ngo_id: str, delta: float) -> float:
    """Applies delta to an NGO's reliability_score, clamped to [0, 100].
    Returns the new score, or None if the NGO doesn't exist (fails silently
    since this is a side-effect of task/proof actions, not the primary
    operation - a missing NGO shouldn't block completing a task)."""
    ngo = get_document(NGOS_COLLECTION, ngo_id)
    if ngo is None:
        return None

    current = ngo.get("reliability_score", 70.0)
    new_score = max(MIN_SCORE, min(MAX_SCORE, current + delta))
    update_document(NGOS_COLLECTION, ngo_id, {"reliability_score": new_score})
    return new_score