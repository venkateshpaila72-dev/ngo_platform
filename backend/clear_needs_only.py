"""
Deletes all documents in the 'needs' collection. Run before re-seeding
if you need a clean slate.

Usage (from backend/ root):
    python clear_needs_only.py
"""

from utils.firestore_helpers import get_firestore_client


def main():
    db = get_firestore_client()
    docs = list(db.collection("needs").stream())
    print(f"Found {len(docs)} documents in 'needs'. Deleting...")
    for doc in docs:
        doc.reference.delete()
    print(f"Deleted {len(docs)} documents.")


if __name__ == "__main__":
    main()