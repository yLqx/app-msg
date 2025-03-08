const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();

pool.getConnection()
    .then(() => console.log("✅ MySQL Database Connected"))
    .catch((err) => console.error("❌ Database Connection Error:", err));

module.exports = pool;
