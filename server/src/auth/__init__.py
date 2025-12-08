from os import environ
from flask import Blueprint, request, render_template, make_response
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from datetime import datetime, timezone

from ..db import db
from ..db.models import *
from ..utils import ic, expires_at, generate_file_path, save_file, delete_file, send_email
from .validation import validate_verification_key

from . import session, spotify, token

app = Blueprint('auth', __name__, url_prefix='/auth')
app.register_blueprint(session.app)
app.register_blueprint(spotify.app)
# app.register_blueprint(token.app)

@app.post("/login")
def authenticate_user():
    email = request.form["email"]
    password = request.form["password"]

    try:
        q = select(User).where(User.email == email)
        user = db.session.scalar(q)

        if not user or not check_password_hash(user.password, password):
            raise Exception("Incorrect email or password.")

        token = spotify.get_refreshed_token(user.token.refresh_token)


        if not token["access_token"]: raise Exception(token)

        # CREATE SESSION
        user_session = UserSession(
            user_id = user.id,
            token_id = user.token.id,
            access_token = token["access_token"],
            expires_at = expires_at(token["expires_in"])
            )

        db.session.add(user_session)
        db.session.commit()

        return make_response(user_session.to_dict(), 200)
    except Exception as ex:
        ic(ex)
        return make_response(str(ex), 400)

@app.get("/reset/<string:email>")
def reset_user(email):
    q = select(User).where(User.email == email)
    user = db.session.scalar(q)

    if not user: raise Exception("User doesn't exist.")

    try:
        user.verification_key = uuid4().hex
        db.session.commit()

        if user.verification_key:
            email_template = render_template("email/password_reset.html", client_url=environ["CLIENT_URL"], verification_key=user.verification_key)
            send_email(user.email, "Reset your password", email_template) 
        
        return make_response({"status": "Password reset initiated."}, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)

@app.route("/me/<int:id>", methods=["GET", "PATCH", "DELETE"])
def auth_user(id):
    q = select(User).where(User.id == id)
    user = db.session.scalar(q)

    ic(user)

    if request.method == "GET": return make_response(user.to_dict(auth=True), 200)
    
    if request.method == "PATCH":
        try:
            user.username = request.form.get("username", user.username).strip()
            user.email = request.form.get("email", user.email).strip()
            user.first_name = request.form.get("first_name", user.first_name).strip()
            user.last_name = request.form.get("last_name", user.last_name).strip()
            user.password = generate_password_hash(request.form.get("password", user.password).strip())

            if user.avatar and not request.files:
                ic("no files submitted in form, but avatar in db")
                db.session.delete(user.avatar)
                
                delete_file(user.avatar.path)
            
            # UPDATING USER AVATAR
            if request.files:
                avatar_file = request.files["avatar"]
                avatar_path = generate_file_path(avatar_file.filename, "avatar")

                if user.avatar and avatar_path != user.avatar.path:
                    delete_file(user.avatar.path)
                
                user.avatar = Avatar(path = avatar_path)
                save_file(avatar_file, avatar_path)          

            db.session.commit()
            
            if user.verification_key and user.verified_at == None:
                email_template = render_template("email/verification.html", client_url=environ["CLIENT_URL"], verification_key=user.verification_key)
                send_email(user.email, "Almost there: Verify your account!", email_template)
            
            return make_response(user.to_dict(auth=True), 200)
        except Exception as ex:
            db.session.rollback()
            ic(ex)

            for arg in ex.args:
                error = arg
                if "Duplicate" and "email" in arg:
                    error = {"email": "Email in use; please choose another."}

            return make_response({"error": error}, 400)
    
    if request.method == "DELETE":
        try:
            db.session.delete(user)
            db.session.commit()

            return make_response({"status": "User deleted."}, 200)
        except Exception as ex:
            db.session.rollback()
            for arg in ex.args: error = arg

            return make_response({"user": user, "error": error}, 400)

@app.route("/verify/<string:key>")
@app.patch("/reset/<string:key>")
def verify_user(key):
    try:
        q = select(User).where(User.verification_key == validate_verification_key(key))
        user = db.session.scalar(q)

        if not user: raise Exception("Invalid key.")

        if user.verified_at:
            user.password = generate_password_hash(request.form.get("password", user.password).strip())
        else:
            user.verified_at = datetime.now(timezone.utc)

        user.verification_key = ""
        db.session.commit()

        return make_response(user.to_dict(), 200)
    except Exception as ex:
        return make_response({"error": str(ex)}, 400)