const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getActiveContactsInOrganization } = require('../components/contact');
const { param, validationResult } = require('express-validator');

module.exports = router;

/**
 * Get contacts in an organization
 */
router.get(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw();
    return getActiveContactsInOrganization(req, res);
  },
);

module.exports = router;
