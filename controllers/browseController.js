const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router = express.Router()

// Controller function to get a specific record by id
const gigModel = require('../models/gigModel')

async function sortByLowestHourlyRate(req, res) {
  try {

    const gigs = await gigModel.sortGigHourlyRate();
    console.log("hourly rate lowest gigs", gigs)
    res.render('browse-gigs', {
      user: req.session.user,
      gigs: gigs,
    })

  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByMostFollowers(req, res) {
  try {
    const gigs = await gigModel.sortGigFollowers();
    console.log("most follwers gigs", gigs)
    res.render('browse-gigs', {
      user: req.session.user,
      gigs: gigs,
    })

  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByMostCustomers(req, res) {
  try {
    const gigs = await gigModel.sortGigCustomers();
    console.log("most customers gigs", gigs)
    res.render('browse-campaigns', {
      user: req.session.user,
      gigs: gigs,
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByHighestRating(req, res) {
  try {
    const gigs = await gigModel.sortGigRating();
    console.log("highest rating gigs", gigs)
    res.render('browse-campaigns', {
      user: req.session.user,
      gigs: gigs,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function filterByCategory(req, res) {
  try {
    console.log("req.query", req.query)
    const inputData = req.query.inputData;
    console.log("inputData", inputData)
    const type = req.query.type;
    console.log("type", type)
    var is_business;
    var is_personal;
    var is_prelaunch;
    if (type === 'prelaunch') {
      is_business = false;
      is_personal = false;
      is_prelaunch = true;
    }
    else if (type === 'personal') {
      is_business = false;
      is_personal = true;
      is_prelaunch = false;
    }
    else if (type === 'business') {
      is_business = true;
      is_personal = false;
      is_prelaunch = false;
    }
    else {
      is_business = true;
      is_personal = true;
      is_prelaunch = true;
    }


    // Convert radio button values to variables
    var minFollowers = parseInt(req.query.followers);
    var minAmountRaised = parseInt(req.query.amount);
    var minBackers = parseInt(req.query.backers);
    var maxFollowers;
    var maxAmountRaised;
    var maxBackers;
    const maxFollowersResult = await gigModel.getMaxFollowers();
    const maxAmountRaisedResult = await gigModel.getMaxAmountRaised();
    const maxBackersResult = await gigModel.getMaxBackers();
    // console.log("maxFollowerResult ", maxFollowersResult, " maxAmountRaisedResult ",maxAmountRaisedResult," maxBackersResult ",maxBackersResult)
    // Handle "Below 500" and "Above 1000" options differently
    if (minFollowers === 0) {
      maxFollowers = 99;
    } else if (minFollowers === 100) {
      maxFollowers = 500;
    } else if (minFollowers === 501) {
      // Adjust minimum for "Above 1000"
      maxFollowers = maxFollowersResult[0][0]['MAX(no_followers)']// No maximum for "Above 1000"
    } else {
      minFollowers = 0; // Adjust minimum for "Below 500"
      maxFollowers = maxFollowersResult[0][0]['MAX(no_followers)']// No maximum for "Below 100"
    }

    if (minAmountRaised === 0) {
      maxAmountRaised = 4999;
    } else if (minAmountRaised === 5000) {
      maxAmountRaised = 10000; // No maximum for "Above 10000"
    } else if (minAmountRaised === 10001) {
      maxAmountRaised = maxAmountRaisedResult[0][0]['MAX(amount_raised)']// No maximum for "Above 10000"
    } else {
      minAmountRaised = 0; // Adjust minimum for "Below 5000"
      maxAmountRaised = maxAmountRaisedResult[0][0]['MAX(amount_raised)'] // No maximum for "Below 5000"
    }

    if (minBackers === 0) {
      maxBackers = 499;
    } else if (minBackers === 500) {
      maxBackers = 1000; // No maximum for "Above 1000"
    } else if (minBackers === 1001) {
      maxBackers = maxBackersResult[0][0]['MAX(no_donors)']// No maximum for "Above 1000"
    } else {
      minBackers = 0; // Adjust minimum for "Below 500"
      maxBackers = maxBackersResult[0][0]['MAX(no_donors)'] // No maximum for "Below 500"
    }
    console.log("minFollowers:", minFollowers, "maxFollowers:", maxFollowers, "minAmountRaised:", minAmountRaised, "maxAmountRaised:", maxAmountRaised, "minBackers:", minBackers, "maxBackers:", maxBackers);
    // var campaigns;
    // if (is_business && is_personal && is_prelaunch)
    //   campaigns = await gigModel.filterAllCategory(minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers)
    // else
    const campaigns = await gigModel.filterCampaignCategory(is_prelaunch, is_personal, is_business, minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers);
    console.log("campaigns", campaigns)
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = {
  sortByHighestRating,
  sortByMostCustomers,
  sortByMostFollowers,
  sortByLowestHourlyRate,
  filterByCategory,
}