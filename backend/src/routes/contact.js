const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const { createContact, deactivateContact, getActiveContactsInOrganization, updateContact } = require('../components/contact');
const validatePermission = require('../middlewares/validatePermission');
const validateUpdateContact = require('../middlewares/validateUpdateContact');
const isValidBackendToken = auth.isValidBackendToken();
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { body, param, validationResult } = require('express-validator');

module.exports = router;

/**
 * Get contacts in an organization.
 */
router.get(
  '/organization/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_USERS),
  [param('organizationId', 'URL param: [organizationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getActiveContactsInOrganization(req, res);
  },
);

/**
 * Soft delete (deactivate) a contact.
 */
router.delete(
  '/:contactId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.DELETE_USERS),
  [param('contactId', 'URL param: [contactId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return deactivateContact(req, res);
  },
);

const contactValidators = [
  body('firstName').optional().trim(),
  body('lastName').trim(),
  body('email').trim().isEmail(),
  body('bceid').optional().trim(),
  body('facilities').isArray(),
  body('telephone').trim(),
  body('portalRole').optional().trim(),
];

/**
 * Add a contact.
 */
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.ADD_USERS), contactValidators, (req, res) => {
  validationResult(req).throw();
  return createContact(req, res);
});

/**
 * Update an existing Contact using contactId
 */
router.patch(
  '/:contactId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.UPDATE_SELF, PERMISSIONS.EDIT_USERS),
  validateUpdateContact(),
  [param('contactId', 'URL param: [contactId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateContact(req, res);
  },
);

module.exports = router;
