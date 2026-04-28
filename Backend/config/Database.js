import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'db_penggajian3';
const DB_USER = process.env.DB_USER || process.env.DB_USERNAME || 'root';
const DB_PASS = process.env.DB_PASS || process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined;

const options = {
    host: DB_HOST,
    dialect: 'mysql'
};

if (DB_PORT) options.port = DB_PORT;

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, options);

export default db;