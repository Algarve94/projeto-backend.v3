# projeto-backend.v3

API REST desenvolvida com Node.js, Express e MongoDB, seguindo boas práticas de mercado: autenticação JWT, validação de dados com Zod, paginação, segurança com Helmet e Rate Limiting, testes automatizados com Jest e Supertest, containerização com Docker e documentação interativa via Swagger/OpenAPI.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Banco de dados | MongoDB + Mongoose |
| Autenticação | JSON Web Token + bcryptjs |
| Validação | Zod |
| Segurança | Helmet + express-rate-limit |
| Testes | Jest + Supertest + mongodb-memory-server |
| Documentação | Swagger UI / OpenAPI 3.0 |
| Containerização | Docker + Docker Compose |

---

## Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Hash de senhas com bcryptjs (nunca armazena senha em texto puro)
- Validação de entrada em todas as rotas com Zod
- Paginação e filtro por nome na listagem de usuários
- Soft delete (desativação sem apagar o registro do banco)
- Rate limiting nas rotas de autenticação (proteção contra força bruta)
- Headers de segurança HTTP via Helmet
- Documentação interativa da API com Swagger
- Testes de integração com banco em memória (sem dependência externa)
- Containerização completa com Docker Compose

---

## Estrutura do projeto

```
projeto-backend.v3/
├── config/
│   └── db.js                    # Conexão com o MongoDB
├── controllers/
│   ├── authController.js        # Registro, login e perfil
│   └── usuarioController.js     # CRUD de usuários
├── docs/
│   └── swagger.js               # Configuração do Swagger
├── middlewares/
│   ├── asyncHandler.js          # Elimina try/catch repetido
│   ├── auth.js                  # Validação do token JWT
│   ├── errorHandler.js          # Tratamento global de erros
│   ├── security.js              # Helmet e Rate Limit
│   └── validate.js              # Middleware de validação Zod
├── models/
│   └── Usuario.js               # Schema Mongoose com hash de senha
├── routes/
│   ├── authRoutes.js            # Rotas públicas de autenticação
│   └── usuarioRoutes.js         # Rotas protegidas de usuários
├── tests/
│   ├── setup.js                 # Configuração global dos testes
│   ├── auth.test.js             # Testes de autenticação
│   └── usuarios.test.js         # Testes de CRUD
├── validators/
│   └── usuarioValidator.js      # Schemas Zod
├── .dockerignore
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── DEPLOY.md
└── server.js                    # Ponto de entrada da aplicação
```

---

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- MongoDB rodando localmente ou uma URI do MongoDB Atlas

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/projeto-backend.v3.git
cd projeto-backend.v3

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/exemplo_db
NODE_ENV=development
JWT_SECRET=seu_segredo_forte_aqui
JWT_EXPIRES_IN=7d
```

> Para gerar um JWT_SECRET seguro:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

```bash
# Inicie o servidor em modo desenvolvimento
npm run dev
```

Acesse a documentação em `http://localhost:3000/docs`

---

## Como rodar com Docker

```bash
# Suba a API e o MongoDB juntos
docker-compose up --build
```

Sem precisar instalar MongoDB localmente. Tudo roda dentro dos containers.

---

## Testes

```bash
# Rodar os testes
npm test

# Rodar com relatório de cobertura
npm run test:coverage
```

Os testes usam um banco MongoDB em memória — nenhuma configuração extra é necessária.

---

## Decisões técnicas dos testes

- **MongoMemoryServer**: Os testes usam um MongoDB em memória, sem depender de um banco externo. Isso garante isolamento e velocidade.

- **Conexão condicional no `db.js`**: A função `connectDB()` é ignorada quando `NODE_ENV=test`, evitando conflito com o MongoMemoryServer configurado no `tests/setup.js`.

- **Rate Limiter desativado em teste**: Os limitadores de requisição são substituídos por um middleware que apenas passa adiante quando `NODE_ENV=test`, impedindo que os testes sejam bloqueados pelo rate limit.

- **Servidor não inicia nos testes**: O `app.listen()` é condicionado a `NODE_ENV !== "test"`, evitando que o servidor fique pendente após os testes (sem precisar de `--forceExit`).

---

## Rotas da API

### Autenticação (públicas)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/registrar` | Cadastra novo usuário |
| `POST` | `/auth/login` | Autentica e retorna token JWT |

### Usuários e perfil (requerem token JWT)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/auth/me` | Retorna perfil do usuário autenticado |
| `GET` | `/usuarios` | Lista usuários com paginação |
| `GET` | `/usuarios/:id` | Busca usuário por ID |
| `POST` | `/usuarios` | Cria novo usuário |
| `PUT` | `/usuarios/:id` | Atualiza dados do usuário |
| `DELETE` | `/usuarios/:id` | Desativa usuário (soft delete) |

### Parâmetros de paginação

```
GET /usuarios?page=1&limit=10&nome=João
```

---

## Autenticação

Todas as rotas protegidas exigem o token JWT no header:

```
Authorization: Bearer <token>
```

O token é retornado nos endpoints `/auth/registrar` e `/auth/login`.

---

## Exemplo de uso

**Registrar usuário**
```bash
curl -X POST http://localhost:3000/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Silva", "email": "joao@email.com", "senha": "senha123"}'
```

**Resposta**
```json
{
  "sucesso": true,
  "mensagem": "Usuário registrado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "dados": {
    "id": "664abc123def456",
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

**Listar usuários autenticado**
```bash
curl http://localhost:3000/usuarios \
  -H "Authorization: Bearer <token>"
```

---

## Segurança

- Senhas armazenadas com hash bcryptjs (salt rounds: 12)
- Tokens JWT com validade configurável
- Rate limiting nas rotas de autenticação: 10 tentativas por IP a cada 15 minutos
- Rate limiting geral: 100 requisições por IP a cada 15 minutos
- Headers HTTP de segurança via Helmet
- Variáveis sensíveis isoladas em `.env` (nunca versionadas)
- Soft delete preserva integridade dos dados

---

## Deploy

Consulte o arquivo [DEPLOY.md](./DEPLOY.md) para o guia completo de deploy no Railway com MongoDB Atlas.

---

## Licença

MIT
