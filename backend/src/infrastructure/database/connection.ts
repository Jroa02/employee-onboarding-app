import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const config_client =
  process.env.NODE_ENV === "DEVELOPMENT"
    ? {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        ssl: {
          rejectUnauthorized: false, // Habilita SSL sin verificar el certificado (equivalente a "prefer")
        },
      };

const client = new Client(config_client);

export const createConnection = async () => {
  try {
    await client.connect();
    console.log("Connected to the PostgreSQL database");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export const getPool = () => client;
