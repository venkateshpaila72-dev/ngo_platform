import math


def haversine_distance_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Returns the great-circle distance between two lat/lng points, in kilometers.
    Used for proximity scoring in the matching engine (Phase 3).
    """
    R = 6371.0088  # Earth's mean radius in km

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lng2 - lng1)

    a = (math.sin(d_phi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def compute_centroid(points: list) -> dict:
    """
    Given a list of {"lat": ..., "lng": ...} dicts, returns the simple
    average centroid. Fine for small, geographically tight clusters
    (which is what our clustering radius produces).
    """
    if not points:
        return {"lat": 0.0, "lng": 0.0}

    avg_lat = sum(p["lat"] for p in points) / len(points)
    avg_lng = sum(p["lng"] for p in points) / len(points)

    return {"lat": round(avg_lat, 6), "lng": round(avg_lng, 6)}