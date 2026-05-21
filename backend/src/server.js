const app = require("./app");
const { loadSecrets } = require("./config/env");
const { Pool } = require("pg");
const { setPool } = require("./db/pool");

const startServer = async () => {
  try {
    const config = await loadSecrets();

    console.log("Secrets loaded. Connecting to database...");

    const pool = new Pool({
      host: config.db.host,
      port: config.db.port,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
    });

    pool.on("connect", () => {
      console.log("Connected to PostgreSQL");
    });

    pool.on("error", (err) => {
      console.error("PostgreSQL pool error:", err.message);
      process.exit(1);
    });

    setPool(pool);

    const server = app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`,
      );
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await pool.end();
        console.log("Database pool closed. Server stopped.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
