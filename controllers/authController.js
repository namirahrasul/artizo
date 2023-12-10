const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const userModel = require('../models/userModel') // Import userModel functions
const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const { v4: uuidv4 } = require('uuid')
const multer = require('multer')
const fs = require('fs')
// const upload = multer({ dest: 'uploads/' }); // Specify the destination directory for uploaded files
const path = require('path')

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const originalname = file.originalname
      const filenameWithoutExtension = originalname.replace(/\.[^/.]+$/, '') // Remove file extension
      const fileExtension = originalname.split('.').pop() // Get file extension
      const uniqueFilename = `${filenameWithoutExtension}-${uniqueSuffix}.${fileExtension}`
      cb(null, uniqueFilename)
    },
  }),
})

const transporter = nodemailer.createTransport({
  service: 'Gmail', // e.g., 'Gmail'
  auth: {
    user: 'teamiutx@gmail.com', // Your email address
    pass: 'jdmwmburpkocimhh', // Your password
  },
})



// Function to send a verification email
async function sendVerificationEmail(email, name, verificationToken) {
  try {
    const verificationLink = `http://localhost:3011/verify?token=${verificationToken}`
    const mailOptions = {
      from: 'teamiutx@gmail.com', // Change to your verified sender email
      to: email,
      subject: 'Email Verification',
      html: `<p>Hello ${name}, Thank you for registering!</p>
             <p>Click the following link to verify your email:</p>
             <p><a href="${verificationLink}">${verificationLink}</a>.
             It will expire after 24 hours.</p><br><p>Regards,</p><p>Team Artizo</p>`,

    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

// Function to send a change password mail
async function sendPasswordVerification(email, verificationToken) {
  try {
    const verificationLink = `http://localhost:3011/changepassword?token=${verificationToken}`
    const mailOptions = {
      from: 'teamiutx@gmail.com', // Change to your verified sender email
      to: email,
      subject: 'Change password',
      html: `<p>Hello , we have received a request to change password</p>
             <p>Click the following link to changed your password:</p>
             <p><a href="${verificationLink}">${verificationLink}</a>.
             It will expire after 24 hours.</p><p>Regards,</p><p>Team Artizo</p>`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}


// POST request to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  console.log('post route:', req.body)
  try {
    const user = await userModel.authenticateUser(email, password) // Use userModel function
    console.log('result of authenticatuser:', user)
    if (user) {
      // Handle successful login, e.g., create a session
      // res.redirect('/dashboard')
      req.session.user = user
      res.redirect('/') // Redirect to dashboard after successful login
    } else {
      // Handle invalid credentials
      res.render('login', { error: 'Invalid credentials', success: '' }) // Show error message on login page
    }
  } catch (error) {
    res.status(500).render('error-page', { error }) // Render error view on failure
  }
})
//route for logout
router.post('/logout', (req, res) => {
  // Clear the user session
  req.session.user = null
  res.redirect('/')
})

router.post('/send-token', async (req, res) => {
  const { email } = req.body
  // console.log(req.body)
  try {
    // Generate a unique verification token
    const verificationToken = uuidv4()
    console.log(verificationToken)
    await userModel.storeVerificationToken(email, verificationToken)

    // Send an email with the verification link (using nodemailer)
    await sendPasswordVerification(email, verificationToken)

    res.redirect('/verification')
  } catch (error) {
    res.status(500).render('error-page', { error: 'Email could not be sent' })
  }
})
router.post('/forgot-password', async (req, res) => {
  const { email, password } = req.body
  // console.log(req.body)
  try {
    // Send an email with the verification link (using nodemailer)
    const user = await userModel.changePassword(email, password)
    if (user)
      // Redirect to a verification page or display a message
      res.render('login', {
        error: '',
        success: 'Password changed successfully',
      })
    else {
      res.render('forgot-password', {
        error: 'Password change failed',
        success: '',
      })
    }
  } catch (error) {
    res.status(500).render('error-page', { error })
  }
})


router.post(
  '/register-user',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },

    ]),
  ],
  async (req, res) => {

    // res.send("Hello World");
    console.log("req.body ", req.body)
    console.log("req.files", req.files)

    const { name, email, password } = req.body;



    // Access uploaded files
    var profile_img;
    if (req.files.file1[0].filename === undefined) {
      profile_img = null;
    }
    else {
      profile_img = req.files.file1[0].filename;
    }
    console.log("name", name)
    console.log("email", email)
    console.log("password", password)
    console.log("profile_img", profile_img)

    // Insert the data into the MySQL table
    const insertUserResult = await userModel.insertUser(
      req,
      name,
      email,
      password,
      profile_img,
      async (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        console.log('Data inserted successfully:', result)

        console.log("insert user result:", insertUserResult)
        const verificationToken = uuidv4()

        // Store the token in the database
        const storeVerificationTokenResult = await userModel.storeVerificationToken(email, verificationToken)
        console.log("storeVerificationToken result:", storeVerificationTokenResult)

        // Send an email with the verification link (using nodemailer)
        const sendVerificationEmailResult = await sendVerificationEmail(email, name, verificationToken)
        console.log("sendVerificationEmail result:", sendVerificationEmailResult)

        // Redirect to a verification page or display a message
        res.redirect('/verification')
      }
    )

  }
)

router.post(
  '/register-admin',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },

    ]),
  ],
  async (req, res) => {

    // res.send("Hello World");
    console.log("req.body ", req.body)
    console.log("req.files", req.files)

    const { name, email, password } = req.body;



    // Access uploaded files
    var profile_img;
    if (req.files.file1[0].filename === undefined) {
      profile_img = null;
    }
    else {
      profile_img = req.files.file1[0].filename;
    }
    console.log("name", name)
    console.log("email", email)
    console.log("password", password)
    console.log("profile_img", profile_img)

    // Insert the data into the MySQL table
    const insertUserResult = await userModel.insertAdmin(
      req,
      name,
      email,
      password,
      profile_img,
      async (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        console.log('Data inserted successfully:', result)

        console.log("insert user result:", insertUserResult)
        const verificationToken = uuidv4()

        // Store the token in the database
        const storeVerificationTokenResult = await userModel.storeVerificationToken(email, verificationToken)
        console.log("storeVerificationToken result:", storeVerificationTokenResult)

        // Send an email with the verification link (using nodemailer)
        const sendVerificationEmailResult = await sendVerificationEmail(email, name, verificationToken)
        console.log("sendVerificationEmail result:", sendVerificationEmailResult)

        // Redirect to a verification page or display a message
        res.redirect('/verification')
      }
    )

  }
)

async function sendBlockedUserEmail(email, reason) {
  try {

    const mailOptions = {
      from: process.env.GMAIL_USER, // Change to your verified sender email
      to: email,
      subject: 'User Blocked',
      html: `<p>Hello user,</p>
             <p>We have investigated your account and blockd it due to violation of website policies</p>
             <b>Reason of action: </b>
             <p>${reason}</p>
             <p>If you think this is a mistake, please reply to this email.</p>`,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Verification email sent:', info.response)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

router.post('/block-user/:userEmail', async (req, res) => {

  const email = req.params.userEmail;
  const reason = req.body.reason;
  try {
    await adminModel.blockUser(email, reason);
    await sendBlockedUserEmail(email, reason);
    res.redirect('/users');

  } catch (error) {
    console.error('Error deleting user:', error);
    res.render('error-page', { error })
  }
})

module.exports = router
