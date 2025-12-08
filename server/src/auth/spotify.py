from os import environ
from flask import Blueprint, request, make_response, redirect, url_for 
from requests import get, post
from uuid import uuid4
from urllib.parse import urlencode
from ..utils import ic, b64

app = Blueprint('spotify', __name__)

client_id = environ["SPOTIFY_CLIENT_ID"]
client_secret = environ["SPOTIFY_CLIENT_SECRET"]

credentials = b64(f"{client_id}:{client_secret}")

scope = "streaming user-read-email user-read-private"
redirect_uri = environ["SPOTIFY_REDIRECT_URI"]
state = uuid4().hex

@app.route("/authorize")
def get_authorization():
    url = environ["SPOTIFY_ACCESS_URL"]
    
    payload = {
                "response_type": "code",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state,
                "scope": scope,
                "show_dialog": environ["SPOTIFY_AUTH_TESTING_MODE"]
            }
    
    return redirect(f"{url}{urlencode(payload)}")

@app.route("/callback")
def get_callback():
    try:
        if "error" in request.args:
            raise Exception(request.args["error"])
        
        if request.args["state"] != state:
            raise Exception("Invalid state. Access denied.")
        
        if "code" in request.args:
            token = get_auth_access_token(request.args["code"])

            spotify_data = get(f"{environ["SPOTIFY_API_URL"]}/me", headers={"Authorization": "Bearer " + token["access_token"]}).json()

            payload = {
                "username": "",
                "email": "",
                "password": "temp_password",
                "first_name": spotify_data["display_name"].split()[0], 
                "last_name": spotify_data["display_name"].split()[-1],
                "refresh_token": token["refresh_token"]
                }

            user = post(url_for("api.users.users", _external=True), data=payload).json()
            client_url = environ["CLIENT_URL"]

            url = f"{client_url}/auth/signup?id={user["id"]}&key={user["verification_key"]}&token={token["access_token"]}"
            return redirect(url)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 405)

url = environ["SPOTIFY_TOKEN_URL"]

@app.route("/client/token")
def get_client_access_token():
    headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    payload = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
        }
    
    return post(url, headers=headers, params=payload).json()

def get_auth_access_token(authorization_code):
    headers = {
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    payload = {
                "grant_type": "authorization_code",
                "code": authorization_code,
                "redirect_uri": redirect_uri
            }
    
    return post(url, headers=headers, params=payload).json()

def get_refreshed_token(refresh_token):
    if not refresh_token: raise Exception("Invalid refresh_token.")
    
    headers = {
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    
    payload = {
        "grant_type": 'refresh_token',
        "refresh_token": refresh_token,
    }

    return post(url, headers=headers, params=payload).json()