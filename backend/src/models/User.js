const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  senha: {
    type: String,
    required: true,
    select: false,
  },
  tipo: {
    type: String,
    enum: ["paciente", "secretario"],
    default: "paciente",
  },
  telefone: {
    type: String,
    required: true,
  },
  dataNascimento: {
    type: Date,
    required: true,
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

// Middleware para criptografar senha antes de salvar
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("senha")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.senha, salt, function (err, hash) {
      if (err) return next(err);
      user.senha = hash;
      next();
    });
  });
});

// Método para comparar senhas
userSchema.methods.compareSenha = function (senhaDigitada, callback) {
  bcrypt.compare(senhaDigitada, this.senha, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Versão com Promise para usar com async/await
userSchema.methods.compareSenhaAsync = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("User", userSchema);
