from pydantic import BaseModel
from typing import Optional


class Location(BaseModel):
    lat: float
    lng: float


class Need(BaseModel):
    id: Optional[str] = None
    location: Location
    need_type: str          # e.g. "water", "food", "medical", "education"
    severity: str            # "low" | "medium" | "high" | "critical"
    status: str = "open"     # "open" | "assigned" | "resolved"
    quantity: Optional[float] = None      # NEW — e.g. 1700 (liters, meals, kits — whatever unit fits)
    unit: Optional[str] = None 
    source_ngo: Optional[str] = None
    raw_notes: Optional[str] = None