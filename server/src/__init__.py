from flask import Flask, render_template, url_for
from flask_cors import CORS
from os import makedirs

from .db import db, migrate
from .db.triggers import *
from .config import Config
from .utils import ic

def create_app(test_config=None, config_class: type = Config):
    app = Flask(__name__, instance_relative_config=True)

    if test_config is None:
        app.config.from_object(config_class)
    else:
        app.config.from_mapping(test_config)
    
    try:
        makedirs(app.instance_path)
    except OSError:
        pass

    CORS(app)

    with app.app_context():
        db.init_app(app)
        migrate.init_app(app, db)

    from . import admin, api, auth
    app.register_blueprint(admin.app)
    app.register_blueprint(api.app)
    app.register_blueprint(auth.app)
    
    return app

def seed_data():
    from .db.models import User
    users = [
        User(username="testUser", email="test@gmail.com"),
        User(username="testUser2", email="test2@gmail.com"),
    ]

    db.session.add_all(users)
    db.session.commit()

app = create_app()

@app.route("/")
def index():
    try:
        test_url = url_for("auth.spotify.get_authorization", _external=True)
        ic(test_url)

        return render_template("index.html")
    except Exception as ex:
        raise Exception(ex)