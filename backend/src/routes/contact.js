const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { param, validationResult } = require('express-validator');
const { createContact, deactivateContact, getActiveContactsInOrganization, getRoles } = require('../components/contact');

module.exports = router;

/**
 * Get contacts in an organization.
 */
router.get(
  '/organization/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw();
    return getActiveContactsInOrganization(req, res);
  },
);

/**
 * Get CCOF contact roles.
 */
router.get('/roles', passport.authenticate('jwt', { session: false }), isValidBackendToken, (req, res) => {
  return getRoles(req, res);
});

/**
 * Soft delete (deactivate) a contact.
 */
router.delete('/:contactId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('contactId', 'URL param: [contactId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return deactivateContact(req, res);
});

module.exports = router;
