require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const usuarioRoutes = require("./routes/usuarioRoutes");
const authRoutes = require("./routes/authRoutes");
const { naoEncontrado, tratadorDeErros } = require("./middlewares/errorHandler");
const { configurarHelmet, limitadorGeral } = require("./middlewares/security");
const configurarSwagger = require("./docs/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao MongoDB
if (process.env.NODE_ENV !== "test") {
  connectDB();
}


// ── Segurança ────────────────────────────────────────────────────
app.use(configurarHelmet);
app.use(limitadorGeral);

// ── Middlewares globais ──────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Documentação Swagger ─────────────────────────────────────────
configurarSwagger(app);

// ── Rotas ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    mensagem: "API rodando com sucesso!",
    documentacao: `${req.protocol}://${req.get("host")}/docs`
  });
});

app.use("/auth",     authRoutes);
app.use("/usuarios", usuarioRoutes);

// ── Tratamento de erros ──────────────────────────────────────────
app.use(naoEncontrado);
app.use(tratadorDeErros);

// ── Iniciar servidor ─────────────────────────────────────────────
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
  console.log(
    `Servidor iniciado em ${process.env.NODE_ENV || "development"}`
  );
});
}

module.exports = app; // exportado para os testes
