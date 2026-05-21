const express = require("express");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(helmet());
app.use(logger);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use("/users", userRoutes);
app.use(errorHandler);

module.exports = app;
