from flask import Blueprint, request, make_response, render_template
from sqlalchemy import select
from uuid import uuid4
from datetime import datetime

from ..db import db
from ..db.models import *
from ..auth.validation import *

app = Blueprint("users",__name__)

@app.route("/users", methods=["GET", "POST"])
def users():
    if request.method == "GET":
        try:
            q = select(User).order_by(User.id)
            result = db.session.scalars(q).all()

            users = [row.to_dict() for row in result]

            response = make_response(users, 200)
            return response
        except Exception as ex:
            return make_response({"error": str(ex)}, 400)
    
    if request.method == "POST":
        try:
            user = User(
                username = request.form["username"].strip(),
                email = request.form["email"],
                password = generate_password_hash(request.form["password"]),
                first_name = request.form["first_name"],
                last_name = request.form["last_name"],
                verification_key = uuid4().hex
            )
            db.session.add(user)
            db.session.commit()

            token = Refresh_Token(
                refresh_token = request.form["refresh_token"],
                user_id = user.id
            )
            db.session.add(token)
            db.session.commit()

            return make_response(user.to_dict(auth=True), 200)
        except Exception as ex:
            db.session.rollback()

            return make_response({"error": str(ex)}, 400)
        finally:
            if db.session in locals(): db.session.close()
    
@app.route("/users/<int:id>")
@app.route("/users/<string:username>")
def user(id = None, username = None, key = None):
    try:
        if id:
            q = select(User).where(User.id == id)
        if username:
            q = select(User).where(User.username == username)
        
        user = db.session.scalar(q)

        return make_response(user.to_dict(), 200)
    except Exception as ex:
        return make_response({"error": str(ex)}, 400)
    
@app.route("/users/verify/<string:key>")
def verify_user(key):
    try:
        q = select(User).where(User.verification_key == validate_verification_key(key))
        user = db.session.scalar(q)

        if not user: raise Exception("Invalid key.")

        user.verified_at = datetime.now()
        user.verification_key = ""

        db.session.commit()

        return make_response(user.to_dict(), 200)
    except Exception as ex:
        return make_response({"error": str(ex)}, 400)