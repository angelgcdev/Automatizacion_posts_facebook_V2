// src/db.js
import pg from "pg";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  // Configuracion adicional para UTF-8
  connectionString: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}?client_encodeing=UTF8`
});

export { pool };
