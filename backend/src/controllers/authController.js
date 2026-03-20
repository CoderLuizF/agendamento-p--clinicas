const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Registrar
const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, dataNascimento, endereco } =
      req.body;

    // Verificar se já existe
    const existe = await User.findOne({ email });
    if (existe) {
      return res
        .status(400)
        .json({ success: false, message: "Email já cadastrado" });
    }

    // Criar usuário
    const user = new User({
      nome,
      email,
      senha,
      tipo,
      telefone,
      dataNascimento,
      endereco,
    });
    await user.save();

    // Gerar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou senha inválidos" });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res
        .status(401)
        .json({ success: false, message: "Email ou senha inválidos" });
    }

    // Gerar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login };
