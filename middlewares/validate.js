/**
 * validate(schema)
 * Middleware de fábrica: recebe um schema Zod e retorna um middleware
 * que valida o req.body antes de chegar ao controller.
 *
 * Uso:
 *   router.post("/", validate(criarUsuarioSchema), criarUsuario);
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const erros = result.error.errors.map((e) => ({
      campo: e.path.join("."),
      mensagem: e.message,
    }));

    return res.status(422).json({
      sucesso: false,
      mensagem: "Dados inválidos",
      erros,
    });
  }

  // Sobrescreve req.body com os dados já parseados/transformados pelo Zod
  req.body = result.data;
  next();
};

module.exports = validate;
