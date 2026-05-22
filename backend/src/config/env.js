require("dotenv").config();
const { SecretClient } = require("@azure/keyvault-secrets");
const { DefaultAzureCredential } = require("@azure/identity");

const loadSecrets = async () => {
  const isProduction = process.env.NODE_ENV === "production";
  const useKeyVault = process.env.USE_KEY_VAULT === "true";

  if (isProduction && useKeyVault) {
    console.log("Loading secrets from Azure Key Vault...");
    const vaultUrl = "https://aetherops-kv.vault.azure.net";
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(vaultUrl, credential);
    const secretNames = [
      "DB-HOST",
      "DB-PORT",
      "DB-NAME",
      "DB-USER",
      "DB-PASSWORD",
      "PORT",
      "NODE-ENV",
    ];
    const secrets = {};
    for (const name of secretNames) {
      const secret = await client.getSecret(name);
      secrets[name] = secret.value;
    }
    return {
      port: secrets["PORT"] || 3000,
      nodeEnv: secrets["NODE-ENV"] || "production",
      db: {
        host: secrets["DB-HOST"],
        port: parseInt(secrets["DB-PORT"]),
        database: secrets["DB-NAME"],
        user: secrets["DB-USER"],
        password: secrets["DB-PASSWORD"],
      },
    };
  }

  console.log("Loading secrets from environment variables...");
  const required = [
    "PORT",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
  ];
  required.forEach((key) => {
    if (!process.env[key]) {
      console.error(`Missing required environment variable: ${key}`);
      process.exit(1);
    }
  });
  return {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    db: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  };
};

module.exports = { loadSecrets };
