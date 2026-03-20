const app = require("./src/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

connectDB();

process.on("uncaughtException", (error) => {
  console.error("Erro não capturado:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Promise rejeitada:", error);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
