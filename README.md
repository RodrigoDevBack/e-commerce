# e-commerce
Site e-commerce

Estrutura de pastas:
```shell
.
├── backend
│   └── src
│       ├── app
│       │   ├── app.py
│       │   ├── db
│       │   │   ├── config_db.py
│       │   │   └── model_user_db.py
│       │   ├── dto
│       │   │   └── user_dto.py
│       │   ├── security
│       │   │   └── encrypter_password.py
│       │   └── services
│       │       └── email_service.py
│       ├── dockerfile
│       └── requirements.txt
├── docker-compose.yml
├── frontend
│   └── dockerfile
├── LICENSE
├── objetivo.txt
├── README.md
└── service_email
    ├── email_attach.py
    ├── email_service.py
    └── index.html
```