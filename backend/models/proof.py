from typing import Optional
from pydantic import BaseModel
from models.need import Location


class ProofSubmission(BaseModel):
    id: Optional[str] = None
    task_id: str
    ngo_id: str
    volunteer_id: Optional[str] = None
    photo_url: str
    location: Location
    story_text: Optional[str] = None
    feedback_rating: Optional[int] = None
    status: str = "pending_verification"   # "pending_verification" | "approved" | "rejected"
    distance_km: Optional[float] = None    # distance from need site at submission time
    anomaly_flagged: bool = False
    anomaly_reason: Optional[str] = None