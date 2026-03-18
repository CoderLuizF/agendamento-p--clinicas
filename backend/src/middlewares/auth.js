const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Acesso negado. Token não fornecido!",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token inválido ou expirado",
      });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Erro de autenticação",
    });
  }
};

const secretarioOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (user.tipo !== "secretario") {
      return res.status(403).json({
        success: false,
        message: "Acesso negado. Apenas secretários podem acessar!",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao verificar permissões",
    });
  }
};

module.exports = { protect, secretarioOnly };
