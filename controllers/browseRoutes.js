const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router = express.Router()

// Controller function to get a specific record by id
const gigModel = require('../models/gigModel')

router.post('/search', async (req, res) => {
    try {
        // console.log(req.body)
        const { search } = req.body
        const gigs = await gigModel.searchGig(search);
        // console.log(campaigns)
        res.render('browse-gigs', {
            user: req.session.user,
            gigs: gigs,
            // lastSearch: search
        })
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
}
)

module.exports = router