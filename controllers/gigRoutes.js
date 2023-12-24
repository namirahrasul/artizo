const express = require('express')
const router = express.Router()
const createModel = require('../models/createModel.js')
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
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay
    } = req.body
    console.log(req.body)
    const email = req.session.user.email
    // Access uploaded files
    const gig_img = req.files.file1[0].filename
    const certifications_achievements = req.files.file2[0].filename
    const testimonials = req.files.file3[0].filename
    const previous_work = req.files.file4[0].filename

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
     createModel.insertGig(
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
       (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
         const gig_id = result.insertId
         
         createModel.insertCreateNotif(
          req,
          email,
           gig_id,
          title,
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

router.post(
  '/submit-edited-gig/:gigId',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    const {gigId} = req.params
    console.log(gigId)
    console.log(req.files)
  
    const {
      title,
      category,
      description,
      gig_video,
      hourly_rate,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay
    } = req.body
    console.log(req.body)
    const email = req.session.user.email
    const existingGig = await gigModel.getGigById(gigId)
    console.log("existing gig", existingGig);
    // const email = req.session.user.email;

    // Access uploaded files
    const gig_img = req.files.file1 ? req.files.file1[0].filename : existingGig.gig_img;
    const certifications_achievements = req.files.file2 ? req.files.file2[0].filename : existingGig.certifications_achievements;
    const testimonials = req.files.file3 ? req.files.file3[0].filename : existingGig.testimonials;
    const previous_work = req.files.file4 ? req.files.file4[0].filename : existingGig.previous_work;

    const insertFields = ['old_id', 'email',
      'title', 'category', 'description', 'gig_img',
      'gig_video', 'hourly_rate', 'bsb', 'account', 'bkash', 'rocket', 'nagad', 'upay',  'no_followers', 'no_customers', 'rating', 'is_deleted', 'certifications_achievements', 'testimonials', 'previous_work', 'is_reviewed', 'is_approved', 'is_declined'
    ];

    const insertValues = [
      gigId,
      email,
      title || existingGig.title || null,
      category || existingGig.category || null,
      description || existingGig.description || null,
      gig_img || null,
      gig_video || existingGig.gig_video || null,
      hourly_rate || existingGig.hourly_rate || null,
      bsb || existingGig.bsb || null,
      account || existingGig.account || null,
      bkash || existingGig.bkash || null,
      rocket || existingGig.rocket || null,
      nagad || existingGig.nagad || null,
      upay || existingGig.upay || null,
      existingGig.no_followers || 0,
      existingGig.no_customers || 0,
      existingGig.rating || 0,
      0,
      certifications_achievements || null,
      testimonials || null,
      previous_work || null,
      0,
      0,
      0,
    ];

    // Build the SQL query for inserting into edit_campaigns
    const insertSql = `INSERT INTO edit_gigs (${insertFields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Insert the data into the edit_campaigns table
    createModel.insertEditGig(req,insertSql, insertValues,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        createModel.insertEditNotif(
          req,
          email,
          gigId,
          title,
          (err, result) => {
            if (err) {
              console.error('Error inserting data:', err)
              return res.status(500).send('Error submitting the form.')


            }
            createModel.updateExistingGig(req, gigId,(err,result)=> {
              if (err) {
                console.error('Error inserting data:', err)
                return res.status(500).send('Error submitting the form.')


              }
              console.log('Data inserted successfully:', result)
              res.render('home', { user: req.session.user })
            })
           
          }
        )
        // res.redirect('/')
      }
    )
  }
)


router.post('/report/:gigId', [
  upload.fields([
    { name: 'file1', maxCount: 1 },
  ]),
], async (req, res) => {
  const gigId = req.params.gigId
  const { title, description } = req.body
  const email = req.session.user.email
  var evidence;

  if (req.files.file1 === undefined) {
    evidence = null
  }
  else {
    evidence = req.files.file1[0].filename
  }
  const reportResult = await gigModel.InsertReport(gigId, email, title, description, evidence)
  if (reportResult) {
    console.log('reportResult', reportResult)
    res.redirect('/notification')
  }
}

)

router.get('/accept-offer/:gigId', async (req, res) => {
})

router.get('/decline-offer/:gigId', async (req, res) => {
})



module.exports = router
