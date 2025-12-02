from os import path, environ
from flask import Blueprint, request, make_response, jsonify
from sqlalchemy import select
from requests import post

from ..db import db
from ..db.models import *
from ..utils import ic, b64

app = Blueprint("token",__name__,url_prefix="/token")

@app.route("/<int:id>", methods=["GET","POST"])
def refresh_token(id):
    if request.method == "GET":
        try:
            q = select(Refresh_Token).where(Refresh_Token.user_id == id)
            token = db.session.scalars(q).one().to_dict()

            return make_response(token, 200)
        except Exception as ex:
            ic(ex)
            return make_response({"error": str(ex)}, 400)
        finally:
            if db.session in locals(): db.session.close()
    
    if request.method == "POST":
        try:
            data = request.get_json()
            token = Refresh_Token(
                refresh_token = data["refresh_token"],
                user_id = id             
            )

            db.session.add(token)
            db.session.commit()

            return make_response(jsonify(token.to_dict()), 200)
        except Exception as ex:
            db.session.rollback()

            return make_response({"error": str(ex)}, 400)
        finally:
            if db.session in locals(): db.session.close()

@app.route("/access/<int:id>")
def access_token(id):
    try:
        q = select(Refresh_Token).where(Refresh_Token.user_id == id)
        rf_token = db.session.scalar(q).refresh_token

        client_id = environ["SPOTIFY_CLIENT_ID"]
        client_secret = environ["SPOTIFY_CLIENT_SECRET"]
        url = environ["SPOTIFY_TOKEN_URL"]

        credentials = b64(f"{client_id}:{client_secret}")
        headers = {
                "Authorization": f"Basic {credentials}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        
        payload = {
            "grant_type": 'refresh_token',
            "refresh_token": rf_token,
        }

        token = post(url, params=payload, headers=headers).json()
        ic(token)

        if not token["access_token"]: raise Exception(str(token["error"]))

        return make_response({"access_token": token["access_token"]}, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)