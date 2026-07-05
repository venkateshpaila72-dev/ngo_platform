from typing import Optional

from pydantic import BaseModel

from models.need import Location


class Event(BaseModel):
    id: Optional[str] = None
    name: str
    location: Location
    radius_km: float = 10.0
    active: bool = True
    description: Optional[str] = None