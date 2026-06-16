const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const Usuario = require("../models/Usuario");

/**
 * proteger
 * Valida o token JWT no header Authorization.
 * Se válido, injeta req.usuario com os dados do usuário logado.
 */
const proteger = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Não autorizado — token ausente");
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const usuario = await Usuario.findById(decoded.id).select("-senha");
  if (!usuario || !usuario.ativo) {
    res.status(401);
    throw new Error("Não autorizado — usuário inválido");
  }

  req.usuario = usuario;
  next();
});

module.exports = { proteger };
