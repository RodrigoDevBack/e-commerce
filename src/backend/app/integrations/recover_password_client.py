import smtplib
import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from email.mime.text import MIMEText
from random import randint

load_dotenv()
sender_email = os.getenv('SENDER_EMAIL')
password_email = os.getenv('PASSWORD')

class Password_Recover_Email():
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    
    def create_code(self, gmail: str):
        os.makedirs(f'/app/integrations/code_recover_password/{gmail}', exist_ok=True)
        with open(f'/app/integrations/code_recover_password/{gmail}/{gmail}.txt', 'w') as txt:
            txt.write(str(randint(100000, 999999)))
            txt.close

    def get_code(self, gmail: str) -> int:
        with open(f'/app/integrations/code_recover_password/{gmail}/{gmail}.txt', 'r') as txt:
            code = txt.read()
            return int(code)
    
    def send_email(self, name: str, gmail: str, code: int):
        email = MIMEText(
f"""<!DOCTYPE html>
<html lang="pt-BR">
<body>
    <h1>Olá {name}!</h1>
    <h2> Use este código para recuperar sua senha.</h2>
    <h2>{code}</h2>
</body>
</html>
""", 'html', 'utf-8'
        )
        email['Subject'] = 'Código de recuperação de senha'
        email['From'] = sender_email
        email['To'] = gmail
        try:
            self.server.login(email['From'], password_email)
            self.server.sendmail(email['From'], email['To'], email.as_string())
            return {'Response': 200}
        except Exception as e:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, {'Fail': e})
