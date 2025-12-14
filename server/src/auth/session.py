from flask import Blueprint, make_response
from sqlalchemy import select

from ..db import db
from ..db.models import User_Session, Refresh_Token
from ..utils import ic, expires_at
from .spotify import get_refreshed_token

app = Blueprint('session', __name__, url_prefix="/sessions")

@app.route("/verify/<string:access_token>")
def verify_session(access_token):
    try:
        q = select(User_Session).where(User_Session.access_token == access_token)
        user_session = db.session.scalar(q)

        if not user_session: raise Exception("Invalid session.")

        return make_response(user_session.to_dict(), 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)

@app.route("/refresh/<string:refresh_token>")
def refresh_session(refresh_token):
    try:
        q = select(Refresh_Token).where(Refresh_Token.refresh_token == refresh_token)
        rf = db.session.scalar(q)

        if not rf: raise Exception("Invalid refresh token.")

        token = get_refreshed_token(rf.refresh_token)

        user_session = User_Session(
            user_id = rf.user_id,
            token_id = rf.id,
            access_token = token["access_token"],
            expires_at = expires_at(token["expires_in"])
        )

        db.session.add(user_session)
        db.session.commit()

        return make_response(user_session.to_dict(), 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)