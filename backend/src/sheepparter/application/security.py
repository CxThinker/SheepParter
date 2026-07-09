import hashlib
import hmac
import secrets


class PasswordHasher:
    _algorithm = "pbkdf2_sha256"
    _iterations = 210_000
    _salt_bytes = 16

    def hash_password(self, password: str) -> str:
        salt = secrets.token_bytes(self._salt_bytes)
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            self._iterations,
        )
        return f"{self._algorithm}${self._iterations}${salt.hex()}${digest.hex()}"

    def verify(self, password: str, stored_hash: str) -> bool:
        try:
            algorithm, iterations_text, salt_hex, digest_hex = stored_hash.split("$", 3)
            iterations = int(iterations_text)
            salt = bytes.fromhex(salt_hex)
            expected_digest = bytes.fromhex(digest_hex)
        except (ValueError, TypeError):
            return False

        if algorithm != self._algorithm:
            return False

        actual_digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt,
            iterations,
        )
        return hmac.compare_digest(actual_digest, expected_digest)


class SessionTokenService:
    def generate_token(self) -> str:
        return secrets.token_urlsafe(48)

    def hash_token(self, token: str) -> str:
        return hashlib.sha256(token.encode("utf-8")).hexdigest()
