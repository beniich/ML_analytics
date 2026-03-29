"""
MinIO object storage integration with Server-Side Encryption (SSE-C)
"""
import os
import io
from minio import Minio
from minio.sse import SseCustomerKey

# MinIO Config
MINIO_URL = os.getenv("MINIO_URL", "localhost:9000").replace("http://", "").replace("https://", "")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"

# SSE-C Key needs to be 32 bytes for MinIO
SSE_SECRET_KEY = os.getenv("SSE_CUSTOMER_KEY", "default-sse-secret-key-must-be-32").encode('utf-8')[:32]
if len(SSE_SECRET_KEY) < 32:
    SSE_SECRET_KEY = SSE_SECRET_KEY.ljust(32, b'0')

sse_key = SseCustomerKey(SSE_SECRET_KEY)

def get_minio_client() -> Minio:
    """Returns an authenticated MinIO client"""
    return Minio(
        MINIO_URL,
        access_key=MINIO_ACCESS_KEY,
        secret_key=MINIO_SECRET_KEY,
        secure=MINIO_SECURE
    )

def ensure_bucket_exists(client: Minio, bucket_name: str):
    """Ensure the given bucket exists"""
    found = client.bucket_exists(bucket_name)
    if not found:
        client.make_bucket(bucket_name)

def upload_file_encrypted(bucket_name: str, object_name: str, file_data: bytes, content_type: str = "application/octet-stream") -> str:
    """Upload a file to MinIO using Server-Side Encryption (SSE-C)"""
    client = get_minio_client()
    ensure_bucket_exists(client, bucket_name)
    
    data_stream = io.BytesIO(file_data)
    length = len(file_data)
    
    # Upload with SSE-C
    client.put_object(
        bucket_name,
        object_name,
        data_stream,
        length,
        content_type=content_type,
        sse=sse_key
    )
    return object_name

def download_file_encrypted(bucket_name: str, object_name: str) -> bytes:
    """Download an SSE-C encrypted file from MinIO"""
    client = get_minio_client()
    
    response = client.get_object(
        bucket_name,
        object_name,
        sse=sse_key
    )
    try:
        return response.read()
    finally:
        response.close()
        response.release_conn()
