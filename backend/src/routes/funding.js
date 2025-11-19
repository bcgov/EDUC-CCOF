const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { updateFunding, getFunding } = require('../components/funding');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
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
router.put(
  '/:fundId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF),
  [[param('fundId', 'URL param: [fundId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)], checkSchema(fundingSchema)],
  (req, res) => {
    validationResult(req).throw();
    return updateFunding(req, res);
  },
);

/**
 * Get funding.
 */
router.get(
  '/:fundId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF),
  [param('fundId', 'URL param: [fundId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFunding(req, res);
  },
);
