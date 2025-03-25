const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getClosures } = require('../components/closure');
const { query, validationResult } = require('express-validator');

const facilitySchema = {
  organizationId: { in: ['body'], exists: { errorMessage: '[organizationId] is required' } },
  applicationId: { in: ['body'], exists: { errorMessage: '[applicationId] is required' } },
};

module.exports = router;

/**
 * Get closures for an organization and fiscal year
 *
 */
router.get(
  '/closures',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [query('organizationId').notEmpty().isUUID(), query('programYearId').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return getClosures(req, res);
  },
);

module.exports = router;
