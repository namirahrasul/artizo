const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const authController = require('./authController')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')




router.post('/declineGig/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {

  const affectedRows = await adminModel.declineGig(id);
  console.log(affectedRows);

  res.redirect('/unapproved-gigs');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approveGig/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {
  // Get the campaign title and creator email using the campaign ID
  
  const affectedRows = await adminModel.approveGig(id);
  console.log(affectedRows);

   res.redirect('/unapproved-gigs');
 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/review-report/:rid', async (req, res) => {
  console.log('reviewing report')
  console.log(req.params)
 const id = req.params.rid
 console.log(id)
 try {
  const email = req.session.user.email;
   const affectedRows = await adminModel.markGigsReviewed(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
   res.redirect('/reported-gigs');


 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/decline-delete/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineDelete(id);
  console.log(affectedRows);

  res.redirect('/delete-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approve-delete/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveDelete(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/delete-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/decline-edit/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineEdit(id);
  console.log(affectedRows);

  res.redirect('/edit-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approve-edit/:gigId', async (req, res) => {
 const id = req.params.gigId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveEdit(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/edit-requests');


 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

module.exports = router