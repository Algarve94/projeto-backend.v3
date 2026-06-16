const asyncHandler = require("../middlewares/asyncHandler");
const Usuario = require("../models/Usuario");

// GET /usuarios?page=1&limit=10&nome=João
const listarUsuarios = asyncHandler(async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10); // máximo 50 por página
  const skip  = (page - 1) * limit;

  // Filtro dinâmico por nome (busca parcial, case-insensitive)
  const filtro = { ativo: true };
  if (req.query.nome) {
    filtro.nome = { $regex: req.query.nome, $options: "i" };
  }

  const [usuarios, total] = await Promise.all([
    Usuario.find(filtro).select("-__v").skip(skip).limit(limit).sort({ createdAt: -1 }),
    Usuario.countDocuments(filtro),
  ]);

  res.status(200).json({
    sucesso: true,
    paginacao: {
      total,
      pagina: page,
      limite: limit,
      totalPaginas: Math.ceil(total / limit),
    },
    dados: usuarios,
  });
});

// GET /usuarios/:id
const buscarUsuarioPorId = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findById(req.params.id).select("-__v");
  if (!usuario || !usuario.ativo) {
    res.status(404);
    throw new Error("Usuário não encontrado");
  }
  res.status(200).json({ sucesso: true, dados: usuario });
});

// POST /usuarios  (rota protegida — apenas admins criariam usuários direto)
const criarUsuario = asyncHandler(async (req, res) => {
  const usuario = await Usuario.create(req.body);
  res.status(201).json({
    sucesso: true,
    mensagem: "Usuário criado com sucesso!",
    dados: { id: usuario._id, nome: usuario.nome, email: usuario.email },
  });
});

// PUT /usuarios/:id
const atualizarUsuario = asyncHandler(async (req, res) => {
  // Impede que senha seja atualizada por esta rota
  delete req.body.senha;

  const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
}).select("-__v");

  if (!usuario) {
    res.status(404);
    throw new Error("Usuário não encontrado");
  }
  res.status(200).json({ sucesso: true, mensagem: "Usuário atualizado!", dados: usuario });
});

// DELETE /usuarios/:id — soft delete
const deletarUsuario = asyncHandler(async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    { ativo: false },
    { returnDocument: "after" }
  );
  if (!usuario) {
    res.status(404);
    throw new Error("Usuário não encontrado");
  }
  res.status(200).json({ sucesso: true, mensagem: "Usuário desativado com sucesso" });
});

module.exports = { listarUsuarios, buscarUsuarioPorId, criarUsuario, atualizarUsuario, deletarUsuario };
