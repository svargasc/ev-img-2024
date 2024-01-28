// import mysql from 'mysql';
import { createPool } from "mysql2/promise";
// import {DB_HOST, DB_USER, DB_PASWORD, DB_DATABASE, DB_PORT} from '../config.js'

export const pool = createPool(
  {
    host: 'bu7evesmyo0gtb3n64u8-mysql.services.clever-cloud.com',
    database: 'bu7evesmyo0gtb3n64u8',
    user: 'uohrfzc8hkpyk0qm',
    password: '7tU6dFyy4nba0nf8PgBz',
    port: 3306,
    multipleStatements: true,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  console.log("Database is connected")
);
