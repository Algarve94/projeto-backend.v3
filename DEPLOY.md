## Deploy

API Online: https://projeto-backend-v3.onrender.com

Documentação Swagger: https://projeto-backend-v3.onrender.com/docs

---

## Deploy no Render

1. Acesse https://render.com → **New** → **Web Service**
2. Conecte sua conta GitHub e selecione o repositório `projeto-backend-v3`
3. Preencha:
   - **Name:** `projeto-backend-v3`
   - **Branch:** `main`
   - **Region:** Ohio ou Frankfurt
   - **Root Directory:** (vazio)
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

### Variáveis de ambiente

No painel → **Environment** → adicione:

| Variável | Valor |
|---|---|
| `PORT` | `10000` |
| `MONGO_URI` | Sua connection string do Atlas |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Um segredo forte (veja abaixo) |
| `JWT_EXPIRES_IN` | `7d` |

> Para gerar o JWT_SECRET:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Verificar o deploy

Acesse: `https://projeto-backend-v3.onrender.com/docs`

> Render Free Tier: a API adormece após 15 min sem requisições.
> A primeira requisição pode demorar ~30s para acordar.

---

## Deploy no Railway

### Pré-requisitos

- Conta no [Railway](https://railway.app/) (login com GitHub)
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (banco em nuvem, gratuito)

### 1. Configurar o MongoDB Atlas

1. Acesse [cloud.mongodb.com](https://cloud.mongodb.com/) → **Create a free cluster**
2. Escolha a região mais próxima (ex: São Paulo)
3. Em **Database Access** → crie um usuário e senha
4. Em **Network Access** → clique em **Allow access from anywhere** (`0.0.0.0/0`)
5. Em **Connect** → copie a connection string:
   `mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/exemplo_db`

### 2. Deploy no Railway

1. Acesse [railway.app](https://railway.app/) → **New Project**
2. Selecione **Deploy from GitHub repo**
3. Conecte sua conta GitHub e selecione o repositório `projeto-backend.v3`
4. O Railway detecta automaticamente o Node.js e faz o build

### 3. Configurar as variáveis de ambiente no Railway

No painel do projeto → **Variables** → adicione:

| Variável | Valor |
|---|---|
| `PORT` | `3000` |
| `MONGO_URI` | Sua connection string do Atlas |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Um segredo forte |
| `JWT_EXPIRES_IN` | `7d` |

### 4. Verificar o deploy

Após o deploy, o Railway fornece uma URL pública. Acesse:
`https://seu-projeto.up.railway.app/docs`

> Para informações sobre tecnologias, testes e cobertura, consulte o [README.md](./README.md).
