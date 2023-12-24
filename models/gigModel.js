// models/campaignModel.js
const adminModel = require('./adminModel')
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
     WHERE g.id = ? and g.is_approved = 1 and g.is_deleted = 0 and g.is_reviewed = 1 and u.is_blocked = 0`
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

async function getApprovedGigById(gigId) {
  try {
    console.log(gigId)
    const sql = `SELECT * FROM gigs  g INNER JOIN users u  ON g.email = u.email
     WHERE g.id = ? and g.is_approved = 1 and g.is_deleted = 0 and g.is_reviewed = 1 and u.is_blocked = 0`
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

async function getPreviousGigById(gigId) {
  try {
    console.log(gigId)
    const sql = `SELECT * FROM gigs  g INNER JOIN users u  ON g.email = u.email
     WHERE g.id = ? and g.is_approved = 0 and g.is_deleted = 0 and g.is_reviewed = 1 and u.is_blocked = 0`
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

async function getEditedGigById(gigId) {
  try {
    const sql = `SELECT * FROM edit_gigs  g INNER JOIN users u  ON g.email = u.email
     WHERE g.id = ? and g.is_approved = 0 and g.is_deleted = 0 and g.is_reviewed = 0 and u.is_blocked = 0`
    const [rows, fields] = await pool.execute(
      sql,
      [gigId]
    )
    if (rows.length === 1) {
      return rows[0]
    } else {
      throw new Error('Gig not found')
    }
  }
  catch (error) {
    throw error
  }
}


async function getGigs() {
  try {
    const sql = `SELECT * FROM gigs g INNER JOIN users u  ON g.email = u.email  where g.is_reviewed = 1 and g.is_deleted = 0 and g.is_approved = 1 and u.is_blocked = 0`

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

async function InsertReport(gigId, email, title, description, evidence) {

  try {
    console.log(gigId, email, title, description, evidence);
    const sql = `INSERT INTO reports (gig_id, email, title, description, evidence) VALUES (?, ?, ?, ?, ?)`;
    const [rows, fields] = await pool.execute(sql, [gigId, email, title, description, evidence]);
    const [rows2, fields2] = await adminModel.getGigInfoById(gigId);
    console.log(rows2.email)
    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?, ?, ?, ?)';

    const [rows3, fields3] = await pool.execute(sql2, [gigId, rows2.email, 'report', `Your gig <a class="notifcontent" href="/browse-gigs/${gigId}">${rows2.title}</a> has been reported. We will contact you after further investigation.`]);
    const [rows4, fields4] = await pool.execute(sql2, [gigId, email, 'report', `Your report about the gig <a class="notifcontent" href="/browse-gigs/${gigId}">${rows2.title}</a> has been submitted.`]);
    return rows4.affectedRows; // This will contain information about the affected rows
  } catch (error) {
    throw error;
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
  filterGigCategory,
  InsertReport,
  getPreviousGigById,
  getEditedGigById,
  getApprovedGigById

}
