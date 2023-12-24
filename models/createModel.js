
const mysql = require('mysql2')

// const upload = multer({ dest: 'uploads/' });

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



function insertGig(
  req,
  email,
  title,
  category,
  description,
  gig_img,
  gig_video,
  hourly_rate,
  bsb,
  account,
  bkash,
  rocket,
  nagad,
  upay,
  certifications_achievements,
  testimonials,
  previous_work,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }


    // SQL query to insert user information and unique image path
    const sql2 =
      `INSERT INTO gigs ( email, title, category, description, gig_img, gig_video, hourly_rate, bsb, account, bkash, rocket, nagad, upay,certifications_achievements,
    testimonials, previous_work) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)`

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        email,
        title,
        category,
        description,
        gig_img,
        gig_video,
        hourly_rate,
        bsb,
        account,
        bkash,
        rocket,
        nagad,
        upay,
        certifications_achievements,
        testimonials,
        previous_work,
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

function insertCreateNotif(
  req,
  email,
  gig_id,
  title,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }


    // SQL query to insert user information and unique image path
    
      const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?, ?,?,?)';
    

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gig_id, email, "create", `Your gig <span class="notifcontent-submit">${title}</span> has been submitted for review.`
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
   

function insertEditGig(
  req,
  insertSql,
  insertValues, 
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }


    // SQL query to insert user information and unique image path
    
    // Execute the query with user information and unique image path
    connection.query(
      insertSql,
      insertValues,
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

function insertEditNotif(
  req,
  email,
  gig_id,
  title,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }


    // SQL query to insert user information and unique image path

    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?, ?,?,?)';


    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gig_id, email, "edit", `Your edit on gig <span class="notifcontent-submit">${title}</span> has been submitted for review.`
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
function updateExistingGig(
  req,
  gig_id,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }
    // SQL query to insert user information and unique image path

    const sql = 'UPDATE gigs set is_approved=0 where id= ?';


    // Execute the query with user information and unique image path
    connection.query(
      sql,
      [
        gig_id
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

  

module.exports = {
  insertGig,
  insertCreateNotif,
  insertEditGig,
  insertEditNotif,
  updateExistingGig
}