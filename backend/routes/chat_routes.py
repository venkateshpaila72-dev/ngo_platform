from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chat_service import get_messages, send_message

router = APIRouter()


class MessageRequest(BaseModel):
    sender_id: str
    sender_type: str  # "ngo" | "volunteer" | "admin"
    text: str


@router.post("/tasks/{task_id}/chat")
def post_message(task_id: str, body: MessageRequest):
    try:
        return send_message(task_id, body.sender_id, body.sender_type, body.text)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/tasks/{task_id}/chat")
def fetch_messages(task_id: str):
    try:
        return get_messages(task_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))