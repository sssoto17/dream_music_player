from os import path, environ
from flask import Blueprint, request, make_response, jsonify
from sqlalchemy import select

from ..db import db
from ..db.models import *
from ..utils import ic, b64
from .spotify import get_refreshed_token

app = Blueprint("token",__name__,url_prefix="/token")

@app.route("/<int:id>", methods=["GET","POST"])
def db_rf_token(id):
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

@app.route("/refresh/<int:user_id>")
def refresh_token(user_id):
    try:
        q = select(Refresh_Token).where(Refresh_Token.user_id == user_id)
        refresh_token = db.session.scalar(q).refresh_token

        token = get_refreshed_token(refresh_token)

        return make_response(token, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)