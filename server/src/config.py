from os import environ

class Config:
    SECRET_KEY = environ["SECRET_KEY"]
    UPLOAD_FOLDER = "static/uploads"
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024   # 16 MB
    SQLALCHEMY_DATABASE_URI = environ["DB_URI"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False