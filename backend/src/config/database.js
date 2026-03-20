const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/clinica_db",
    );
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao MongoDB:", error.message);
    // Não encerrar o processo, apenas logar o erro
    console.log("⚠️  O servidor continuará rodando sem banco de dados");
  }
};

module.exports = connectDB;
