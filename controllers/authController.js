const jwt = require("jsonwebtoken");
const asyncHandler = require("../middlewares/asyncHandler");
const Usuario = require("../models/Usuario");

// Gera um token JWT com validade de 7 dias
const gerarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /auth/registrar
const registrar = asyncHandler(async (req, res) => {
  const { nome, email, senha, idade } = req.body;

  const emailExiste = await Usuario.findOne({ email });
  if (emailExiste) {
    res.status(400);
    throw new Error("E-mail já cadastrado");
  }

  const usuario = await Usuario.create({ nome, email, senha, idade });
  const token = gerarToken(usuario._id);

  res.status(201).json({
    sucesso: true,
    mensagem: "Usuário registrado com sucesso!",
    token,
    dados: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

// POST /auth/login
const login = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  // select("+senha") porque o campo tem select:false no schema
  const usuario = await Usuario.findOne({ email }).select("+senha");

  if (!usuario || !(await usuario.compararSenha(senha))) {
    res.status(401);
    throw new Error("E-mail ou senha incorretos");
  }

  if (!usuario.ativo) {
    res.status(401);
    throw new Error("Conta desativada");
  }

  const token = gerarToken(usuario._id);

  res.status(200).json({
    sucesso: true,
    mensagem: "Login realizado com sucesso!",
    token,
    dados: {
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
    },
  });
});

// GET /auth/me
const perfil = asyncHandler(async (req, res) => {
  res.status(200).json({
    sucesso: true,
    dados: req.usuario,
  });
});

module.exports = { registrar, login, perfil };
