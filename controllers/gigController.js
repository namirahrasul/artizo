const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup


// Controller function to get a specific record by id
const gigModel = require('../models/gigModel')
async function getBrowseGigs(req, res) {
    try {
        const gigs = await gigModel.getGigs()
        res.render('browse-gigs', { user: req.session.user, gigs: gigs })
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
}


async function getSingleGig(req, res) {
    const { gigId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const gig = await gigModel.getGigById(gigId);
        console.log(gig);
        // Render the campaign prelaunch page with campaign data
        res.render('view-gig', { user: req.session.user, gig: gig })
    } catch (error) {
        console.error('Error fetching gig data:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function acceptOffer(id) {
    try {
        
    } catch (error) {
        console.error('Error accepting offer:', error);
    }
}

async function declineOffer(id) {
    try {
        
    } catch (error) {
        console.error('Error declining offer:', error);
    }
}

module.exports = {

    getBrowseGigs,
    getSingleGig,
}

