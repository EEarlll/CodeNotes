from flask import Blueprint, request, jsonify
import os
import smtplib
from email.mime.text import MIMEText

bp = Blueprint("email", __name__, url_prefix="/api/email")

email = "earleustacio@gmail.com"
password = os.environ.get("GOOGLE_APPKEY")


def prGreen(skk):
    print("\033[92m {}\033[00m".format(skk))


@bp.route("/", methods=["POST"])
def index():
    try:
        if request.method == "POST":
            content = request.json
            msg = MIMEText(content["message"])
            msg["Subject"] = (
                f"{content['feedback']} - CodeNotes Feedback"
                if content["feedback"]
                else "NA - CodeNotes Feedback"
            )
            msg["From"] = content["email"]
            msg["To"] = email

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
                smtp_server.login(email, password)
                smtp_server.sendmail(email, email, msg.as_string())

            return jsonify("Thank you for your feedback!"), 200

    except Exception as e:
        prGreen(e)
        return jsonify("eror"), 404
