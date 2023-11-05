const express = require('express')
const router = express.Router()
const profileModel = require('../models/profileModel.js')
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
 '/submit',
 [
  upload.fields([
   { name: 'file1', maxCount: 1 },
   { name: 'file2', maxCount: 1 },
   { name: 'file3', maxCount: 1 },
  ]),
 ],
 async (req, res) => {
  // res.send("Hello World");
  console.log(req.body)
  console.log(req.files)
  try {
   const {
    new_email,
    name,
    occupation,
    years_of_experience,
    bio_description,
    work_description,
    institute_name,
    institute_country,
    graduation_year,
    study_field,
    fb_url,
    twitter_url,
    yt_url,
    website_url,
   } = req.body
   console.log(req.body)

   const email = req.session.user.email
   var profile_img;
   var resume;
   var institute_certificate;
   if (req.files.file1 === undefined) {
    profile_img = null
   }
   else {
    profile_img = req.files.file1[0].filename
   }

   if (req.files.file2 === undefined) {
    resume = null
   }
   else {
    resume = req.files.file2[0].filename
   }

   if (req.files.file3 === undefined) {
    institute_certificate = null
   }
   else {
    institute_certificate = req.files.file3[0].filename
   }

   console.log('profile_img', profile_img)
   console.log('resume', resume)
   console.log('institute_certificate', institute_certificate)

   const updateProfileResult = await profileModel.updateProfile(
    req,
    email,
    new_email,
    name,
    profile_img,
    occupation,
    years_of_experience,
    resume,
    bio_description,
    work_description,
    institute_name,
    institute_country,
    graduation_year,
    study_field,
    institute_certificate,
    fb_url,
    twitter_url,
    yt_url,
    website_url)
   
   if (updateProfileResult) {
    console.log('updateProfileResult', updateProfileResult)
    res.redirect('/profile')
   }
  } catch (error) {
   console.log(error)
   res.status(500).render('error-page', { error }) // Render error view on failure
  }
 }
)

module.exports = router
