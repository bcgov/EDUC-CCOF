const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const { getFacilities } = require('../components/public');
const { getFacility } = require('../components/public');
const { getSystemMessages } = require('../components/lookup');

router.get('/facilities', [query('criteria', 'query param: [criteria] is required').not().isEmpty(), query('criteria', 'must have minimum length 3').isLength({ min: 3 })], (req, res) => {
  validationResult(req).throw();
  return getFacilities(req, res);
});

// Route for endpoint: get a facility by facilityId (url parameter).
router.get('/facilities/:facilityId', (req, res) => {
  return getFacility(req, res);
});

router.get('/systemMessages', (req, res) => {
  return getSystemMessages(req, res);
});

module.exports = router;
