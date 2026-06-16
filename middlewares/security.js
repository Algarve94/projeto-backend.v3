const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// ── Helmet ────────────────────────────────────────────────────────
const configurarHelmet = helmet();

// ── Middleware sem limite (usado em testes) ───────────────────────
const semLimite = (req, res, next) => next();

// ── Rate Limit geral ──────────────────────────────────────────────
const limitadorGeral = process.env.NODE_ENV === "test"
  ? semLimite
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        sucesso: false,
        mensagem: "Muitas requisições. Tente novamente em 15 minutos.",
      },
    });

// ── Rate Limit para autenticação ──────────────────────────────────
const limitadorAuth = process.env.NODE_ENV === "test"
  ? semLimite
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        sucesso: false,
        mensagem: "Muitas tentativas de login. Tente novamente em 15 minutos.",
      },
    });

module.exports = { configurarHelmet, limitadorGeral, limitadorAuth };