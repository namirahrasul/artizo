// models/campaignModel.js
const mysql = require('mysql2/promise') // Use 'mysql2' with promises

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


async function getGigById(gigId) {
  try {
    const sql = `SELECT * FROM gigs  g INNER JOIN users u  ON g.email = u.email
     WHERE g.id = ?`
    const [rows, fields] = await pool.execute(
      sql,
      [gigId]
    )
    if (rows.length === 1) {
      return rows[0]
    } else {
      throw new Error('Gig not found')
    }
  } catch (error) {
    throw error
  }
}


async function getGigs() {
  try {
    const sql = `SELECT * FROM gigs g INNER JOIN users u  ON g.email = u.email `

    const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}

async function searchGig(search) {
  try {
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email WHERE  LOWER(title) LIKE LOWER(?)'
    const [rows, fields] = await pool.execute(
      sql,
      ['%' + search.toLowerCase() + '%']
    )
    return rows
  }
  catch (error) {
    throw error
  }
}
async function sortGigHourlyRate() {
  try {
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email ORDER BY hourly_rate '
    const [rows, fields] = await pool.execute(sql)
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortGigFollowers() {
  try {
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email ORDER BY no_followers DESC'
    const [rows, fields] = await pool.execute(sql)
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortGigRating() {
  try {
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email ORDER BY rating DESC'
    const [rows, fields] = await pool.execute(sql)
    return rows
  }
  catch (error) {
    throw error
  }
}

async function sortGigCustomers() {
  try {
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email ORDER BY no_customers DESC'
    const [rows, fields] = await pool.execute(sql)
    return rows
  }
  catch (error) {
    throw error
  }
}

async function getMaxFollowers() {
  try {
    const res = await pool.execute(
      'SELECT MAX(no_followers) from gigs'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function getMaxHourlyRate() {
  try {
    const res = await pool.execute(
      'SELECT MAX(hourly_rate) from gigs'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function getMaxCustomers() {
  try {
    const res = await pool.execute(
      'SELECT MAX(no_customers) from gigs'
    )
    return res
  }
  catch (error) {
    throw error
  }
}



async function filterGigCategory(category, minFollowers, maxFollowers, minHourlyRate, maxHourlyRate, minCustomers, maxCustomers, minRating, maxRating) {
  try {
    var sql1 = `SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email WHERE `;
    var sql2 = 'category = ? AND '
    var sql3 = `no_followers >= ? AND no_followers <= (?) AND hourly_rate >= ? AND hourly_rate <= (?) AND no_customers >= ?  AND no_customers <= (?) AND rating >= ? AND rating <= ?`
    var stmt;
    var params = []
    if ((category)) {
      stmt = sql1 + sql2 + sql3;
      params = [category, minFollowers, maxFollowers, minHourlyRate, maxHourlyRate, minCustomers, maxCustomers, minRating, maxRating]
    }
    else {
      stmt = sql1 + sql3;
      params = [minFollowers, maxFollowers, minHourlyRate, maxHourlyRate, minCustomers, maxCustomers, minRating, maxRating]
    }
    const [rows, fields] = await pool.execute(
      stmt,
      params
    )
    return rows
  }
  catch (error) {
    throw error
  }
}




module.exports = {
  getGigById,
  getGigs,
  searchGig,
  sortGigHourlyRate,
  sortGigFollowers,
  sortGigRating,
  sortGigCustomers,
  getMaxFollowers,
  getMaxHourlyRate,
  getMaxCustomers,
  filterGigCategory
}
