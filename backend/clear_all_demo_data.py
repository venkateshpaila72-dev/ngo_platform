"""
Deletes ALL documents from every collection used by the platform. Use this
to get a clean slate before re-running seed_full_demo.py — otherwise you'll
just keep adding more demo data on top of what's already there (which is
harmless, just noisier).

Usage (from backend/ root, same folder as main.py):
    python clear_all_demo_data.py

This asks for confirmation before deleting anything.
"""

from utils.firestore_helpers import get_firestore_client

COLLECTIONS = [
    "needs", "ngos", "tasks", "volunteers", "proofs",
    "chat_messages", "events",
]


def main():
    db = get_firestore_client()

    print("This will permanently delete ALL documents from:")
    for c in COLLECTIONS:
        print(f"  - {c}")
    confirm = input("\nType 'yes' to continue: ").strip().lower()
    if confirm != "yes":
        print("Aborted, nothing deleted.")
        return

    for collection_name in COLLECTIONS:
        docs = list(db.collection(collection_name).stream())
        print(f"Deleting {len(docs)} documents from '{collection_name}'...")
        for doc in docs:
            doc.reference.delete()

    print("\nDone. All collections cleared. Run `python seed_full_demo.py` next.")


if __name__ == "__main__":
    main()