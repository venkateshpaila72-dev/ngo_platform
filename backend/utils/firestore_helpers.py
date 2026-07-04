from typing import Optional
from config.firebase_config import get_firestore_client


def add_document(collection_name: str, data: dict) -> str:
    """Adds a document to a collection and returns the generated document ID."""
    db = get_firestore_client()
    doc_ref = db.collection(collection_name).document()
    data["id"] = doc_ref.id
    doc_ref.set(data)
    return doc_ref.id


def get_all_documents(collection_name: str) -> list:
    """Returns all documents in a collection as a list of dicts."""
    db = get_firestore_client()
    docs = db.collection(collection_name).stream()
    return [doc.to_dict() for doc in docs]


def get_document(collection_name: str, doc_id: str) -> Optional[dict]:
    """Returns a single document by ID, or None if it doesn't exist."""
    db = get_firestore_client()
    doc = db.collection(collection_name).document(doc_id).get()
    return doc.to_dict() if doc.exists else None


def update_document(collection_name: str, doc_id: str, updates: dict) -> bool:
    """Updates fields on an existing document."""
    db = get_firestore_client()
    db.collection(collection_name).document(doc_id).update(updates)
    return True