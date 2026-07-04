from config.firebase_config import get_firestore_client
from config.settings import NEEDS_COLLECTION

db = get_firestore_client()

test_need = {
    "location": {"lat": 16.3067, "lng": 80.4365},
    "need_type": "water",
    "severity": "critical",
    "status": "open",
    "quantity": 1700,
    "unit": "liters",
    "source_ngo": None,
    "raw_notes": "Test need for split-task verification (Phase 4)",
}

doc_ref = db.collection(NEEDS_COLLECTION).document()
doc_ref.set({**test_need, "id": doc_ref.id})

print(f"Created test need with id: {doc_ref.id}")