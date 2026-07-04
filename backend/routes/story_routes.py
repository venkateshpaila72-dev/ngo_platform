from fastapi import APIRouter, HTTPException
from services.story_service import generate_impact_story

router = APIRouter()


@router.post("/proofs/{proof_id}/generate-story")
def generate_story(proof_id: str):
    try:
        return generate_impact_story(proof_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))