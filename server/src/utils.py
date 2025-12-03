from os import environ

from icecream import ic as icecream
from base64 import b64encode
from datetime import datetime, timedelta

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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

def send_email(receiver, subject, template):
    try:
        # ADMIN EMAIL
        # sender = "dreammusicplayer"
        # password = "ixwm leko jhqc kvfn"  # If 2FA is on, use an App Password instead
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