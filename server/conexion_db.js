import dotenv from "dotenv";
import { Pool } from "pg";
dotenv.config();  // Load variables from .env

export const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 10,               // Maximum number of active connections at the same time
    allowExitOnIdle: false // Wait for queries before closing connections (default)
});

// Test database connection
async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log(' Successfully connected to the database');
        client.release();
    } catch (error) {
        console.error(' Error connecting to the database:', error.message);
    }
}

testDatabaseConnection();
