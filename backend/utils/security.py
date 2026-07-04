import hashlib
import secrets


def hash_password(password: str) -> str:
    """PBKDF2 with a random salt — no extra dependency needed beyond stdlib."""
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000)
    return f"{salt}${hashed.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        salt, hash_hex = stored.split("$")
    except (ValueError, AttributeError):
        return False
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), 100_000)
    return hashed.hex() == hash_hex