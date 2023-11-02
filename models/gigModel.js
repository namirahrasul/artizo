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
    INNER JOIN docs d ON g.id = d.gig_id WHERE g.id = ?`
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
    const sql = 'SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email ORDER BY hourly_rate DESC'
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
      'SELECT MAX(hourly_rate) from campaigns'
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
      'SELECT MAX(no_customers) from campaigns'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function getMaxRating() {
  try {
    const res = await pool.execute(
      'SELECT MAX(rating) from campaigns'
    )
    return res
  }
  catch (error) {
    throw error
  }
}

async function filterCampaignCategory(is_prelaunch, is_personal, is_business, minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers) {
  try {

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
  getMaxRating,
  filterCampaignCategory
}
