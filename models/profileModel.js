const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'artizo',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function updateProfile(req, email, phone, profile_img, occupation, years_of_experience, resume, bio_description, work_description, institute_name, institute_country, graduation_year, study_field, institute_certificate, fb_url, twitter_url, yt_url, website_url) {
  const sql = 'UPDATE users SET phone = ?, profile_img = ?, occupation = ?, years_of_experience = ?, resume = ?, bio_description = ?, work_description = ?, institute_name = ?, institute_country = ?, graduation_year = ?, study_field = ?, institute_certificate = ?, fb_url = ?, twitter_url = ?, yt_url = ?, website_url = ? WHERE email = ?';
  const values = [phone, profile_img, occupation, years_of_experience, resume, bio_description, work_description, institute_name, institute_country, graduation_year, study_field, institute_certificate, fb_url, twitter_url, yt_url, website_url, email];
  try {
    const [rows, fields] = await pool.execute(sql, values);
    return rows.affectedRows; // This will contain information about the affected rows
  } catch (error) {
    throw error;
  }
}

async function getOutsideProfile(email) {
  try {
    const sql = 'SELECT profile_img as img,bio_description,name, phone,email FROM users WHERE email = ?';
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getProfile(email) {
  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getMyGigs(email) {
  try {
    const sql = `SELECT * FROM gigs INNER JOIN users ON gigs.email = users.email where gigs.email=? and gigs.is_approved=1 and gigs.is_deleted=0 and gigs.is_reviewed=1`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}

async function getHiredGigsClient(email) {
  try {
    const sql = `SELECT users.name as freelancer_name, users.email  as freelancer_email, gigs.title, gigs.category,gigs.description,gigs.email, gigs.gig_img, gigs.gig_video,gigs.hourly_rate,gigs.bsb,gigs.account,gigs.bkash,gigs.upay,gigs.rocket,gigs.nagad,gigs.certifications_achievements,gigs.previous_work,gigs.testimonials,gigs.is_approved,gigs.is_reviewed,gigs.is_deleted,gigs.rating,gigs.no_followers,gigs.no_customers, hired.client, hired.gig_id,hired.status,hired.hired_date,hired.offer_id,hired.amount FROM hired  inner join gigs on hired.gig_id=gigs.id inner join users on users.email=gigs.email where client=? ORDER BY hired_date DESC`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}

async function getHiredGigsFreelancer(email) {
  try {
    const sql = `SELECT users.name as client_name, gigs.title as gig_title, offers.id as offer_id, offers.is_accepted,  offers.gig_id, offers.client, offers.description, offers.hours,offers.material,offers.comments,offers.time FROM hired  INNER JOIN gigs ON hired.gig_id=gigs.id INNER JOIN users ON users.email=hired.client  INNER JOIN offers on offers.id=hired.offer_id where gigs.email=? and hired.status="ACCEPTED" order by hired_date DESC`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}

async function getNotReviewedOffers(email) {
  try {
    const sql = `SELECT * FROM offers INNER JOIN gigs ON gig_id=gigs.id where gigs.email=(?) and is_reviewed=0 ORDER BY time DESC`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}
async function getNotif(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT notifs.description,DATE_FORMAT(notifs.time, '%d %M %Y %H:%i') as formatted_time FROM notifs inner join gigs on notifs.gig_id=gigs.id where notifs.email=? ORDER BY time DESC`, [notif])
    return rows
  } catch (error) {
    throw error
  }
}

async function getProfileImg(email) {
  try {
    const sql = `SELECT profile_img FROM users WHERE email = ?`;
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0]; // This will contain information about the affected rows

  }
  catch (error) {
    throw error;

  }
}

async function getCountOfFollowedGigs(email) {

  try {
    const sql = `SELECT COUNT(*) AS count FROM follow WHERE follower = ? `;
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0]; // This will contain information about the affected rows
  }
  catch (error) {
    throw error;
  }
}

async function getCountOfCreatedGigs(email) {

  try {
    const sql = `SELECT COUNT(*) AS count FROM gigs WHERE email = ? and is_approved = 1 and is_deleted=0`;
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0]; // This will contain information about the affected rows
  }
  catch (error) {
    throw error;
  }
}
async function getCountOfCustomer(email) {

  try {
    const sql = `SELECT COALESCE(SUM(no_customers), 0) AS count FROM gigs WHERE email = ? and is_approved = 1 and is_deleted=0`;
    const [rows, fields] = await pool.execute(sql, [email]);
    return rows[0]; // This will contain information about the affected rows
  }
  catch (error) {
    throw error;
  }
}

async function getAllClientOffersByEmail(email) {
  console.log("email ",email)
  try {
    const sql = `SELECT offers.gig_id,offers.id,users.name as client_name,gigs.title as gig_name , offers.description, offers.hours,offers.client, offers.material,offers.comments,offers.time FROM  users INNER JOIN offers ON users.email=offers.client INNER JOIN gigs 
ON offers.gig_id=gigs.id   where gigs.email=? and offers.is_reviewed=0  ORDER BY offers.time DESC;`
    const [rows, fields] = await pool.execute(sql, [email])
    return rows
  } catch (error) {
    throw error
  }
}

async function getCompletedClientOffer(offerId) {
  console.log("offerId ",offerId)
  try {
    const sql = `select * from offers where id=? ` 
    const [rows, fields] = await pool.execute(sql, [offerId])
    return rows[0]
  } catch (error) {
    throw error
  }
}


module.exports = {
  updateProfile,
  getProfile,
  getMyGigs,
  getHiredGigsClient,
  getHiredGigsFreelancer,
  getNotReviewedOffers,
  getNotif,
  getProfileImg,
  getCountOfFollowedGigs,
  getCountOfCreatedGigs,
  getCountOfCustomer,
  getAllClientOffersByEmail,
  getOutsideProfile,
  getCompletedClientOffer
};
