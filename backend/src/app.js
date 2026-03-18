const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Servidor funcionando!",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
