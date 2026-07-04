from config.settings import CHAT_COLLECTION, TASKS_COLLECTION
from utils.firestore_helpers import add_document, get_all_documents, get_document

CLOSED_TASK_STATUSES = {"verified", "resolved_partial"}


def send_message(task_id: str, sender_id: str, sender_type: str, text: str) -> dict:
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")
    if task["status"] in CLOSED_TASK_STATUSES:
        raise ValueError(f"This task's chat is archived (task status: '{task['status']}')")

    data = {"task_id": task_id, "sender_id": sender_id, "sender_type": sender_type, "text": text}
    msg_id = add_document(CHAT_COLLECTION, data)
    return {"id": msg_id, **data}


def get_messages(task_id: str) -> dict:
    task = get_document(TASKS_COLLECTION, task_id)
    if task is None:
        raise ValueError(f"Task not found: {task_id}")

    all_messages = [m for m in get_all_documents(CHAT_COLLECTION) if m["task_id"] == task_id]
    return {
        "task_id": task_id,
        "archived": task["status"] in CLOSED_TASK_STATUSES,
        "messages": all_messages,
    }