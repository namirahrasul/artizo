
const mysql = require('mysql2')

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
        gig_id, email, "edit", `Your edit request has been submitted for review.`
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
 function insertOffer(
  req,
  gigId,
  email,
  description,
  hours,
  materials,
  comments,
  callback
) {
   console.log("gigId", gigId)
   console.log("email", email)
   console.log("description", description)
   console.log("hours", hours)
   console.log("materials", materials)
   console.log("comments", comments)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }


    // SQL query to insert user information and unique image path
    const sql2 =
      'INSERT INTO offers ( gig_id, client , description, hours, material, comments) VALUES (?, ?, ?, ?, ?, ?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gigId,
        email,
        description,
        hours,
        materials,
        comments,
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


function insertHired(
  req,
  gigId,
  email,
  offer_id,
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
      'INSERT INTO hired ( gig_id, client , offer_id) VALUES (?, ?, ?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gigId,
        email,
        offer_id,
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


function insertOfferNotif(
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
        gig_id, email, "offer", `Your offer to gig <a class="notifcontent" href="/browse-gigs/${gig_id}">${title}</a> has been successfully submitted`
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

function insertHiredNotif(
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
        gig_id, email, "hired", `Your gig <a class="notifcontent" href="/browse-gigs/${gig_id}">${title}</a> has received an offer`
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


function insertAcceptNotif(
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

    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?,?,?,?)';


    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gig_id, email, "accepted", `Your offer to gig <a class="notifcontent" href="/browse-gigs/${gig_id}">${title}</a> has been accepted`
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


function insertRejectNotif(
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

    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?,?,?,?)';


    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gig_id, email, "rejected", `Sorry!! Your offer to gig <a class="notifcontent" href="/browse-gigs/${gig_id}">${title}</a> has been rejected`
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


function insertCompletedNotif(
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

    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES (?,?,?,?)';


    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        gig_id, email, "completed", `The freelancer for gig <a class="notifcontent" href="/browse-gigs/${gig_id}">${title}</a> has been completed their work`
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
  updateExistingGig,
  insertOffer,
  insertHired,
  insertOfferNotif,
  insertHiredNotif,
  insertAcceptNotif,
  insertRejectNotif,
  insertCompletedNotif
  
}