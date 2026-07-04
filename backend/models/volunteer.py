from typing import Optional
from pydantic import BaseModel


class Volunteer(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    ngo_id: str
    password_hash: Optional[str] = None   # never returned to the client
    status: str = "active"