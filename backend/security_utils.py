"""
Security utilities including AES-256-GCM encryption
"""
import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag

# Primary encryption key, must be exactly 32 bytes (256 bits)
ENCRYPTION_KEY = os.getenv("AES_ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef").encode("utf-8")

def generate_key() -> bytes:
    """Generate a new secure 256-bit key"""
    return AESGCM.generate_key(bit_length=256)

def encrypt_data(data: str) -> str:
    """Encrypt a string using AES-256-GCM"""
    if not data:
        return data

    aesgcm = AESGCM(ENCRYPTION_KEY)
    nonce = os.urandom(12) # GCM standard nonce size is 12 bytes
    
    # Encrypt
    ciphertext = aesgcm.encrypt(nonce, data.encode("utf-8"), None)
    
    # Prepend nonce to ciphertext for decryption (nonce is not secret)
    combined = nonce + ciphertext
    return base64.b64encode(combined).decode("utf-8")

def decrypt_data(encrypted_data: str) -> str:
    """Decrypt an AES-256-GCM encrypted string"""
    if not encrypted_data:
        return encrypted_data

    try:
        combined = base64.b64decode(encrypted_data.encode("utf-8"))
        
        # Extract nonce (first 12 bytes) and ciphertext
        nonce = combined[:12]
        ciphertext = combined[12:]
        
        aesgcm = AESGCM(ENCRYPTION_KEY)
        decrypted_data = aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_data.decode("utf-8")
    
    except InvalidTag:
        raise ValueError("Invalid tag - data corruption or wrong key")
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")
