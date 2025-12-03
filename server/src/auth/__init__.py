from os import environ, path
from flask import Blueprint, current_app, request, render_template, make_response
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from uuid import uuid4

from ..db import db
from ..db.models import *
from ..utils import ic, send_email
from .validation import *

from . import spotify, token

app = Blueprint('auth', __name__, url_prefix='/auth')
app.register_blueprint(spotify.app)
app.register_blueprint(token.app)

@app.post("/login")
def authenticate_user():
    email = request.form["email"]
    password = request.form["password"]

    try:
        q = select(User).where(User.email == email)
        user = db.session.scalar(q)

        if not user: raise Exception("User doesn't exist.")
        if not check_password_hash(user.password, password): raise Exception("Invalid password.")
        
        return make_response(user.to_dict(auth=True), 200)
    except Exception as ex:
            ic(ex)
            return make_response({"error": str(ex)}, 400)

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

    if request.method == "GET": return make_response(user.to_dict(auth=True), 200)
    
    if request.method == "PATCH":
        try:
            user.username = request.form["username"].strip()
            user.email = request.form["email"].strip()
            user.first_name = request.form["first_name"].strip()
            user.last_name = request.form["last_name"].strip()
            user.password = generate_password_hash(request.form["password"].strip())

            if request.files:
                avatar_file = request.files["avatar"]
                avatar_path = path.join(current_app.config["UPLOAD_FOLDER"], secure_filename(avatar_file.filename))

                avatar = Avatar(
                    path = avatar_path,
                    user_id = user.id
                )

                avatar_file.save(path.join(current_app.root_path, avatar_path))
                db.session.add(avatar)
            
            db.session.commit()

            if user.verification_key and user.verified_at == None:
                email_template = render_template("email/verification.html", client_url=environ["CLIENT_URL"], verification_key=user.verification_key)
                send_email(user.email, "Almost there: Verify your account!", email_template)
            
            return make_response(user.to_dict(auth=True), 200)
        except Exception as ex:
            db.session.rollback()
            for arg in ex.args: error = arg

            return make_response({"user": user.to_dict(auth=True), "error": error}, 400)
    
    if request.method == "DELETE":
        try:
            db.session.delete(user)
            db.session.commit()

            return make_response({"status": "User deleted."}, 200)
        except Exception as ex:
            db.session.rollback()
            for arg in ex.args: error = arg

            return make_response({"user": user, "error": error}, 400)