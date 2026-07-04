from typing import Optional
from config.settings import NGOS_COLLECTION, VOLUNTEERS_COLLECTION
from utils.firestore_helpers import add_document, get_all_documents, get_document
from utils.security import hash_password, verify_password


def _strip_password(volunteer: dict) -> dict:
    return {k: v for k, v in volunteer.items() if k != "password_hash"}


def register_volunteer(ngo_id: str, name: str, email: str, password: str) -> dict:
    if get_document(NGOS_COLLECTION, ngo_id) is None:
        raise ValueError(f"NGO not found: {ngo_id}")

    all_volunteers = get_all_documents(VOLUNTEERS_COLLECTION)
    if any(v.get("email") == email for v in all_volunteers):
        raise ValueError(f"A volunteer with email '{email}' already exists")

    data = {
        "name": name,
        "email": email,
        "ngo_id": ngo_id,
        "password_hash": hash_password(password),
        "status": "active",
    }
    volunteer_id = add_document(VOLUNTEERS_COLLECTION, data)
    return _strip_password({"id": volunteer_id, **data})


def login_volunteer(email: str, password: str) -> dict:
    all_volunteers = get_all_documents(VOLUNTEERS_COLLECTION)
    match = next((v for v in all_volunteers if v.get("email") == email), None)
    if match is None or not verify_password(password, match.get("password_hash", "")):
        raise ValueError("Invalid email or password")
    return _strip_password(match)


def list_volunteers(ngo_id: Optional[str] = None) -> dict:
    all_volunteers = get_all_documents(VOLUNTEERS_COLLECTION)
    if ngo_id:
        all_volunteers = [v for v in all_volunteers if v.get("ngo_id") == ngo_id]
    return {"count": len(all_volunteers), "volunteers": [_strip_password(v) for v in all_volunteers]}