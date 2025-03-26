const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getClosures } = require('../components/closure');
const { query, validationResult } = require('express-validator');

module.exports = router;

/**
 * Get closures for an organization and fiscal year
 *
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [query('organizationId').notEmpty(), query('programYearId').notEmpty()], (req, res) => {
  validationResult(req).throw();
  return getClosures(req, res);
});

module.exports = router;
