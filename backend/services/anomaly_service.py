from datetime import datetime, timezone
from typing import List, Optional, Tuple

import numpy as np
from sklearn.ensemble import IsolationForest

from config.settings import PROOFS_COLLECTION
from utils.firestore_helpers import get_all_documents

# Isolation Forest needs a reasonable amount of history to define "normal".
# Below this, we skip ML detection entirely and rely on the distance
# threshold already in proof_service.py - a system that's just getting
# started shouldn't flag everything as anomalous just because it has no
# baseline yet.
MIN_SAMPLES_FOR_ML = 10

# Assume roughly this fraction of historical submissions might be outliers.
# This is a modeling assumption, not a measured rate - revisit once you have
# real rejected-proof data to calibrate against.
CONTAMINATION = 0.1


def _extract_features(proof: dict) -> Optional[List[float]]:
    """Pulls [distance_km, feedback_rating, hour_of_day] from a proof.
    Returns None if distance_km is missing (older proofs predating this
    field), so they're simply excluded from the training set rather than
    breaking the fit."""
    distance_km = proof.get("distance_km")
    if distance_km is None:
        return None

    rating = proof.get("feedback_rating")
    rating = float(rating) if rating is not None else 3.0  # neutral default

    try:
        hour = datetime.fromisoformat(proof["created_at"]).hour
    except (KeyError, ValueError, TypeError):
        hour = 12

    return [float(distance_km), rating, float(hour)]


def detect_ml_anomaly(distance_km: float, feedback_rating: Optional[int]) -> Tuple[bool, str]:
    """
    Fits an Isolation Forest fresh on every past proof's features plus this
    candidate submission, then checks whether the candidate lands in the
    outlier partition. Retrained on every call rather than cached, since
    proof volume in this system is small enough (dozens-hundreds) that this
    is cheap, and it means the model always reflects the latest data
    without a separate retraining job to maintain.

    Returns (False, "") when there's insufficient history - see
    MIN_SAMPLES_FOR_ML.
    """
    history = get_all_documents(PROOFS_COLLECTION)
    feature_rows = [f for f in (_extract_features(p) for p in history) if f is not None]

    if len(feature_rows) < MIN_SAMPLES_FOR_ML:
        return False, ""

    candidate_hour = datetime.now(timezone.utc).hour
    candidate_rating = float(feedback_rating) if feedback_rating is not None else 3.0
    candidate = [float(distance_km), candidate_rating, float(candidate_hour)]

    X = np.array(feature_rows + [candidate])

    model = IsolationForest(contamination=CONTAMINATION, random_state=42)
    predictions = model.fit_predict(X)

    is_anomaly = predictions[-1] == -1
    reason = (
        "Flagged by anomaly-detection model: this submission's distance, "
        "rating, and timing pattern is statistically unusual compared to "
        f"the {len(feature_rows)} past submissions on record."
        if is_anomaly else ""
    )
    return is_anomaly, reason