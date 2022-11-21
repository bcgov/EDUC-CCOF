const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { createFunding, getFunding } = require('../components/funding');
const { param, validationResult, checkSchema } = require('express-validator');

module.exports = router;

const organizationSchema = {
  legalName: {
    in: ['body'],
    exists: { errorMessage: '[legalName] is required', },
    isLength: { options: { max: 160 }, errorMessage: '[legalName] has a max length of 160' }
  },
};
/**
 * Create new funding
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(organizationSchema)], (req, res) => {
  validationResult(req).throw();
  return createFunding(req, res);
});

router.get('/:fundId', [param('fundId', 'URL param: [fundId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return getFunding(req, res);
});
