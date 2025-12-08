from os import environ, path, remove
from flask import current_app

from icecream import ic as icecream
from base64 import b64encode
from time import time
from datetime import datetime, timedelta, timezone

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from werkzeug.utils import secure_filename
from cryptography.fernet import Fernet

def ic(log):
    icecream.configureOutput(prefix=f'LOG || ', includeContext=True)
    return icecream(log)

def b64(str):
    auth_str = str.encode("ascii")
    auth_b64 = b64encode(auth_str)
    return auth_b64.decode("ascii")

key = environ["SECRET_KEY"]
f = Fernet(key)

def encrypt(str):
    return f.encrypt(str.encode())

def decrypt(str):
    token = f.decrypt(str)
    return token.decode()

def to_utc(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)

def expires_at(s: int) -> datetime:
    return datetime.now(timezone.utc) + timedelta(seconds=s)

def has_expired(expiration: datetime) -> bool:
    return to_utc(expiration) < datetime.now(timezone.utc)

def generate_file_path(filename, folder = ""):
    return path.join(current_app.config["UPLOAD_FOLDER"], folder, secure_filename(filename))

def save_destination(file):
    return path.join(current_app.root_path, file)

def save_file(file, path):
    filepath = save_destination(path)

    ic(f"saving {filepath}")
    ic(filepath)

    return file.save(filepath)

def delete_file(file):
    filepath = save_destination(file)

    ic(f"deleting {filepath}")

    return remove(filepath)

def send_email(receiver, subject, template):
    try:
        # ADMIN EMAIL
        sender = environ["GOOGLE_ADMIN_EMAIL"]
        password = environ["GOOGLE_APP_PASSWORD"]
        
        # COMPOSE EMAIL
        message = MIMEMultipart()

        message["To"] = receiver
        message["From"] = "Dream Music Player"
        message["Subject"] = subject

        message.attach(MIMEText(template, "html"))

        # SEND EMAIL
        with SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, receiver, message.as_string())

        return "Email sent successfully."
    except Exception as ex:
        return str(ex)