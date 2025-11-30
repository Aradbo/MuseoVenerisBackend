// src/config/db.js
const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433"),
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

let pool;

async function getConnection() {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
      console.log("Conectado a SQL Server (Azure)");
    }
    return pool;
  } catch (error) {
    console.error("Error al conectar con SQL Server", error);
    throw error;
  }
}

async function closeConnection() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log("Conexión a SQL Server cerrada.");
  }
}

module.exports = { sql, getConnection, closeConnection };
