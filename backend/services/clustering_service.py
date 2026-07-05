import numpy as np
from collections import Counter
from sklearn.cluster import DBSCAN
from config.settings import NEEDS_COLLECTION, CLUSTER_RADIUS_KM, MIN_SAMPLES_PER_CLUSTER
from utils.firestore_helpers import get_all_documents
from utils.geo_utils import compute_centroid

SEVERITY_WEIGHTS = {"low": 1, "medium": 2, "high": 3, "critical": 4}
EARTH_RADIUS_KM = 6371.0088


def _compute_severity_score(needs_in_cluster: list) -> float:
    """
    Combines average severity with cluster size into a single 0-10 score.
    A cluster with more needs, or more severe needs, ranks higher.
    """
    weights = [SEVERITY_WEIGHTS.get(n["severity"], 1) for n in needs_in_cluster]
    avg_weight = sum(weights) / len(weights)

    base_score = (avg_weight / 4) * 10
    size_bonus = min(len(needs_in_cluster) - 1, 5) * 0.5

    return round(min(base_score + size_bonus, 10), 1)


def _dominant_need_type(needs_in_cluster: list) -> str:
    types = [n["need_type"] for n in needs_in_cluster]
    return Counter(types).most_common(1)[0][0]


def get_clusters(needs_override: list = None) -> dict:
    """
    Fetches all open needs, groups nearby ones into hotspots using DBSCAN
    (haversine distance), and returns each hotspot with a centroid,
    dominant need type, and severity score. Noise points (no nearby
    neighbors) become their own single-need cluster — nothing disappears.

    needs_override: if provided, clusters this list instead of fetching all
    open needs from Firestore. Used by event-scoped clustering (see
    event_service.get_clusters_for_event) to scope the map to one venue
    without duplicating the DBSCAN logic. Leave None for normal behavior.
    """
    if needs_override is not None:
        open_needs = needs_override
    else:
        all_needs = get_all_documents(NEEDS_COLLECTION)
        open_needs = [n for n in all_needs if n.get("status") == "open"]

    if not open_needs:
        return {"clusters": []}

    coords_rad = np.radians([
        [n["location"]["lat"], n["location"]["lng"]] for n in open_needs
    ])

    eps_radians = CLUSTER_RADIUS_KM / EARTH_RADIUS_KM

    db = DBSCAN(
        eps=eps_radians,
        min_samples=MIN_SAMPLES_PER_CLUSTER,
        algorithm="ball_tree",
        metric="haversine",
    ).fit(coords_rad)

    labels = db.labels_

    grouped = {}
    noise_counter = 0
    for need, label in zip(open_needs, labels):
        if label == -1:
            noise_counter -= 1
            key = noise_counter
        else:
            key = int(label)
        grouped.setdefault(key, []).append(need)

    clusters = []
    for cluster_id, needs_in_cluster in grouped.items():
        centroid = compute_centroid([n["location"] for n in needs_in_cluster])
        clusters.append({
            "cluster_id": cluster_id,
            "centroid": centroid,
            "need_count": len(needs_in_cluster),
            "dominant_need": _dominant_need_type(needs_in_cluster),
            "severity_score": _compute_severity_score(needs_in_cluster),
            "need_ids": [n["id"] for n in needs_in_cluster],
        })

    clusters.sort(key=lambda c: c["severity_score"], reverse=True)

    return {"clusters": clusters}