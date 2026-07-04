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
        cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
        _app = firebase_admin.initialize_app(cred)
        _db = firestore.client()
    except Exception as e:
        raise RuntimeError(
            f"Failed to initialize Firebase. Check that FIREBASE_CREDENTIALS_PATH "
            f"points to a valid service account JSON file. Original error: {e}"
        )

    return _db