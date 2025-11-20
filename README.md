# Colibrí - Auth (NestJS)

## Desarrollo local
```bash
npm i
cp .env.example .env
# edita DATABASE_URL y llaves JWT
npm run start:dev
```

## Endpoints
- `GET /health`
- `POST /auth/register` { email, password, full_name? }
- `POST /auth/login` { email, password }
- `POST /auth/refresh` { refresh_token }
- `GET /.well-known/jwks.json`
