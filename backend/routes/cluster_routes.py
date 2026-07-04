from fastapi import APIRouter, HTTPException
from services.clustering_service import get_clusters

router = APIRouter()


@router.get("/clusters")
def fetch_clusters():
    """
    Returns geographic hotspots of open needs, ranked by severity.
    This powers the map/heatmap on the frontend.
    """
    try:
        return get_clusters()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Clustering failed: {e}")