const app = require("./src/app");
const connectDB = require("./src/config/database");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`);
});
