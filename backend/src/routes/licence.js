const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const isValidBackendToken = auth.isValidBackendToken();
const { getLicences } = require('../components/licence');
const { oneOf, query, validationResult } = require('express-validator');
const validateFacility = require('../middlewares/validateFacility');

/**
 * Get Licence details for a facility or funding agreement
 *
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_LICENCE_INFORMATION, PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  validateFacility(),
  oneOf([query('facilityId').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('fundingAgreementId').notEmpty().isUUID(UUID_VALIDATOR_VERSION)], {
    message: 'URL query: [facilityId or fundingAgreementId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    getLicences(req, res);
  },
);

module.exports = router;
