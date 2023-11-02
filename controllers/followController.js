const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const followModel = require('../models/followModel')

async function getNotifications (req, res){
    const notif = req.session.user.email;
    console.log(notif);
    try {
      // Get notification details by email using your model function
      const notification = await followModel.getNotifById(notif);
      console.log(notification);
              if (notification === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('notification', { user: req.session.user, notification: null });
        } else {
            res.render('notification', { user: req.session.user, notification });
        }
    } catch (error) {
      console.error('Error fetching notification data:', error);
      res.status(500).send('Internal Server Error');
    }
}
  
async function getMyGigsProfile(req, res) {
    const myCamp = req.session.user.email;
    console.log(myCamp);
    try {
      // Get notification details by email using your model function
      const gigs = await followModel.getMyGigs(myCamp);
      console.log(gigs);
      if (gigs === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('MyGigs', { user: req.session.user, gigs:null});
        } else {
            res.render('MyGigs', { user: req.session.user, gigs:gigs });
        }
     
    } catch (error) {
      console.error('Error fetching gig data:', error);
      res.status(500).send('Internal Server Error');
    }
}
  
async function getFollowedGigsProfile(req, res){
  const myFollow = req.session.user.email;
  console.log(myFollow);
  try {
    // Get follow details by email using your model function
    const gigs = await followModel.getMyFollow(myFollow);
    console.log(gigs);
          if (gigs === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('FollowedGigs', { user: req.session.user, gigs: null});
        } else {
            res.render('FollowedGigs', { user: req.session.user, gigs: gigs });
        }
    
  } catch (error) {
    console.error('Error fetching followed gig data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getHiredGigsProfile(req, res) {
  res.render('HiredGigs', { user: req.session.user });
}

async function getProfile(req, res) {
  res.render('profile', { user: req.session.user });
}
async function editProfile(req, res) {
  res.render('edit-profile', { user: req.session.user });
}

module.exports = {
  getNotifications,
  getMyGigsProfile,
  getFollowedGigsProfile,
  getHiredGigsProfile,
  getProfile,
  editProfile,
  }