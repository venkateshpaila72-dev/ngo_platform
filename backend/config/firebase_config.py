import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from config.settings import FIREBASE_CREDENTIALS_PATH

_app = None
_db = None


def get_firestore_client():
    global _app, _db

    if _db is not None:
        return _db

    try:
        # Running on Render (environment variable)
        firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")

        if firebase_json:
            service_account = json.loads(firebase_json)
            cred = credentials.Certificate(service_account)
        else:
            # Running locally
            cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)

        _app = firebase_admin.initialize_app(cred)
        _db = firestore.client()

    except Exception as e:
        raise RuntimeError(
            f"Failed to initialize Firebase. Original error: {e}"
        )

    return _db