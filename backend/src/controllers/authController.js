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

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: "Email e senha são obrigatórios",
      });

      const user = await User.findOne({ email }).select("+senha");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email ou senha inválidos",
        });
      }

      const senhaValida = await user.compareSenha(senha);

      if (!senhaValida) {
        return res.status(401).json({
          success: false,
          message: "Email ou senha inválidos",
        });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          _id: user._id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          token,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao fazer login",
      error: error.message,
    });
  }

  const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      res.json({
        succes: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        succes: false,
        message: "Erro ao buscar usuário",
      });
    }
  };
};

module.exports = { register, login, getMe };
