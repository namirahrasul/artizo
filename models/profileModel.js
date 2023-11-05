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

async function updateProfile(req, email, new_email, name, profile_img, occupation, years_of_experience, resume, bio_description, work_description, institute_name, institute_country, graduation_year, study_field, institute_certificate, fb_url, twitter_url, yt_url, website_url) {
 let sql = 'UPDATE users SET ';
 let values = [];

 if (new_email) {
  sql += 'email = ?, ';
  values.push(new_email);
 }
 if (name) {
  sql += 'name = ?, ';
  values.push(name);
 }
 if (profile_img) {
  sql += 'profile_img = ?, ';
  values.push(profile_img);
 }
 if (occupation) {
  sql += 'occupation = ?, ';
  values.push(occupation);
 }
 if (years_of_experience) {
  sql += 'years_of_experience = ?, ';
  values.push(years_of_experience);
 }
 if (resume) {
  sql += 'resume = ?, ';
  values.push(resume);
 }
 if (bio_description) {
  sql += 'bio_description = ?, ';
  values.push(bio_description);
 }
 if (work_description) {
  sql += 'work_description = ?, ';
  values.push(work_description);
 }
 if (institute_name) {
  sql += 'institute_name = ?, ';
  values.push(institute_name);
 }
 if (institute_country) {
  sql += 'institute_country = ?, ';
  values.push(institute_country);
 }
 if (graduation_year) {
  sql += 'graduation_year = ?, ';
  values.push(graduation_year);
 }
 if (study_field) {
  sql += 'study_field = ?, ';
  values.push(study_field);
 }
 if (institute_certificate) {
  sql += 'institute_certificate = ?, ';
  values.push(institute_certificate);
 }
 if (fb_url) {
  sql += 'fb_url = ?, ';
  values.push(fb_url);
 }
 if (twitter_url) {
  sql += 'twitter_url = ?, ';
  values.push(twitter_url);
 }
 if (yt_url) {
  sql += 'yt_url = ?, ';
  values.push(yt_url);
 }
 if (website_url) {
  sql += 'website_url = ?, ';
  values.push(website_url);
 }

 // Remove the trailing comma and space if there were any updates
 if (values.length > 0) {
  sql = sql.slice(0, -2); // Remove last two characters
 }

 sql += ' WHERE email = ?';
 values.push(email);

 try {
  const [rows, fields] = await pool.execute(sql, values);
  return rows.affectedRows; // This will contain information about the affected rows
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
module.exports = {
 updateProfile,
 getProfile,
};
