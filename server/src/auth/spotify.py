from os import environ
from flask import Blueprint, request, session, make_response, redirect, url_for, jsonify 
from requests import get, post
from uuid import uuid4
from urllib.parse import urlencode

from ..db import db
from ..db.models import *
from ..utils import ic, b64, expires_at
from ..api import *

app = Blueprint('spotify', __name__)

client_url = environ["CLIENT_URL"]
api_url = environ["SPOTIFY_API_URL"]
access_url = environ["SPOTIFY_ACCESS_URL"]
token_url = environ["SPOTIFY_TOKEN_URL"]

client_id = environ["SPOTIFY_CLIENT_ID"]
client_secret = environ["SPOTIFY_CLIENT_SECRET"]

scope = "streaming user-read-email user-read-private"
redirect_uri = environ["SPOTIFY_REDIRECT_URI"]
state = uuid4().hex

@app.route("/authorize")
def authorize_spotify():
    try:
        payload = {
                "client_id": client_id,
                "response_type": "code",
                "redirect_uri": redirect_uri,
                "state": state,
                "scope": scope,
                "show_dialog": environ["SPOTIFY_AUTH_TESTING_MODE"]
            }
    
        return redirect(f"{access_url}{urlencode(payload)}")
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 405)

@app.route("/callback")
def spotify_callback():
    try:
        if "error" in request.args:
            raise Exception(request.args["error"])
        
        if request.args["state"] != state:
            raise Exception("Invalid state. Access denied.")
        
        if "code" in request.args:
            credentials = b64(f"{client_id}:{client_secret}")
            payload = {
                "grant_type": "authorization_code",
                "code": request.args["code"],
                "redirect_uri": redirect_uri
            }
            headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/x-www-form-urlencoded"
            }

            token = post(token_url, params=payload, headers=headers).json()
            spotify_data = get(f"{api_url}/me", headers={"Authorization": "Bearer " + token["access_token"]}).json()

            payload = {
                "username": "",
                "email": "",
                "password": "temp_password",
                "first_name": spotify_data["display_name"].split()[0], 
                "last_name": spotify_data["display_name"].split()[-1],
                "refresh_token": token["refresh_token"]
                }

            user = post(url_for("api.users.users", _external=True), data=payload).json()

            if user["error"]:
                ic("user verified")
                url = f"{client_url}/login?exists=1"
                return redirect(url)

            url = f"{client_url}/auth/signup?id={user["id"]}&key={user["verification_key"]}&token={token["access_token"]}"
            return redirect(url)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 405)

