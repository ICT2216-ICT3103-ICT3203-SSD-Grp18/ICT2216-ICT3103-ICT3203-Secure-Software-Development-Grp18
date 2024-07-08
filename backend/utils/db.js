const mysql = require('mysql2');
const dotenv = require('dotenv');
const iconv = require('iconv-lite');
const encodings = require('iconv-lite/encodings');

// Explicitly set the encoders to iconv-lite
iconv.encodings = encodings;

// Load environment variables from .env file
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4', // Ensure this charset is compatible with your database
  authPlugins: { // Ensure you use the correct authentication plugin
    mysql_clear_password: () => (pluginData) => {
      return pluginData.password;
    },
  },
});

// Conditionally connect to the database only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
    connection.release();
  });
}

module.exports = pool.promise();
