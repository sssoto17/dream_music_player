from os import environ
from flask import Blueprint, request, make_response, render_template, jsonify
from sqlalchemy import select, or_, and_
from sqlalchemy.sql.operators import ilike_op
from uuid import uuid4

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
            q = select(User).where(User.email == request.form["email"])
            user = db.session.scalar(q)

            if not user:
                user = User(
                username = request.form.get("username", "").strip(),
                email = request.form.get("email", "").strip(),
                password = generate_password_hash(request.form.get("password", user.password)),
                first_name = request.form.get("first_name", ""),
                last_name = request.form.get("last_name", ""),
                verification_key = uuid4().hex,
                role = "user"
                )

                db.session.add(user)
            
            if user:
                user.username = request.form.get("username", user.username).strip()
                user.email = request.form.get("email", user.email).strip()
                user.password = generate_password_hash(request.form["password"])
                user.first_name = request.form.get("first_name", user.first_name)
                user.last_name = request.form.get("last_name", user.last_name)

            db.session.commit()

            return make_response(user.to_dict(), 200)
        except Exception as ex:
            db.session.rollback()
            ic(ex)
            return make_response({"error": str(ex)}, 400)
        finally:
            if db.session in locals(): db.session.close()

@app.get("/search/users")
def search_users():
    search = request.args.get("q")
    try:
        q = select(User).filter(ilike_op(User.username, f"%{str(search)}%"))
        result = db.session.scalars(q)

        ic(result)
        if not result: raise Exception("No matching results.")

        users = [
            row.to_dict() for row in result
        ]
        return make_response(users, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)
    
@app.route("/users/<int:id>")
@app.route("/users/<string:username>")
def user(id = None, username = None):
    try:
        if id:
            q = select(User).where(User.id == id)
        if username:
            q = select(User).where(User.username == username)
        
        user = db.session.scalar(q)

        if not user: raise Exception("User doesn't exist.")

        return make_response(user.to_dict(), 200)
    except Exception as ex:
        return make_response({"error": str(ex)}, 400)


@app.get("/users/reset/<string:email>")
def reset_user(email):
    q = select(User).where(User.email == email)        
    user = db.session.scalar(q)

    if not user: raise Exception("User doesn't exist.")

    try:
        key = uuid4().hex
        user.verification_key = validate_verification_key(key)
        db.session.commit()

        if user.verification_key:
            email_template = render_template("email/password_reset.html", client_url=environ["CLIENT_URL"], verification_key=user.verification_key)
            send_email(user.email, "Reset your password", email_template) 
        
        return make_response({"status": "Password reset initiated."}, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)

@app.route("/users/likes/<int:id>/<string:track_id>", methods=["GET"])
def get_user_like(id, track_id):
    try:
        q = select(Liked_Track).where(Liked_Track.track_id == track_id).where(Liked_Track.user_id == id)
        like = db.session.scalar(q)
    
        return make_response
    except Exception as ex:
                ic(ex)
                return make_response({"error": str(ex)}, 400)

@app.route("/users/likes/<int:id>", methods=["GET", "POST"])
def user_likes(id):
        q = select(User).where(User.id == id)
        user = db.session.scalar(q)

        if request.method == "GET":
            q = select(Liked_Track).where(Liked_Track.user_id == id)
            result = db.session.scalars(q).all()

            likes = [
                {"track_id": row.track_id} for row in result
            ]

            return make_response(likes, 200)
        if request.method == "POST":
            if not user: raise Exception("Unauthorized.")
            track_id = request.form["track_id"]
            
            try:
                q = select(Liked_Track).where(Liked_Track.track_id == track_id)
                existing_like = db.session.scalar(q)
                
                if existing_like:
                    db.session.delete(existing_like)
                    db.session.commit()

                if not existing_like:
                    like = Liked_Track(user_id = id, track_id = request.form["track_id"])
                    db.session.add(like)
                    db.session.commit()
                
                return make_response(user.to_dict(auth=True), 200)
            except Exception as ex:
                ic(ex)
                return make_response({"error": str(ex)}, 400)

@app.get("/users/<int:id>/followers")
@app.get("/users/<string:username>/followers")
def get_followers(id = None, username = None):
    try:
        if id:
            q = select(Follower).join(User.followers).where(User.id == id).order_by(Follower.created_at.desc())
        if username:
            q = select(Follower).join(User.followers).where(User.username == username).order_by(Follower.created_at.desc())

        result = db.session.scalars(q)

        followers = [
            row.follower.to_dict() for row in result
        ]

        return make_response(followers, 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)
    
@app.get("/users/<int:id>/following")
@app.get("/users/<string:username>/following")
def get_following(id = None, username = None):
    try:
        if id:
            q = select(Follower).join(User.following).where(User.id == id).order_by(Follower.created_at.desc())
        if username:
            q = select(Follower).join(User.following).where(User.username == username).order_by(Follower.created_at.desc())
        
        result = db.session.scalars(q)

        following = [
            row.followed.to_dict() for row in result
        ]

        return make_response(jsonify(following), 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)


@app.post("/users/<int:id>/follow")
def user_follow(id):
    try:
        username = request.form.get("username")

        q = select(User).where(User.username == username)
        user_following_id = db.session.scalar(q).id

        if id == user_following_id: raise Exception("User cannot follow self.")
        
        q = select(Follower).where(Follower.user_id == id).where(Follower.user_following_id == user_following_id)
        existing_follow = db.session.scalar(q)
        
        if not existing_follow:
            follow_entry = Follower(user_id = id, user_following_id = user_following_id)
            db.session.add(follow_entry)
        if existing_follow: db.session.delete(existing_follow)
        
        db.session.commit()

        return make_response("Followers updated", 200)
    except Exception as ex:
        ic(ex)
        return make_response("Follow failed.", 400)
    
@app.post("/users/<int:id>/post")
def create_post(id):
    try:
        post = Post(user_id = id, content = request.form.get("post", ""))

        db.session.add(post)
        db.session.commit()

        return "ok"
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)
    
@app.get("/users/<int:id>/posts")
def get_user_posts(id):
    try:
        q = select(Post).where(Post.user_id == id).order_by(Post.created_at.desc())
        result = db.session.scalars(q).unique()

        posts = []

        for row in result:
            post = {
            "id": row.id,
            "content": row.content,
             "created": row.created_at,
             "author": {
                 "username": row.user.username,
                 "first_name": row.user.first_name,
                 "last_name": row.user.last_name,
             },
             "likes": row.likes_total
             }
            
            if row.user.avatar:
                post["author"]["avatar"] = row.user.avatar.path
            
            posts.append(post)

        return make_response(jsonify(posts), 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)
    
@app.get("/users/<int:id>/feed")
def get_user_feed(id):
    try:
        q = select(Post).join(Follower.followed).where(or_(and_(Follower.user_id == id, Post.user_id == Follower.user_following_id), Post.user_id == id)).order_by(Post.created_at.desc())
        result = db.session.scalars(q).unique()

        posts = []

        for row in result:
            post = {
            "id": row.id,
            "content": row.content,
             "created": row.created_at,
             "author": {
                 "username": row.user.username,
                 "first_name": row.user.first_name,
                 "last_name": row.user.last_name,
             },
             "likes": row.likes_total
             }
            
            if row.user.avatar:
                post["author"]["avatar"] = row.user.avatar.path
            
            posts.append(post)

        return make_response(jsonify(posts), 200)
    except Exception as ex:
        ic(ex)
        return make_response({"error": str(ex)}, 400)