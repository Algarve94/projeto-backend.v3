const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório"],
      trim: true,
      minlength: [2, "O nome deve ter pelo menos 2 caracteres"],
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Formato de e-mail inválido"],
    },
    senha: {
      type: String,
      required: [true, "A senha é obrigatória"],
      minlength: 6,
      select: false, // Nunca retorna a senha nas consultas por padrão
    },
    idade: {
      type: Number,
      min: [0, "Idade não pode ser negativa"],
      max: [120, "Idade inválida"],
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ── Hook: faz o hash da senha ANTES de salvar ─────────────────────
usuarioSchema.pre("save", async function () {
  if (!this.isModified("senha")) return; // só rehasha se mudou
  this.senha = await bcrypt.hash(this.senha, 12);
});

// ── Método de instância: compara senha em texto com o hash ────────
usuarioSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
