// app.js
const express = require("express");
const authRouter = require("./modules/auth/auth.routes"); // your router file

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);

module.exports = app;
