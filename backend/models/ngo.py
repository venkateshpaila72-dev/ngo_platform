from typing import Dict, Optional

from pydantic import BaseModel, Field

from models.need import Location


class NGO(BaseModel):
    id: Optional[str] = None
    name: str
    district: str
    location: Location
    capabilities: Dict[str, int] = Field(default_factory=dict)      # need_type -> skill weight 0-100
    active_capacity: Dict[str, bool] = Field(default_factory=dict)  # need_type -> currently available
    reliability_score: float = 70.0                                 # 0-100, updated after task feedback
    contact_email: Optional[str] = None