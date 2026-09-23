const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 4000, // TiDB Cloud Serverless always uses port 4000
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // TiDB Cloud Serverless requires TLS 1.2 or higher
    ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true // Keep this true for security
    }
});

const promisePool = pool.promise();
module.exports = promisePool;