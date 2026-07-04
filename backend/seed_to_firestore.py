"""
Seeds Firestore with synthetic 'needs' test data for local development.

Usage:
    pip install firebase-admin python-dotenv
    python seed_to_firestore.py

Requires your .env (already has these):
    FIREBASE_PROJECT_ID=ngo-coordination-platform
    FIREBASE_CREDENTIALS_PATH=./config/firebase-service-account.json

Reads seed_needs.json (same folder) and writes each record as a new
document in the NEEDS_COLLECTION collection.
"""

import json
import os
import sys

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

load_dotenv()

# CHANGE THIS if your config/settings.py NEEDS_COLLECTION value is different
NEEDS_COLLECTION = "needs"

CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
SEED_FILE = os.path.join(os.path.dirname(__file__), "seed_needs.json")

BATCH_LIMIT = 450  # Firestore hard limit is 500 writes per batch; leave headroom


def main():
    if not CREDENTIALS_PATH or not os.path.exists(CREDENTIALS_PATH):
        print(f"ERROR: FIREBASE_CREDENTIALS_PATH not found: {CREDENTIALS_PATH}")
        print("Check the path in your .env is correct relative to where you run this script.")
        sys.exit(1)

    if not os.path.exists(SEED_FILE):
        print(f"ERROR: {SEED_FILE} not found. Run generate_seed_data.py first, "
              "or place seed_needs.json next to this script.")
        sys.exit(1)

    with open(SEED_FILE) as f:
        needs = json.load(f)

    print(f"Loaded {len(needs)} needs from {SEED_FILE}")

    cred = credentials.Certificate(CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred, {"projectId": PROJECT_ID})
    db = firestore.client()

    collection_ref = db.collection(NEEDS_COLLECTION)

    written = 0
    for start in range(0, len(needs), BATCH_LIMIT):
        chunk = needs[start:start + BATCH_LIMIT]
        batch = db.batch()
        for need in chunk:
            doc_ref = collection_ref.document()  # auto-generated ID
            batch.set(doc_ref, need)
        batch.commit()
        written += len(chunk)
        print(f"  Committed {written}/{len(needs)}")

    print(f"Done. {written} documents written to '{NEEDS_COLLECTION}' collection "
          f"in project '{PROJECT_ID}'.")


if __name__ == "__main__":
    main()