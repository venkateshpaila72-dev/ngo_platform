from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from models.need import Location
from services.proof_service import list_proofs, submit_proof, verify_proof

router = APIRouter()


class ProofSubmitRequest(BaseModel):
    task_id: str
    ngo_id: str
    photo_url: str
    location: Location
    volunteer_id: Optional[str] = None
    story_text: Optional[str] = None
    feedback_rating: Optional[int] = None


class VerifyRequest(BaseModel):
    approve: bool


@router.get("/proofs")
def get_proofs(status: Optional[str] = None, ngo_id: Optional[str] = None):
    """Lists proofs, optionally filtered by status and/or ngo_id.
    e.g. /proofs?status=pending_verification&ngo_id=abc123 for the admin
    review queue, or /proofs?ngo_id=abc123 for an NGO's full history."""
    return list_proofs(status, ngo_id)


@router.post("/proofs/submit")
def submit(body: ProofSubmitRequest):
    try:
        return submit_proof(
            body.task_id, body.ngo_id, body.photo_url, body.location.dict(),
            body.volunteer_id, body.story_text, body.feedback_rating,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/proofs/{proof_id}/verify")
def verify(proof_id: str, body: VerifyRequest):
    try:
        return verify_proof(proof_id, body.approve)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))