const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo, telefone, dataNascimento, endereco } =
      req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email já cadastrado",
      });
    }

    const user = await User.create({
      nome,
      email,
      senha,
      tipo,
      telefone,
      dataNascimento,
      endereco,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: {
        _id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao cadastrar usuário",
      error: error.message,
    });
  }
};
