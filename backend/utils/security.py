"""Security utility helpers."""

import hashlib


def hash_password(password: str) -> str:
    """Return a SHA-256 hash of the provided password."""

    return hashlib.sha256(password.encode()).hexdigest()
