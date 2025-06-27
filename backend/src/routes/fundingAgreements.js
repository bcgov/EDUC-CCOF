const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getFundingAgreements } = require('../components/fundingAgreements');
const { query, validationResult } = require('express-validator');

/**
 * Get the list of Funding Agreements using OrgID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  query('organizationId').notEmpty().withMessage('organizationId is required').isUUID().withMessage('organizationId must be a valid UUID'),
  (req, res) => {
    validationResult(req).throw();
    return getFundingAgreements(req, res);
  },
);
module.exports = router;
