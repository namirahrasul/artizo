const profileModel = require('../models/profileModel');
const followModel = require('../models/followModel');

async function getProfile(req, res) {
 const user = await profileModel.getProfile(req.session.user.email)
 const profile = await profileModel.getProfileImg(req.session.user.email);
 res.render('profile', { user: user , profile: profile});
}
async function editProfile(req, res) {
 res.render('edit-profile', { user: req.session.user });
}

async function getMyGigsProfile(req, res) {
 const myCamp = req.session.user.email;
 const user = await profileModel.getProfile(req.session.user.email)
 const profile = await profileModel.getProfileImg(req.session.user.email);
 console.log(myCamp);
 try {
  // Get notification details by email using your model function
  const gigs = await profileModel.getMyGigs(myCamp);
  console.log(gigs);
  if (gigs === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('MyGigs', { user: user, gigs: null , profile: profile });
  } else {
   res.render('MyGigs', { user: user, gigs: gigs, profile: profile });
  }

 } catch (error) {
  console.error('Error fetching gig data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getHiredGigsProfile(req, res) {
 const client = req.session.user.email;
 const user = await profileModel.getProfile(req.session.user.email)
 const profile = await profileModel.getProfileImg(req.session.user.email);
 console.log(client);
 try {
  // Get notification details by email using your model function
  const offers = await profileModel.getHiredGigsClient(client);
  console.log(offers);
  if (offers === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('HiredGigs', { user: user, offers: null, profile: profile });
  } else {
   res.render('HiredGigs', { user: user, offers:offers, profile: profile });
  }

 } catch (error) {
  console.error('Error fetching gig data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getRunningGigsProfile(req, res) {
 const client = req.session.user.email;
 const user = await profileModel.getProfile(req.session.user.email)
 console.log(client);
 const profile = await profileModel.getProfileImg(req.session.user.email);
 try {
  // Get notification details by email using your model function
  const offers = await profileModel.getHiredGigsFreelancer(client);
  console.log(offers);
  if (offers === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('running-gigs', { user:user, offers: null, profile: profile});
  } else {
   res.render('running-gigs', { user: user, offers: offers, profile: profile });
  }

 } catch (error) {
  console.error('Error fetching gig data:', error);
  res.status(500).send('Internal Server Error');
 }
}




async function getNotifications(req, res) {
 const notif = req.session.user.email;
 const user = await profileModel.getProfile(req.session.user.email)
 const profile = await profileModel.getProfileImg(req.session.user.email);
 console.log(notif);
 try {
  // Get notification details by email using your model function
  const notification = await profileModel.getNotif(notif);
  console.log(notification);
  if (notification === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('notification', { user: user, notification: null , profile: profile });
  } else {
   res.render('notification', { user: user, notification , profile: profile });
  }
 } catch (error) {
  console.error('Error fetching notification data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getOutsideProfile(req, res) {
 const email = req.params.email;
 console.log(req.params)
 console.log(req.query)
 console.log(req.body)
 try {
  const profile = await profileModel.getProfile(email);
  const count_followed = await profileModel.getCountOfFollowedGigs(email);
  const count_created = await profileModel.getCountOfCreatedGigs(email);
  const count_backed = await profileModel.getCountOfHiredGigs(email);
  res.render('outside-profile', { user: req.session.user, profile: profile, followed: count_followed, created: count_created, backed: count_backed })
 }
 catch (error) {
  console.error('Error fetching user profile:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getEditGigForm(req, res) {
 const { gigId } = req.params;
 try {
  // Get campaign details by campaignId using your model function
  res.render('edit-gig', { user: req.session.user, gigId })
 } catch (error) {
  console.error('Error fetching prelaunch campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getFollowedGigsProfile(req, res) {
 const myFollow = req.session.user.email;
 console.log(myFollow);
 try {
  // Get follow details by email using your model function
  const gigs = await followModel.getMyFollow(myFollow);
  const user = await profileModel.getProfile(req.session.user.email)
  const profile = await profileModel.getProfileImg(req.session.user.email);
  console.log(gigs);
  if (gigs === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('FollowedGigs', { user: user, gigs: null, profile });
  } else {
   res.render('FollowedGigs', { user: user, gigs: gigs, profile });
  }

 } catch (error) {
  console.error('Error fetching followed gig data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getAllGigOfferOfFreelancer(req, res) {
 const freelancer = req.session.user.email;
 console.log(freelancer);
 try {
  // Get follow details by email using your model function
  const offers = await profileModel.getAllClientOffersByEmail(freelancer);
  const user = await profileModel.getProfile(req.session.user.email)
  const profile = await profileModel.getProfileImg(req.session.user.email);
  console.log(offers);
  if (offers === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('gig-offers', { user: user, offers: null, profile });
  } else {
   res.render('gig-offers', { user: user, offers: offers, profile });
  }

 } catch (error) {
  console.error('Error fetching followed gig data:', error);
  res.status(500).send('Internal Server Error');
 }
}



module.exports = {
 getProfile,
 editProfile,
 getMyGigsProfile,
 getHiredGigsProfile,
 getRunningGigsProfile,
 getNotifications,
 getOutsideProfile,
 getEditGigForm,
 getFollowedGigsProfile,
 getAllGigOfferOfFreelancer
}