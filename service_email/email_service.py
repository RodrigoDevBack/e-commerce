import smtplib as smt
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

password = os.getenv('PASSWORD')

header = "Hey, it's my first sender email from python"
body = "Digo olá pelo corpo da meu email ;)"

email = MIMEText(body)
email['Subject'] = header
email['From'] = os.getenv('SENDER_EMAIL')
email['To'] = os.getenv('RECEIVER_EMAIL')

try:
    server = smt.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(email['From'], password)
    server.sendmail(email['From'], email['To'], email.as_string())
    print("Success Invitation!")
    server.quit()
except Exception as e:
    print(e)