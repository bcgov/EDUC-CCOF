const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getLicences, updateServiceDeliveryHours } = require('../components/licence');
const { query, validationResult } = require('express-validator');

/**
 * Get Licence details for a facility
 *
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, query('facilityId', 'Query param: [facilityId] is required').notEmpty().isUUID(), (req, res) => {
  validationResult(req).throw();
  return getLicences(req, res);
});
/**
 * Update the hours in service delivery details
 *
 */
router.patch('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  validationResult(req).throw();
  return updateServiceDeliveryHours(req, res);
});

module.exports = router;
