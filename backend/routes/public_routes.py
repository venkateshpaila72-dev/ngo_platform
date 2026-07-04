from fastapi import APIRouter
from services.public_service import get_impact_gallery, get_ngo_directory

router = APIRouter()


@router.get("/public/impact-gallery")
def impact_gallery(limit: int = 20):
    """No auth required — this is what funders/visitors see."""
    return get_impact_gallery(limit)


@router.get("/public/ngo-directory")
def ngo_directory():
    """No auth required — vetted list of NGOs ranked by tasks completed."""
    return get_ngo_directory()