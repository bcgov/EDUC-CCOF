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
 * Get Licence details based on query params
 *
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_LICENCE_INFORMATION, PERMISSIONS.VIEW_FUNDING_AGREEMENT, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF),
  validateFacility(),
  oneOf(
    [
      query('facilityId').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
      query('fundingAgreementId').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
      query('organizationId').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    ],
    {
      message: 'URL query: [facilityId or fundingAgreementId or organizationId] is required',
    },
  ),
  (req, res) => {
    validationResult(req).throw();
    getLicences(req, res);
  },
);

module.exports = router;
