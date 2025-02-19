from jose.exceptions import JWTError
from jose import jwt
from typing import Optional
from datetime import datetime, timedelta
import os

from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[
                             ALGORITHM], options={"verify_aud": False})
        return payload
    except JWTError as e:
        return None
    
def verify_token(token: str):
    payload = decode_access_token(token)
    return payload is not None


def get_user_email_from_token(token: str):
    payload = decode_access_token(token)
    if payload:
        return payload.get("email")
    return "none"
