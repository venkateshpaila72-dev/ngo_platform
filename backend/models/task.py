from typing import List, Optional
from pydantic import BaseModel


class SubTask(BaseModel):
    ngo_id: str
    volunteer_id: Optional[str] = None
    quantity: Optional[float] = None
    status: str = "assigned"   # "assigned" | "accepted" | "pending_verification" | "dropped" | "completed"


class Task(BaseModel):
    id: Optional[str] = None
    need_id: str
    need_type: str
    total_quantity: Optional[float] = None
    unit: Optional[str] = None
    status: str = "in_progress"
    sub_tasks: List[SubTask] = []