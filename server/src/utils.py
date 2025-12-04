from os import environ, path, remove
from flask import current_app

from icecream import ic as icecream
from base64 import b64encode
from datetime import datetime, timedelta

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from werkzeug.utils import secure_filename

def ic(log):
    icecream.configureOutput(prefix=f'LOG || ', includeContext=True)
    return icecream(log)

def b64(str):
    auth_str = str.encode("ascii")
    auth_b64 = b64encode(auth_str)
    return auth_b64.decode("ascii")

def expires_at(s):
    now = datetime.now()
    expiration = now + timedelta(0,s)
    return expiration

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