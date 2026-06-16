/**
 * asyncHandler
 * Envolve funções async das rotas e captura erros automaticamente,
 * eliminando a necessidade de try/catch em cada controller.
 *
 * Uso:
 *   const listar = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
