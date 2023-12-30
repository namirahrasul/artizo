const express = require('express')
const fs = require('fs')
const router = express.Router()

const authController = require('./authController') // Import the authentication controller
const gigRoutes = require('./gigRoutes')
const gigController = require('./gigController') // Import the file controller
const browseRoutes = require('./browseRoutes') 
const browseController = require('./browseController') 
const userModel = require('../models/userModel') // Import userModel functions
const followRoutes = require('./followRoutes')
const profileRoutes = require('./profileRoutes')
const profileController = require('./profileController')
const adminController = require('./adminController')
const adminRoutes = require('./adminRoutes')
const paymentController = require('./paymentController')
const paymentModel = require('../models/paymentModel')

const path = require('path')
router.use('/payment', paymentController);


// Home page route
router.get('/', (req, res) => {
  res.render('home', { user: req.session.user }) // Assuming you have a "home.ejs" view file
})
router.get('/home', (req, res) => {
  res.render('home', { user: req.session.user }) // Assuming you have a "home.ejs" view file
})
router.get('/register', (req, res) => {
  //const passwordStrengthMessage = '' // Retrieve the message from the query parameters
  res.render('register')
})
router.get('/login', (req, res) => {
  const error = req.session.error || ''
  const success = req.session.success || ''
  res.render('login', { error, success }) // Assuming you have a "home.ejs" view file
})
router.get('/create-gig', async (req, res) => {
  res.render('create-gig', { user: req.session.user })
})
router.get('/verification', async (req, res) => {
  res.render('verification')
})
router.get('/error', async (req, res) => {
  res.render('error-page')
})
router.get('/verify', async (req, res) => {
  const { token } = req.query
  const user = await userModel.verifyUser(token)

  if (user) {
    console.log('verify route user:', user)
    res.redirect('/login')
  } else {
    res.send('Invalid or expired token.')
  }
})
router.get('/changepassword', async (req, res) => {
  const { token } = req.query
  // const user = await userModel.changePassword(emailtoken)
  await userModel.deleteToken(token)

  const error = req.session.error || ''


  res.render('forgot-password', { error })
})
router.get('/forgot-password', async (req, res) => {
  const error = req.session.error || ''
  res.render('forgot-password', { error })
})

router.get('/send-token', async (req, res) => {
  const error = req.session.error || ''
  res.render('send-token', { error })
})



// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')))

router.get('/browse-gigs', gigController.getBrowseGigs
)
router.get('/browse-gigs/:gigId', gigController.getSingleGig)



// Include authentication routes from authController
router.use('/auth', authController)
router.use('/gig', gigRoutes)
router.use('/browse', browseRoutes)
router.use('/follow', followRoutes)
router.use('/profile', profileRoutes)
router.use('/admin', adminRoutes)





router.get('/sort/hourly-rate/lowest', browseController.sortByLowestHourlyRate)
router.get('/sort/followers', browseController.sortByMostFollowers)
router.get('/sort/customers', browseController.sortByMostCustomers)
router.get('/sort/rating/highest', browseController.sortByHighestRating)
router.get('/filter', browseController.filterByCategory)



// testing
router.get('/profile', profileController.getProfile);
router.get('/edit-profile', profileController.editProfile)
router.get('/notification', profileController.getNotifications)
router.get('/MyGigs', profileController.getMyGigsProfile)
router.get('/FollowedGigs', profileController.getFollowedGigsProfile)
router.get('/HiredGigs', profileController.getHiredGigsProfile)
router.get('/running-gigs', profileController.getRunningGigsProfile)
router.get('/client-offers', profileController.getAllGigOfferOfFreelancer)
router.get('/user/:email', profileController.getOutsideProfile)

router.get('/about', browseController.getAboutPage)
router.get('/services', browseController.getServicesPage)


router.get('/users', adminController.getUsers)
router.get('/unapproved-gigs', adminController.getNotApprovedGigsAdmin)
router.get('/register-admin', adminController.AddAdmin)



router.get('/report/:gigId', adminController.getReportForm)
router.get('/reported-gigs', adminController.getReportedGigs)
router.get('/view-report/:rid', adminController.viewGigReport)
router.get('/edit-gig-form/:gigId', profileController.getEditGigForm)
router.get('/delete-gig-form/:gigId', adminController.getDeleteForm)
router.get('/delete-requests', adminController.getAllDeleteRequests)
router.get('/edit-requests', adminController.getAllEditRequests)
router.get('/preview-gig/:gigId', gigController.previewSingleGig)
router.get('/unapproved-gig/:gigId', gigController.previewUnapprovedSingleGig)
router.get('/delete-request/:did', adminController.viewDeleteRequest)
router.get('/block-user/:email', adminController.getUserBlockForm)


router.get('/client-offer/view/:gigId', gigController.getClientOfferForm)

router.get('/accepted-client-offer/:gigId', profileController.viewClientOffer)

router.get('/client-offer', async (req, res) => {
  console.log("gigId", req.query.gigId);
  res.render('client-offer', { user: req.session.user, gigId: req.query.gigId });
})


router.post('/goToPayment', async (req, res) => {
  const offerAmt = req.body.offerAmt;
  const offerId = req.body.offerId;

  console.log(req.body);
  console.log(offerAmt)
  console.log(offerId)

  res.render('donation', { user: req.session.user, offerAmt: offerAmt, offerId: offerId });
})

router.get('/success', async (req, res) => {
  res.render('Success', { user: req.session.user });
})

router.get('/failure', async (req, res) => {
  res.render('Failure', { user: req.session.user });
})

router.post('/rating', async (req, res) => {
  console.log(req.body);

  const gig_id = req.body.gig_id;
  console.log(gig_id)
  res.render('RatingFreelancer', { user: req.session.user, gig_id: gig_id });
})

router.post('/feedback-submit', async (req, res) => {
  console.log(req.body);

  const gig_id = req.body.gig_id;
  console.log(gig_id);

  const score = req.body.score;
  console.log(score);

  const result = await paymentModel.updateRatingById(gig_id, score);
  console.log(result);


  res.redirect('/HiredGigs');
})



router.post("/ssl-payment/success/:tranId/:offerId/:offerAmt/:client/:gig_id", async (req, res) => {
  const tranId = req.params.tranId;
  console.log(tranId);

  const offerId = req.params.offerId;
  console.log(offerId);

  const offerAmt = req.params.offerAmt;
  console.log(offerAmt);

  const client = req.params.client;
  console.log(client);

  const gig_id = req.params.gig_id;
  console.log(gig_id);

  if (!client || !offerId) {
    console.error('Invalid donor or cid value');
    // Handle the error or return an error response
  }
  else {
    const result = await paymentModel.insertPaymentData(offerId, offerAmt, gig_id);
    const result2 = await paymentModel.updateNoOfCustomersById(gig_id);
    console.log("result");
    console.log(result)
    console.log("result2", result2);
    const result3 = await paymentModel.updateHiredStatus(offerId);
    console.log("result3", result3);
   
   
  }
  res.render('Success', { user: req.session.user, gig_id: gig_id });
});


module.exports = router
