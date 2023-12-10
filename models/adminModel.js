const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid')
// Use 'bcryptjs' to hash and salt passwords
const mysql = require('mysql2/promise') // Use 'mysql2' with promises

// Configure your MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'artizo',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})


async function getNotApprovedGigsById(campaignId) {
  try {
    const sql = `SELECT * FROM gigs INNER JOIN users ON gigs.email=users.email WHERE id = ? and is_reviewed=0 and is_deleted=0 and users.is_blocked=0`
    const [rows, fields] = await pool.execute(
      sql,
      [campaignId]
    )
    if (rows.length === 1) {
      return rows[0]
    } else {
      throw new Error('Campaign not found')
    }
  } catch (error) {
    throw error
  }
}


async function getNotApprovedGigs() {
  try {
    const sql = `SELECT * from gigs INNER JOIN users ON gigs.email=users.email WHERE is_reviewed=0 and is_deleted=0 and users.is_blocked=0`

    const [rows, fields] = await pool.execute(sql) // Replace 'Gigs' with your table name
    return rows
  } catch (error) {
    throw error
  }
}


async function getUsers() {
  try {
    const sql = `SELECT * from users where is_admin=0 and email_verified=1 and is_blocked=0`
    const [rows, fields] = await pool.execute(sql) // Replace 'Gigs' with your table name
    return rows
  } catch (error) {
    throw error
  }
}

async function createAdmin(name, email, password) {
  try {
    // Hash and salt the password using bcrypt
    hashedPassword = await bcrypt.hash(password, 10) // 10 is the number of salt rounds
    const sql =
      'INSERT INTO users (name, email, password, email_verified, is_admin) VALUES (?, ?, ?, ?, ?)'
    const [rows, fields] = await pool.execute(sql, [name, email, hashedPassword, 0, 1]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

async function blockUser(email, reason) {
  try {
    const sql =
      'update users set email_verified=0, is_blocked = 1 WHERE email = ?'
    const [rows, fields] = await pool.execute(sql, [email]);
    const sql2 = `insert into blocked_users (email,reason) values (?,?)`
    const [rows2, fields2] = await pool.execute(sql2, [email, reason]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

async function declineGig(id) {
  try {
    const sql =
      'UPDATE gigs set is_reviewd=1 and is_deleted=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const [rows2,fields2] = await getGigInfoById(id);
    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows3, fields3] = await pool.execute(sql2, [id, rows2[0].email, 'create', `Your gig ${rows2[0].title} has been declined`]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}

async function approveGig(id) {
  try {
    const sql =
      'UPDATE gigs set is_reviewed=1 and is_approved=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const [rows2, fields2] = await getGigInfoById(id);
    const sql2 = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows3, fields3] = await pool.execute(sql2, [id, rows2[0].email, 'create', `Your gig ${rows2[0].title} has been approved`]);
    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}

async function requestDelete(id, reason, email) {
  try {
    console.log("id ", id)
    console.log("reason ", reason)
    const sql = `INSERT INTO delete_gigs (gig_id,reason) VALUES (?,?)`
    const [rows, fields] = await pool.execute(sql, [id, reason]);
    const sql2 = `INSERT INTO notifs (gig_id,email,type,description) VALUES (?,?,?)`
    const getGigTitle = `SELECT title FROM Gigs WHERE id = ?`
    const [rows3, fields3] = await pool.execute(getGigTitle, [id]);
    const [rows2, fields2] = await pool.execute(sql2, [id, email , 'delete', `Your request to delete the gig ${rows3[0].title} has been submitted`]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error inserting into delete', error);
    throw error;
  }
}

async function getGigTitleById(id) {
  try {
    const sql = `SELECT title FROM gigs WHERE id = ?`
    const [rows, fields] = await pool.execute(sql, [id]);
    return rows[0].title;
  } catch (error) {
    throw error;
  }
}

async function declineEdit(id) {
  try {
    const sql2 = 'SELECT * from edit_gigs where id = ?'
    const [rows2, fields2] = await pool.execute(sql2, [id]);
    const old_id = rows2[0].old_id;
    const sql =
      'UPDATE edit_gigs set is_reviewed=1 and is_declined=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const sql3 = 'UPDATE gigs set is_reviewed=1 WHERE id = ?'
    const [rows3, fields3] = await pool.execute(sql3, [old_id]);
    // const getEmail = `SELECT email FROM edit_Gigs WHERE id = ?`
    // const sql2 = 'INSERT INTO admin_notifs (cid,email,is_delete,is_edit,is_approved) VALUES  (?,?,?,?,?)'
    // const [rows2, fields2] = await pool.execute(sql2, [id, getEmail[0].email, 0, 1, 0]);

    return rows3.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function approveEdit(id) {
  console.log("id ", id)
  try {
    const sql =
      'UPDATE edit_gigs set is_approved=1 and is_reviewed=1 WHERE id = ?'

    const [rows, fields] = await pool.execute(sql, [id]);
    const newGig = `SELECT * FROM edit_gigs WHERE id = ?`
    const updateOldGig =
      'UPDATE gigs set title=?,city=?,state=?,type=?,tagline=?,description=?,campaign_img=?, campaign_video=?, feature=?, feature_img=?, goal_date=?,goal_amount=?,bsb=?,account=?,bkash=?,rocket=?,nagad=?,upay=?,perk_title=?,perk_description=?,perk_img=?,perk_price=?,perk_retail_price=?,perk_date=?,nid_front=?,nid_back=?,passport=?,fb_url=? , twitter_url=?,yt_url=?, website_url=?, certificates_achievements=?,testimonials=?,previous_work=? ,is_approved=1, is_reviewed=1  WHERE id = ?'
    const [rows2, fields2] = await pool.execute(newGig, [id]);
    console.log("SELECT * FROM edit_gigs WHERE id = ? ", rows2);
    const [rows4, fields4] = await pool.execute(updateOldGig, [rows2[0].title, rows2[0].city, rows2[0].state, rows2[0].type, rows2[0].tagline, rows2[0].description, rows2[0].campaign_img, rows2[0].campaign_video, rows2[0].feature, rows2[0].feature_img, rows2[0].goal_date, rows2[0].goal_amount, rows2[0].bsb, rows2[0].account, rows2[0].bkash, rows2[0].rocket, rows2[0].nagad, rows2[0].upay, rows2[0].perk_title, rows2[0].perk_description, rows2[0].perk_img, rows2[0].perk_price, rows2[0].perk_retail_price, rows2[0].perk_date, rows2[0].nid_front, rows2[0].nid_back, rows2[0].passport, rows2[0].fb_url, rows2[0].twitter_url, rows2[0].yt_url, rows2[0].website_url, rows2[0].certificates_achievements, rows2[0].testimonials, rows2[0],previous_work, rows2[0].old_id]);
    
    console.log("rows2[0].old_id ", rows2[0].old_id)
    console.log("rows2[0].email ", rows2[0].email)
    
    const insert = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [rows2[0].old_id, rows2[0].email, 'edit', `Your request to edit the gig ${rows2[0].title} has been approved`]);
    return rows6.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function declineDelete(id) {
  try {
    const sql = 'UPDATE delete_gigs set is_approved=1 and is_reviewed=1 WHERE gig_id = ?'
    const [rows, fields] = await pool.execute(sql, [id])
    const [rows2, fields2] = await getGigInfoById(id);
    const insert = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [id, rows2[0].email, 'delete', `Your request to delete the gig ${rows2[0].title} has been declined`]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function approveDelete(id) {
  try {
    const sql = 'UPDATE delete_gigs set is_approved=1 and is_reviewed=1 WHERE gig_id = ?'
    const [rows, fields] = await pool.execute(sql, [id])
    const sql2 = 'UPDATE gigs set is_approved=0 and is_deleted=1  and is_reviewed=1 WHERE id = ?'
    const [rows2, fields2] = await pool.execute(sql, [id])
    const [rows3, fields3] = await getGigInfoById(id);
    const insert = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [rows3[0].id, rows3[0].email, 'delete', `Your request to delete the gig ${rows3[0].title} has been approved`]);

    return rows6.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)

  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}




// async function insertRejectData(email, cid) {
//   try {
//     const sql = `INSERT INTO reject (email,cid) VALUES (?,?)`;
//     const [rows, fields] = await pool.execute(sql, [email, cid]) // Replace 'Gigs' with your table name
//     return rows
//   } catch (error) {
//     throw error
//   }
// }

async function getNotApprovedReports() {
  try {
    const sql = `SELECT reports.id as rid, reports.gig_id,gigs.title as gig_title,reports.email,reports.title,reports.description,evidence,reports.time,users.name FROM users INNER JOIN reports ON users.email = reports.email INNER JOIN gigs ON gigs.id = reports.gig_id WHERE
  reports.is_reviewed = 0 ORDER BY reports.time DESC`

    const [rows, fields] = await pool.execute(sql) // Replace 'Gigs' with your table name
    return rows
  } catch (error) {
    throw error
  }
}

async function markGigsReviewed(id) {
  try {
    const sql =
      'UPDATE reports set is_reviewed=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const sql2 = 'SELECT * FROM reports WHERE id = ?'
    const [rows2, fields2] = await pool.execute(sql2, [id]);
    const sql3 = 'SELECT title FROM gigs WHERE id = ?'
    const [rows3, fields3] = await pool.execute(sql3, [id]);
    const insert = 'INSERT INTO notifs (gig_id,email,type,description) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [id, rows2[0].email, 'report', `Your report on the gig ${rows3[0].title} has been reviewed`]);
    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}

async function getReportById(id) {
  try {
    const sql = `SELECT * from reports where id = ?`;
    const [rows, fields] = await pool.execute(sql, [id]);
    return rows[0];
  } catch {
    throw error;
  }
}

async function selectEditRequests() {
  try {
    const sql = `SELECT
    gigs.id AS o_id,
    gigs.email AS o_email,
    gigs.title AS o_title,
    gigs.category AS o_category,
    gigs.description AS o_description,
    gigs.gig_img AS o_gig_img,
    gigs.gig_video AS o_gig_video,
    gigs.hourly_rate AS o_hourly_rate,
    gigs.bsb AS o_bsb,
    gigs.account AS o_account,
    gigs.bkash AS o_bkash,
    gigs.rocket AS o_rocket,
    gigs.nagad AS o_nagad,
    gigs.upay AS o_upay,
    gigs.fb_url AS o_fb_url,
    gigs.twitter_url AS o_twitter_url,
    gigs.yt_url AS o_yt_url,
    gigs.website_url AS o_website_url,
    gigs.no_followers AS o_no_followers,
    gigs.no_customers AS o_no_customers,
    gigs.rating AS o_rating,
    gigs.certifications_achievements AS o_certifications_achievements,
    gigs.testimonials AS o_testimonials,
    gigs.previous_work AS o_previous_work ,
    edit_gigs.id AS n_id,
    edit_gigs.email AS n_email,
    edit_gigs.title AS n_title,
    edit_gigs.type AS n_type,
    edit_gigs.description AS n_description,
    edit_gigs.gig_img AS n_gig_img,
    edit_gigs.gig_video AS n_gig_video,
    edit_gigs.bsb AS n_bsb,
    edit_gigs.account AS n_account,
    edit_gigs.bkash AS n_bkash,
    edit_gigs.rocket AS n_rocket,
    edit_gigs.nagad AS n_nagad,
    edit_gigs.upay AS n_upay,
    edit_gigs.fb_url AS n_fb_url,
    edit_gigs.twitter_url AS n_twitter_url,
    edit_gigs.yt_url AS n_yt_url,
    edit_gigs.website_url AS n_website_url,
    edit_gigs.hourly_rate AS n_hourly_rate,
    edit_gigs.no_followers AS n_no_followers,
    edit_gigs.no_customers AS n_no_customers,
    edit_gigs.rating AS n_rating,
    edit_gigs.nid_back AS n_nid_back,
    edit_gigs.certificates_achievements AS n_certificates_achievements,
    edit_gigs.testimonials AS n_testimonials,
    edit_gigs.previous_work AS n_previous_work
FROM
    gigs
INNER JOIN
    edit_gigs ON gigs.id = edit_gigs.old_id
    where edit_gigs.is_approved=0 and edit_gigs,is_deleted=0
    `

    const [rows, fields] = await pool.execute(sql)
    return rows;
  } catch (error) {
    throw error;
  }

}
async function getGigEmailById(campaignId) {
  try {
    const sql = `SELECT email FROM gigs WHERE id = ?`;
    const [rows, fields] = await pool.execute(sql, [campaignId]) // Replace 'Gigs' with your table name
    //  return rows
    if (rows.length > 0) {
      return rows[0].email;
    } else {
      return null; // Or handle the case when there is no matching campaign ID
    }
  } catch (error) {
    throw error
  }
}
async function getGigInfoById(gigId) {
  try {
    const sql = `SELECT * FROM gigs WHERE id = ?`;
    const [rows, fields] = await pool.execute(sql, [gigId]) // Replace 'Gigs' with your table name
    return rows
    
  } catch (error) {
    throw error
  }
}



async function selectDeleteRequests() {
  try {
    const sql = `SELECT  delete_gigs.id as did, gig_id, reason, gigs.email from delete_gigs INNER JOIN gigs ON delete_gigs.gig_id=gigs.id where delete_gigs.is_reviewed=0 order by time desc`;
    const [rows, fields] = await pool.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getDeleteRequestById(id) {
  try {
    const sql = `SELECT gigs.title,delete_gigs.reason from delete_gigs INNER join gigs on delete_gigs.gig_id=gigs.id where delete_gigs.id = ?`;
    const [rows, fields] = await pool.execute(sql, [id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}


module.exports = {
  getNotApprovedGigsById,
  getNotApprovedGigs,
  getUsers,
  createAdmin,
  blockUser,
  declineGig,
  approveGig,
  requestDelete,
  getGigTitleById,
  declineEdit,
  approveEdit,
  declineDelete,
  approveDelete,
  getNotApprovedReports,
  markGigsReviewed,
  getReportById,
  selectEditRequests,
  getGigEmailById,
  getGigInfoById,
  selectDeleteRequests,
  getDeleteRequestById
}
