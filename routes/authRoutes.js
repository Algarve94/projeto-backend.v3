const express = require("express");
const router = express.Router();
const { registrar, login, perfil } = require("../controllers/authController");
const { proteger } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { criarUsuarioSchema, loginSchema } = require("../validators/usuarioValidator");
const { limitadorAuth } = require("../middlewares/security");

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 */
router.post("/registrar", limitadorAuth, validate(criarUsuarioSchema), registrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login e retorna token JWT
 *     tags: [Auth]
 */
router.post("/login", limitadorAuth, validate(loginSchema), login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Retorna perfil do usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get("/me", proteger, perfil);

module.exports = router;
