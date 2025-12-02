from os import path
from flask import Blueprint, current_app, request, jsonify, make_response
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

from ..db import db
from ..db.models import *
from ..utils import ic
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

        if not user: raise Exception("User doesn't exist")
        if not check_password_hash(user.password, password): raise Exception("Invalid password.")
        
        return make_response(user.to_dict(auth=True), 200)
    except Exception as ex:
            ic(ex)
            return make_response({"error": str(ex)}, 400)
    
@app.route("/me/<int:id>", methods=["GET", "PATCH"])
def auth_user(id):
    if request.method == "GET":
        q = select(User).where(User.id == id)
        user = db.session.scalar(q).to_dict(auth=True)

        return make_response(user, 200)
    
    if request.method == "PATCH":
        q = select(User).where(User.id == id)
        user = db.session.scalar(q)
        try:
            user.username = request.form["username"].strip()
            user.email = request.form["email"].strip()
            user.first_name = request.form["first_name"].strip()
            user.last_name = request.form["last_name"].strip()
            user.password = generate_password_hash(request.form["password"].strip())
            db.session.commit()

            avatar_file = request.files["avatar"]
            secure_avatar = secure_filename(avatar_file.filename)
            avatar_path = path.join(current_app.config["UPLOAD_FOLDER"], secure_avatar)

            avatar = Avatar(
                path = avatar_path,
                user_id = user.id
            )

            db.session.add(avatar)
            db.session.commit()

            avatar_file.save(path.join(current_app.root_path, avatar_path))
            
            return make_response(user.to_dict(auth=True), 200)
        except Exception as ex:
            db.session.rollback()
            for arg in ex.args: error = arg
            return make_response({"user": user.to_dict(auth=True), "error": error}, 400)