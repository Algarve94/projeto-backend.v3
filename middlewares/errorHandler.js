// Middleware para rotas não encontradas (404)
const naoEncontrado = (req, res, next) => {
  const erro = new Error(`Rota não encontrada: ${req.originalUrl}`);
  res.status(404);
  next(erro);
};

// Middleware global de erros
const tratadorDeErros = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    sucesso: false,
    mensagem: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { naoEncontrado, tratadorDeErros };
