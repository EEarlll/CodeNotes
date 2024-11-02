from dotenv import load_dotenv
from functools import wraps
from flask import request, jsonify
import firebase_admin
import os
from firebase_admin import credentials, auth


def prGreen(skk):
    print("\033[92m {}\033[00m".format(skk))


# initialize firebase credentials
load_dotenv()
cred = credentials.Certificate(
    {
        "type": os.environ.get("TYPE"),
        "project_id": os.environ.get("PROJECT_ID"),
        "private_key_id": os.environ.get("PRIVATE_KEY_ID"),
        "private_key": os.environ.get("PRIVATE_KEY").replace(r"\n", "\n"),
        "client_email": os.environ.get("CLIENT_EMAIL"),
        "client_id": os.environ.get("CLIENT_ID"),
        "auth_uri": os.environ.get("AUTH_URI"),
        "token_uri": os.environ.get("TOKEN_URI"),
        "auth_provider_x509_cert_url": os.environ.get("AUTH_PROVIDER_X509_CERT_URL"),
        "client_x509_cert_url": os.environ.get("CLIENT_X509_CERT_URL"),
        "universe_domain": os.environ.get("UNIVERSE_DOMAIN"),
    }
)

firebase_admin.initialize_app(cred)


def verify_token(id_token):
    """Verify Firebase Id token. Return UID"""
    try:
        decoded_token = auth.verify_id_token(id_token,clock_skew_seconds=10)
        uid = decoded_token["uid"]
        return uid
    except Exception as e:
        prGreen(e)
        return None


def requires_auth(f):
    """Decorator to require Authentication and return decoded token"""

    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization").split(" ")[1]
        uid = "guest"

        if auth_header != "undefined":
            token = auth_header
            uid = verify_token(token)

        if not uid:
            return jsonify(f"Token Verification Error"), 401

        request.uid = uid
        return f(*args, **kwargs)

    return decorated
