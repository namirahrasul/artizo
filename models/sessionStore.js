const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const mysql = require('mysql2')

// Configure your MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'artizo',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Create a session store using mysql2
const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000, // 15 minutes (adjust as needed)
    expiration: 86400000, // 1 day (adjust as needed)
  },
  pool
);



module.exports = sessionStore
