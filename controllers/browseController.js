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
    res.render('browse-gigs', {
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
    res.render('browse-gigs', {
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
    console.log("type", type);

    var category = req.query.category;

    var minFollowers = parseInt(req.query.followers);
    var minHourlyRate = parseInt(req.query.hourlyrate);
    var minCustomers = parseInt(req.query.customers);
    var minRating = parseFloat(req.query.rating);

    var maxFollowers;
    var maxHourlyRate;
    var maxCustomers;
    var maxRating;

    const maxFollowersResult = await gigModel.getMaxFollowers();
    const maxHourlyRateResult = await gigModel.getMaxHourlyRate();
    const maxCustomersResult = await gigModel.getMaxCustomers();
    
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

    if (minHourlyRate === 0) {
      maxHourlyRate = 499;
    } else if (minHourlyRate === 500) {
      maxHourlyRate = 1000; 
    } else if (minHourlyRate === 1001) {
      maxHourlyRate = maxHourlyRateResult[0][0]['MAX(hourly_rate)']
    } else {
      minHourlyRate = 0; 
      maxHourlyRate = maxHourlyRateResult[0][0]['MAX(hourly_rate)']
    }

    if (minCustomers === 0) {
      maxCustomers = 49;
    } else if (minCustomers === 50) {
      maxCustomers = 100; 
    } else if (minCustomers === 101) {
      maxCustomers = maxCustomersResult[0][0]['MAX(no_customers)']
    } else {
      minCustomers = 0; 
      maxCustomers = maxCustomersResult[0][0]['MAX(no_customers)'] 
    }

    if (minRating === 0) {
      maxRating = 4.09;
    } else if (minRating === 4.1) {
      maxRating = 4.5; 
    } else if (minRating === 4.51) {
      maxRating = 5;
    } else {
      minRating = 0; 
      maxRating = 5;
    }

    console.log("category:", category, "minFollowers:", minFollowers, "maxFollowers:", maxFollowers, "minHourlyRate:", minHourlyRate, "maxHourlyRate:", maxHourlyRate, "minCustomers:", minCustomers, "maxCustomers:", maxCustomers, "minRating:", minRating, "maxRating:", maxRating);
    
    const gigs = await gigModel.filterGigCategory(category, minFollowers, maxFollowers, minHourlyRate, maxHourlyRate, minCustomers, maxCustomers, minRating, maxRating);
    console.log("gigs", gigs)
    res.render('browse-gigs', {
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
async function getAboutPage(req, res) {

  try {

    res.render('about', { user: req.session.user });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getServicesPage(req, res) {

  try {

    res.render('services', { user: req.session.user });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {
  sortByHighestRating,
  sortByMostCustomers,
  sortByMostFollowers,
  sortByLowestHourlyRate,
  filterByCategory,
  getAboutPage,
  getServicesPage
}