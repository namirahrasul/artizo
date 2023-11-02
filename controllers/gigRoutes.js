const express = require('express')
const router = express.Router()
const createModel = require('../models/createModel.js')
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

router.post(
  '/submit-gig',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)

    const {
      title,
      category,
      description,
      gig_video,
      hourly_rate,
    } = req.body
    console.log(req.body)
    const bsb = null;
    const account = null;
    const bkash = null;
    const rocket = null;
    const nagad = null;
    const upay = null;
    const email = req.session.user.email
    // Access uploaded files
    const gig_img = req.files.file1[0].filename
    const certifications_achievements = req.files.file2[0].filename
    const testimonials = req.files.file3[0].filename
    const previous_work = req.files.file4[0].filename

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    fileModel.insertGig(
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
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        const gig_id = result.insertId
        fileModel.insertDoc(
          req,
          email,
          gig_id,
          certifications_achievements,
          testimonials,
          previous_work,
          (err, result) => {
            if (err) {
              console.error('Error inserting data:', err)
              return res.status(500).send('Error submitting the form.')


            }
            console.log('Data inserted successfully:', result)
            res.render('home', { user: req.session.user })
          }
        )
        // res.redirect('/')
      }
    )
  }
)


module.exports = router
