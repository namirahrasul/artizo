const express = require('express')

const sessionStore = require('../models/sessionStore')
// Import the sessionStore setup


// Controller function to get a specific record by id
const gigModel = require('../models/gigModel')
const followModel = require('../models/followModel')

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
        const gig = await gigModel.getApprovedGigById(gigId);
        console.log(gig)
        
        const followState = await followModel.checkIfFollowing(req.session.user.email, gigId);
        console.log(gig);
        // Render the campaign prelaunch page with campaign data
        res.render('view-gig', { user: req.session.user, gig: gig,followState })
    } catch (error) {
        console.error('Error fetching gig data:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function previewSingleGig(req, res) {
    const { gigId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const gig= await gigModel.getEditedGigById(gigId);
        console.log(gig);
        // Render the campaign prelaunch page with campaign data
        res.render('preview-gig', { user: req.session.user, gig})
    } catch (error) {
        console.error('Error fetching prelaunch campaign data:', error);
        res.status(500).send('Internal Server Error');
    }
}


async function getClientOfferForm(req, res) {
    const { gigId } = req.params;
    try {
        console.log(gigId);
        res.render('client-offer', { user: req.session.user, gigId: gigId })
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
    getClientOfferForm,
    acceptOffer,
    declineOffer,
    previewSingleGig
}

