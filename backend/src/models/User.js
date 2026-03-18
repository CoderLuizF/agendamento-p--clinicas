const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
    minlength: [3, "Nome deve ter no mínimo 3 caracteres"],
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    lowercase: true,
    trim: true,
    //esse match eu pesquisei para ter uma validação de email melhor!
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"],
  },
  senha: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [6, "Senha deve ter no mínimo 6 caracteres"],
    select: false,
  },
  tipo: {
    type: String,
    enum: ["paciente", "secretario"],
    default: "paciente",
  },
  telefone: {
    type: String,
    required: [true, "Telefone é obrigatório"],
  },
  dataNascimento: {
    type: Date,
    required: [true, "Data de nascimento é obrigatória"],
  },
  endereco: {
    cep: String,
    logradouro: String,
    numero: String,
    complemento: String,
    bairro: String,
    cidade: String,
    estado: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (error) {
    next(ErrorEvent);
  }
});

userSchema.methods.compareSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("User", userSchema);
