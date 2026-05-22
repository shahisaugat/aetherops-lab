const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const metricsMiddleware = require("./middleware/metricsMiddleware");
const { client } = require("./metrics");

const app = express();

app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(logger);
app.use(express.json());
app.use(metricsMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use("/users", userRoutes);
app.use(errorHandler);

module.exports = app;
