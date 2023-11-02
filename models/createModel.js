
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
      'INSERT INTO gigs ( email, title, category, description, gig_img, gig_video, hourly_rate, bsb, account, bkash, rocket, nagad, upay) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

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

function insertDoc(
  req,
  email,
  gig_id,
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
      'INSERT INTO docs (email, gig_id, certifications_achievements, testimonials, previous_work) VALUES (?, ?, ?, ?, ?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        email,
        gig_id,
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
module.exports = {
  insertGig,
  insertDoc,
}