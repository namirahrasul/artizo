const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid')

const mysql = require('mysql2')
const multer = require('multer')

const pool = mysql.createPool({
  host: 'localhost',
  user:  'root',
  password:  'root',
  database: 'artizo',
  port:  3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
async function insertUser(req, name, email, password, profile_img, callback) {
  console.log("req.file inside userModel.insertUser", req.file)
  console.log("req.bosy inside userModel.insertUser", req.body)

  // Get a connection from the pool
  pool.getConnection(async (connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }
    hashedPassword = await bcrypt.hash(password, 10)

    // SQL query to insert user information and unique image path
    const sql =
      `INSERT INTO users (name, email, password, profile_img) VALUES (?, ?, ?, ?)`

    // Execute the query with user information and unique image path
    connection.query(
      sql,
      [
        name,
        email,
        hashedPassword,
        profile_img,
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()

        if (queryErr) {
          callback(queryErr)
          return
        }

        callback(null, result)
      }
    )
  })
}


async function storeVerificationToken(email, token) {
  try {
    const expirationTimestamp = calculateExpirationTimestamp()
    const sql =
      'INSERT INTO verification_tokens (email, token, expiration_timestamp) VALUES (?, ?, ?)'
    return new Promise((resolve, reject) => {
      pool.query(sql, [email, token, expirationTimestamp], (err, result) => {
        if (err) {
          console.error('Error inserting token: ', err)
          reject(err)
        }
        resolve(result)
      })
    })
  } catch (error) {
    throw error
  }
}
function calculateExpirationTimestamp() {
  const now = new Date()
  const expiration = new Date(now)
  expiration.setHours(now.getHours() + 24) // Token expires in 24 hours
  return expiration
}

async function verifyUser(token) {
  const sql =
    'SELECT * FROM verification_tokens WHERE token = ? AND expiration_timestamp > NOW()'

  return new Promise((resolve, reject) => {
    pool.query(sql, [token], (err, rows) => {
      if (err) {
        console.error('Error verifying user: ', err)
        reject(err)
      } else if (rows.length > 0) {
        const user = rows[0]

        markEmailAsVerified(user.email)
          .then(() => deleteToken(token))
          .then(() => resolve(user))
          .catch((error) => reject(error))
      } else {
        resolve(null)
      }
    })
  })
}

function markEmailAsVerified(email) {
  const sql = 'UPDATE users SET email_verified = 1 WHERE email = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [email], (error, result) => {
      if (error) {
        console.error('Error marking email as verified:', error)
        reject(error)
      } else {
        console.log('Email marked as verified:', result)
        resolve(result)
      }
    })
  })
}

function deleteToken(token) {
  const sql = 'DELETE FROM verification_tokens WHERE token = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [token], (error, result) => {
      if (error) {
        console.error('Error deleting token:', error)
        reject(error)
      } else {
        console.log('Token deleted:', result)
        resolve(result)
      }
    })
  })
}


// Function to authenticate a user
async function authenticateUser(email, password) {
  const sql = 'SELECT * FROM users WHERE email = ?'

  return new Promise((resolve, reject) => {
    pool.query(sql, [email], async (err, rows) => {
      if (err) {
        console.error('Error authenticating user: ', err)
        reject(err)
        return
      }

      if (rows.length === 0) {
        // If user not found, return null
        resolve(null)
      } else {
        const user = rows[0] // Assuming there's only one matching user
        const passwordMatch = await comparePasswords(password, user.password)

        if (passwordMatch) {
          // If password matches, return the user
          resolve(user)
        } else {
          // If password doesn't match, return null
          resolve(null)
        }
      }
    })
  })
}



async function comparePasswords(inputPassword, hashedPassword) {
  try {
    return await bcrypt.compare(inputPassword, hashedPassword)
  } catch (error) {
    throw error
  }
}
async function changePassword(email, password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const sql = `
    UPDATE users
    SET password = ?
    WHERE email = ?
  `

  return new Promise((resolve, reject) => {
    pool.query(sql, [hashedPassword, email], (err, result) => {
      if (err) {
        console.error('Error changing password: ', err)
        reject(err)
      } else resolve(result)
    })
  })
}



module.exports = {
  storeVerificationToken,
  calculateExpirationTimestamp,
  verifyUser,
  markEmailAsVerified,
  deleteToken,
  authenticateUser,
  changePassword,
  insertUser,
}
