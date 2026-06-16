# Deploy no Railway

## Pré-requisitos
- Conta no [Railway](https://railway.app) (login com GitHub)
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) (banco em nuvem, gratuito)

---

## 1. Configurar o MongoDB Atlas

1. Acesse [cloud.mongodb.com](https://cloud.mongodb.com) → **Create a free cluster**
2. Escolha a região mais próxima (ex: São Paulo)
3. Em **Database Access** → crie um usuário e senha
4. Em **Network Access** → clique em **Allow access from anywhere** (`0.0.0.0/0`)
5. Em **Connect** → copie a connection string:
   ```
   mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/exemplo_db
   ```

---

## 2. Deploy no Railway

1. Acesse [railway.app](https://railway.app) → **New Project**
2. Selecione **Deploy from GitHub repo**
3. Conecte sua conta GitHub e selecione o repositório `projeto-backend.v2`
4. O Railway detecta automaticamente o Node.js e faz o build

---

## 3. Configurar as variáveis de ambiente no Railway

No painel do projeto → **Variables** → adicione:

| Variável | Valor |
|---|---|
| `PORT` | `3000` |
| `MONGO_URI` | Sua connection string do Atlas |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Um segredo forte (veja abaixo como gerar) |
| `JWT_EXPIRES_IN` | `7d` |

**Gerar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 4. Verificar o deploy

Após o deploy, o Railway fornece uma URL pública. Acesse:
```
https://seu-projeto.up.railway.app/docs
```

A documentação Swagger deve aparecer com a API funcionando em produção.
