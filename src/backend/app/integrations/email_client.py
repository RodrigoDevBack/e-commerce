import smtplib
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from email.mime.text import MIMEText
from random import randint

load_dotenv()
sender_email = os.getenv("SENDER_EMAIL")
password_email = os.getenv("PASSWORD")

class Email_Client():

    def create_code(self, gmail: str):
        os.makedirs(f"/app/integrations/code_validate_email/{gmail}", exist_ok=True)
        with open(f"/app/integrations/code_validate_email/{gmail}/{gmail}.txt", "w") as txt:
            txt.write(str(randint(100000, 999999)))

    def get_code(self, gmail: str) -> int:
        try:
            with open(f"/app/integrations/code_validate_email/{gmail}/{gmail}.txt", "r") as txt:
                return int(txt.read())
        except Exception:
            return 0
            

    def send_email(self, name: str, gmail: str, code: int):
        email = MIMEText(
f"""<!DOCTYPE html>
<html lang="pt-BR">
<body>
    <h1>Olá {name}!</h1>
    <h2>Use este código para validar seu email.</h2>
    <h2>{code}</h2>
</body>
</html>
""",
        'html', 'utf-8'
        )
        email["Subject"] = "Código de validação de email"
        email["From"] = sender_email
        email["To"] = gmail

        try:
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(sender_email, password_email)
            server.sendmail(sender_email, gmail, email.as_string())
            server.quit()
            return {"Response": 200}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"Fail": str(e)}
            )

    def send_email_admin(self, name: str, gmail: str, code: int):
        email = MIMEText(
f"""<!DOCTYPE html>
<html lang="pt-BR">
<body>
    <h1>Olá {name}, você agora é um admin!</h1>
    <h2>Use este código para validar seu email de admin.</h2>
    <h2>{code}</h2>
</body>
</html>
""",
        'html', 'utf-8'
        )
        email["Subject"] = "Código de validação de email (Admin)"
        email["From"] = sender_email
        email["To"] = gmail

        try:
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(sender_email, password_email)
            server.sendmail(sender_email, gmail, email.as_string())
            server.quit()
            return {"Response": 200}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"Fail": str(e)}
            )
