const express = require("express");
const router = express.Router();
const {
  listarUsuarios,
  buscarUsuarioPorId,
  criarUsuario,
  atualizarUsuario,
  deletarUsuario,
} = require("../controllers/usuarioController");
const { proteger } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { criarUsuarioSchema, atualizarUsuarioSchema } = require("../validators/usuarioValidator");

// Todas as rotas abaixo exigem token JWT válido
router.use(proteger);

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista usuários com paginação
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página (padrão 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página (padrão 10, máx 50)
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         description: Filtra por nome (busca parcial)
 */
router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.post("/", validate(criarUsuarioSchema), criarUsuario);
router.put("/:id", validate(atualizarUsuarioSchema), atualizarUsuario);
router.delete("/:id", deletarUsuario);

module.exports = router;
