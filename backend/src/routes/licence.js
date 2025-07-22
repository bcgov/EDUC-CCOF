const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getLicenceDetails } = require('../components/licence');
const { param, validationResult } = require('express-validator');

/**
 * Get licence details by licenceId.
 */
router.get('/:licenceId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('licenceId', 'URL param: [licenceId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return getLicenceDetails(req, res);
});

module.exports = router;
