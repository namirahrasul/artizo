const mysql = require('mysql2/promise')
const path = require('path')

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
// Async function to insert data into the follow table
async function insertFollowData(follower, gig_id) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO follow (follower, gig_id) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, gig_id])

    // Return the inserted row
    return rows
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate key error
      console.error(`Duplicate key error: ${follower} already exists.`);
      return null; // You can return null or some other value to indicate the error
    }
    console.error('Error inserting data into follow table:', error)
    throw error
}
}

async function updateGigFollowersById(gigId) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE gigs SET no_followers = no_followers + 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [gigId]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}




// Async function to retrieve data from the tables for notification
async function getNotifById(notif) {
  try {
    const sql = `SELECT
    f.fid,
    u.name,
    g.title,
    g.email,
    TIME(f.ftime) as tt,
    CONCAT(
      DATE_FORMAT(f.ftime, '%D'), 
      DATE_FORMAT(f.ftime, ' %M')
    ) as dd
  FROM follow as f
  JOIN gigs as g ON f.gig_id = g.id
  JOIN users as u ON f.follower = u.email
  where g.email=(?)
  ORDER BY ftime`;
    const [rows, fields] = await pool.execute(sql,[notif]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyGigs(email){
  try {
     const sql=`SELECT * FROM gigs INNER JOIN users  ON gigs.email = users.email where gigs.email=(?)`
    const [rows, fields] = await pool.execute(sql,[email]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyFollow(email){
  try {
    const sql = `SELECT * FROM gigs INNER JOIN follow  ON gigs.id = follow.gig_id where follow.follower=(?)`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}


module.exports = {
  insertFollowData,
  getNotifById,
  getMyGigs,
  getMyFollow, 
  updateGigFollowersById,
}