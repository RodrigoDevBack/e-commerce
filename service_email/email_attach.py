import smtplib
import os
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

load_dotenv()

sender_email = os.getenv('SENDER_EMAIL')
password_email = os.getenv('PASSWORD')
receiver_email = os.getenv('RECEIVER_EMAIL')

subject_email = 'Enviando um email multipart personalizado'

msg = MIMEMultipart("alternado")
msg['From'] = sender_email
msg['To'] = receiver_email
msg['Subject'] = subject_email

#msg.attach(MIMEText('Olha aqui s[o tem um texto comum!', 'plain', 'utf-8'))
msg.attach(MIMEText(
"""<!DOCTYPE html>
<html lang="pt-BR">
<body>
    <div style:"background-color: white">
        <h1>Opa</h1>
        <h2>Hehehehhe</h2>
        <a href="https://singlotown.com"><button class="btn btn-success">Textando hehehehe</button></a>
    </div>
</body>
</html>
""", 'html', 'utf-8'))

# filename = 'test.pdf'
# with open(filename, 'rb') as attachment:
#     part = MIMEBase('application', 'octet-stream')
#     part.set_payload(attachment.read())
#     encoders.encode_base64(part)
#     part.add_header('Content-Disposition', f'attachment; filename={filename}')
# msg.attach(part)


try:
    with smtplib.SMTP('smtp.gmail.com', 587) as server:
        server.starttls()
        server.login(msg['From'], password_email)
        server.sendmail(msg['From'], msg['To'], msg.as_string())
        server.quit()
        print("Email enviado")
except Exception as e:
    print(e)
