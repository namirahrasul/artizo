const mysql = require('mysql2/promise')
const path = require('path')
const gigModel = require('../models/gigModel')

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
async function insertFollowData(follower, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO follow (follower, gig_id) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, cid])

    // Return the inserted row
    return rows.insertId
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
// Async function to insert data into the follownotif table
async function insertFollowNotif(follower,gig_id) {
  try {
    // Define the SQL query
    
    const rows = await gigModel.getGigById(gig_id);
    
    const sql3 = 'SELECT * FROM users WHERE email = ?'
    const [rows3, fields3] = await pool.query(sql3, [follower])
    
    const sql = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?, ?,?,?)';
    const [row5, fields5] = await pool.query(sql, [gig_id, rows.email, "follow", ` <a class="notifcontent" href="/user/${follower}">${rows3[0].name}</a> followed your gig  <a class="notifcontent" href="/browse-gigs/${gig_id}">${rows.title}</a>`])

    // Return the inserted row
    return rows.affectedRows
  } catch (error) {
   console.error('Error inserting data into notif table:', error)
  }
}

async function deleteFollowData(follower, cid) {
  try {
    // Define the SQL query to delete follow data
    const sql = 'DELETE FROM follow WHERE follower = ? and gig_id = ?';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, cid]);

    // Return the result of the deletion operation
    return rows;
  } catch (error) {
    console.error('Error deleting data from follow table:', error);
    throw error;
  }
}

async function InsertGigFollowersById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE gigs SET no_followers = no_followers + 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}


async function deleteGigFollowersById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE gigs SET no_followers = no_followers - 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}


async function checkIfFollowing(followerId, gigId) {
  try {
    const sql = `select count(*) as count from follow where follower = ? and gig_id = ? `
    const [rows, fields] = await pool.execute(
      sql,
      [followerId, gigId]
    )
    // Assuming rows[0].count is the count value returned by the query
    return rows;

    // Return true if count is 1, false otherwise

  } catch (error) {
    throw error
  }
}


async function getMyFollow(email){
  try {
    const sql = `SELECT * FROM gigs INNER JOIN follow  ON gigs.id = follow.gig_id  INNER JOIN users ON gigs.email = users.email where follow.follower=(?)`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}



module.exports = {
  insertFollowData,
  insertFollowNotif,
  getMyFollow, 
  InsertGigFollowersById,
  deleteFollowData,
  checkIfFollowing,
  deleteGigFollowersById

}