import datetime
from typing import Optional
from config.firebase_config import get_firestore_client


def _validate_doc_id(doc_id: str, collection_name: str) -> None:
    if not doc_id or not isinstance(doc_id, str) or not doc_id.strip():
        raise ValueError(
            f"Invalid document ID for collection '{collection_name}': "
            f"received empty/placeholder value ({doc_id!r})."
        )
    if "/" in doc_id:
        raise ValueError(
            f"Invalid document ID for collection '{collection_name}': "
            f"'{doc_id}' contains a '/', which breaks Firestore's path parsing."
        )


def add_document(collection_name: str, data: dict) -> str:
    """Adds a document, auto-stamping id and created_at."""
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document()
    payload = {**data, "id": doc_ref.id, "created_at": datetime.datetime.utcnow().isoformat()}
    doc_ref.set(payload)
    return doc_ref.id


def get_all_documents(collection_name: str) -> list:
    db = get_firestore_client()
    docs = db.collection(collection_name).stream()
    return [doc.to_dict() for doc in docs]


def get_document(collection_name: str, doc_id: str) -> Optional[dict]:
    _validate_doc_id(doc_id, collection_name)
    db = get_firestore_client()
    doc = db.collection(collection_name).document(doc_id).get()
    return doc.to_dict() if doc.exists else None


def update_document(collection_name: str, doc_id: str, updates: dict) -> bool:
    _validate_doc_id(doc_id, collection_name)
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document(doc_id)
    if not doc_ref.get().exists:
        raise ValueError(f"Document '{doc_id}' not found in collection '{collection_name}'")
    doc_ref.update(updates)
    return True