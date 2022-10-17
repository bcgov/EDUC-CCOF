const express = require('express');
const router = express.Router();
const { getFacilities } = require('../components/public');
const { getFacility } = require('../components/public');

// Route for endpoint: get facilities which match user search critiera via query param (i.e. facility/city).
router.get('/facilities', (req, res) => {
    return getFacilities(req, res);
});

// Route for endpoint: get a facility by facilityId (url parameter).
router.get('/facility/:facilityId', (req, res) => {
    return getFacility(req, res);
});

module.exports = router;
