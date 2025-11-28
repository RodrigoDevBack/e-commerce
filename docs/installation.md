# 📦 Instalação e execução do projeto

## Requisitos

- Docker e Docker Compose instalados
- Sistema operacional: Windows, Linux ou macOS

## Passos para rodar o projeto

1. **Inicie o Docker Desktop** (se estiver no Windows; em Linux/macOS, verifique se o serviço do Docker está ativo).
2. Abra o terminal e navegue até a pasta raiz do projeto:

```
cd e-commerce
```

3. Execute o comando para construir os containers e iniciar os serviços:

```
docker compose up --build
```

> ⚠️ Use `<span>--build</span>` apenas na primeira vez ou quando houver mudanças no Dockerfile.

4. O **frontend** estará disponível em:
   [http://localhost:8000]()
5. A **API backend** estará disponível em:
   [http://localhost:5000]()
6. Para acessar a documentação da API (Swagger):
   [http://localhost:5000/docs]()

## Estrutura de pastas

```
e-commerce/
├─ src/
│  ├─ frontend/
│  └─ backend/
├─ docker-compose.yml
└─ ...
```

## Observações

- As tabelas do banco de dados são criadas automaticamente na primeira execução.
- Para reiniciar os containers, use:

```
docker compose down (apenas parar)
docker compose down -v (limpa os volumes registrados)
docker compose up
```

- Problemas comuns:
  - Porta 8000 ou 5000 já em uso → feche outros processos que usem essas portas.
  - Docker não iniciado → certifique-se de que o serviço do Docker está ativo.

---
