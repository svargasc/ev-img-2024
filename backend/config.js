import { config } from "dotenv";

config();

export const PORT = process.env.PORT || 5000
export const DB_HOST = process.env.DB_HOST || 'localhost'
export const DB_PORT = process.env.DB_PORT || 3306
export const DB_USER = process.env.DB_USER || 'root'
export const DB_PASWORD = process.env.DB_PASWORD || 'Apto1404'
export const DB_DATABASE = process.env.DB_DATABASE || 'eventsbrews'