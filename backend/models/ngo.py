from typing import Dict, Optional

from pydantic import BaseModel, Field, field_validator

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
    password_hash: Optional[str] = None                             # never returned to the client
    en_route: Optional[dict] = None                                 # {destination: {lat,lng}, eta_minutes, updated_at}

    @field_validator("capabilities")
    @classmethod
    def validate_capabilities(cls, v):
        for need_type, weight in v.items():
            if not (0 <= weight <= 100):
                raise ValueError(f"capabilities['{need_type}'] must be between 0 and 100, got {weight}")
        return v

    @field_validator("reliability_score")
    @classmethod
    def validate_reliability(cls, v):
        if not (0 <= v <= 100):
            raise ValueError(f"reliability_score must be between 0 and 100, got {v}")
        return v