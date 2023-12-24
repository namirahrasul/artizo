const express = require('express')
const router = express.Router()
const profileModel = require('../models/profileModel.js')
const adminModel = require('../models/adminModel.js')
const gigModel = require('../models/gigModel.js')
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
 '/edit',
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
   var {
    phone,
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
   const currentProfile=profileModel.getProfile(email)
   if (req.files.file1 === undefined) {
    profile_img = currentProfile.profile_img || null;
   }
   else {
    profile_img = req.files.file1[0].filename
   }

   if (req.files.file2 === undefined) {
    resume = currentProfile.resume || null;
   }
   else {
    resume = req.files.file2[0].filename
   }

   if (req.files.file3 === undefined) {
    institute_certificate = currentProfile.institute_certificate || null;
   }
   else {
    institute_certificate = req.files.file3[0].filename
   }

   if (phone.length === 0) {
    phone = currentProfile.phone || null;
   }
   if (occupation.length === 0) {
    occupation = currentProfile.occupation || null;
   }
   if (years_of_experience.length === 0) {
    years_of_experience = currentProfile.years_of_experience || null;
   }
   if (bio_description.length === 0) {
    bio_description = currentProfile.bio_description || null;
   }
   if (work_description.length === 0) {
    work_description = currentProfile.work_description || null;
   }
   if (institute_name.length === 0) {
    institute_name = currentProfile.institute_name || null;
   }
   if (institute_country.length === 0) {
    institute_country = currentProfile.institute_country || null;
   }
   if (graduation_year.length === 0) {
    graduation_year = currentProfile.graduation_year || null;
   }
   if (study_field.length === 0) {
    study_field = currentProfile.study_field || null;
   }
   if (fb_url.length === 0) {
    fb_url = currentProfile.fb_url || null;
   }
   if (twitter_url.length === 0) {
    twitter_url = currentProfile.twitter_url || null;
   }
   if (yt_url.length === 0) {
    yt_url = currentProfile.yt_url || null;
   }
   if (website_url.length === 0) {
    website_url = currentProfile.website_url || null;
   }


   console.log('profile_img', profile_img)
   console.log('resume', resume)
   console.log('institute_certificate', institute_certificate)

   const updateProfileResult = await profileModel.updateProfile(
    req,
    email,
    phone,
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



router.post('/delete/:gigId', async (req, res) => {
 const gigId = req.params.gigId
 const { reason } = req.body
 const email = req.session.user.email
 const deleteResult = await adminModel.requestDelete(gigId, email, reason);
 if (deleteResult) {
  console.log('deleteResult', deleteResult)
  res.redirect('/notification')
 }

}

)

module.exports = router
