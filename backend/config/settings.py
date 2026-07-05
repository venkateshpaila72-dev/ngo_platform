import os
import sys
from dotenv import load_dotenv

load_dotenv()

FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PORT = int(os.getenv("PORT", 8080))
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

NEEDS_COLLECTION = "needs"
NGOS_COLLECTION = "ngos"
TASKS_COLLECTION = "tasks"
VOLUNTEERS_COLLECTION = "volunteers"
PROOFS_COLLECTION = "proofs"
CHAT_COLLECTION = "chat_messages"
EVENTS_COLLECTION = "events"

# Tuned during Phase 2 testing: 15km wrongly chained separate hotspots
# together (a single bridging point merged a "water" cluster and a "food"
# cluster into one). 5km correctly kept them separate. Do not change this
# back to 15 without re-running the cluster separation test.
CLUSTER_RADIUS_KM = 5
MIN_SAMPLES_PER_CLUSTER = 1


def validate_config():
    missing = []

    if not FIREBASE_PROJECT_ID:
        missing.append("FIREBASE_PROJECT_ID")

    # If running on Render using JSON env variable,
    # don't require the credentials file.
    if not os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON"):
        if not FIREBASE_CREDENTIALS_PATH:
            missing.append("FIREBASE_CREDENTIALS_PATH")
        elif not os.path.exists(FIREBASE_CREDENTIALS_PATH):
            print(
                f"[CONFIG ERROR] FIREBASE_CREDENTIALS_PATH is set but file not found at: {FIREBASE_CREDENTIALS_PATH}"
            )
            sys.exit(1)

    if missing:
        print(f"[CONFIG ERROR] Missing required .env values: {', '.join(missing)}")
        sys.exit(1)