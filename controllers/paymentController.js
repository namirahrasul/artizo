const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');
const gigModel = require('../models/gigModel.js')

router.use(express.json())
router.use(bodyParser.urlencoded({ extended: false }));

const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // Load environment variables from a .env file

// Generate a unique ID
const tran_id = uuidv4();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false //true for live, false for sandbox

router.use(express.urlencoded({ extended: true }));



router.post('/submit-payment', async (req, res) => {
    console.log(req.body)

    const offerAmt = req.body.offerAmt;
    const offerId = req.body.offerId;

    const { gig_id, client } = await gigModel.getGigIdByOfferId(offerId);
    console.log(gig_id, client);

    const data = {
        total_amount: offerAmt,
        currency: 'BDT',
        tran_id: tran_id, // use a unique tran_id for each API call
        success_url: `http://localhost:3011/ssl-payment/success/${tran_id}/${offerId}/${offerAmt}/${client}/${gig_id}`,
        fail_url: `http://localhost:3011/ssl-payment/failure`,
        cancel_url: 'http://localhost:3011/cancel',
        ipn_url: 'http://localhost:3011/payment-success',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Freelancing',
        product_profile: 'general',
        cus_name: req.session.user.name,
        cus_email: req.session.user.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    console.log(data);

    const PaymentData = { 
        offerId: offerId,
        offerAmt: offerAmt,
        client: client
    };

    req.session.PaymentData = PaymentData;

    console.log(PaymentData);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        console.log(GatewayPageURL);
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
});


module.exports = router