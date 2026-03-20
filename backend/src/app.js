const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

module.exports = app;
