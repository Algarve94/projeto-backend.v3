const { z } = require("zod");

// ── Schema de criação de usuário ──────────────────────────────────
const criarUsuarioSchema = z.object({
  nome: z
    .string({ required_error: "Nome é obrigatório" })
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(80, "Nome muito longo")
    .trim(),

  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("Formato de e-mail inválido")
    .toLowerCase()
    .trim(),

  senha: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(100, "Senha muito longa"),

  idade: z
    .number({ invalid_type_error: "Idade deve ser um número" })
    .int("Idade deve ser inteira")
    .min(0, "Idade inválida")
    .max(120, "Idade inválida")
    .optional(),
});

// ── Schema de atualização (todos os campos opcionais) ─────────────
const atualizarUsuarioSchema = criarUsuarioSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "Envie ao menos um campo para atualizar" }
);

// ── Schema de login ───────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório" })
    .email("Formato de e-mail inválido")
    .toLowerCase()
    .trim(),

  senha: z
    .string({ required_error: "Senha é obrigatória" })
    .min(1, "Senha é obrigatória"),
});

module.exports = { criarUsuarioSchema, atualizarUsuarioSchema, loginSchema };
