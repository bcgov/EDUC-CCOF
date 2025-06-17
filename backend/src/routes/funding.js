const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { updateFunding, getFunding } = require('../components/funding');
const { param, validationResult, checkSchema } = require('express-validator');

module.exports = router;

const fundingSchema = {
  maxDaysPerWeek: {
    in: ['body'],
    exists: { errorMessage: '[maxDaysPerWeek] is required' },
  },
};
/**
 * Create new funding
 */
router.put('/:fundId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(fundingSchema)], (req, res) => {
  validationResult(req).throw();
  return updateFunding(req, res);
});

router.get('/:fundId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('fundId', 'URL param: [fundId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return getFunding(req, res);
});
