from os import environ
from flask import Blueprint, request, make_response, render_template
from sqlalchemy import select
from uuid import uuid4
from datetime import datetime

from ..db import db
from ..db.models import *
from ..auth.validation import *
from ..utils import ic, send_email

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

@app.get("/users/reset/<string:email>")
def reset_user(email):
    q = select(User).where(User.email == email)
    user = db.session.scalar(q)

    if not user: raise Exception("User doesn't exist.")

    try:
        user.verification_key = uuid4().hex
        db.session.commit()

        if user.verification_key:
            ic("sending email")
            email_template = render_template("email/password_reset.html", client_url=environ["CLIENT_URL"], verification_key=user.verification_key)
            send_email(user.email, "Reset your password", email_template) 
        
        return make_response({"status": "Password reset initiated."}, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)