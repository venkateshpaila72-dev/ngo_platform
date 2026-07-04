from typing import List, Optional
from pydantic import BaseModel


class SubTask(BaseModel):
    ngo_id: str
    quantity: Optional[float] = None
    status: str = "assigned"   # "assigned" | "accepted" | "dropped" | "completed"


class Task(BaseModel):
    id: Optional[str] = None
    need_id: str
    need_type: str
    total_quantity: Optional[float] = None
    unit: Optional[str] = None
    status: str = "in_progress"   # "in_progress" | "partially_covered" | "verified"
    sub_tasks: List[SubTask] = []