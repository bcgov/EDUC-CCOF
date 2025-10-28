const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS } = require('../util/constants');
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
  validatePermission(PERMISSIONS.VIEW_LICENCE_INFORMATION),
  validateFacility(),
  oneOf(
    [query('facilityId').exists().isUUID().withMessage('facilityId must be a valid UUID'), query('fundingAgreementId').exists().isUUID().withMessage('fundingAgreementId must be a valid UUID')],
    'URL query: [facilityId or fundingAgreementId] is required',
  ),
  (req, res) => {
    validationResult(req).throw();
    getLicences(req, res);
  },
);

module.exports = router;
