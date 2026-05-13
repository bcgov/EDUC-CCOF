const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getAllMessages, updateMessageLastOpenedTime } = require('../components/message');
const { param, validationResult } = require('express-validator');
const validateRole = require('../middlewares/validateRole');
const { UUID_VALIDATOR_VERSION } = require('../util/constants');

/**
 * Get ALL messages of an organization
 */
router.get(
  '/organization/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validateRole(),
  [param('organizationId', 'URL param: [organizationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getAllMessages(req, res);
  },
);

/**
 * Update Last Opened Time of an existing Message
 */
router.put(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validateRole(),
  [param('messageId', 'URL param: [messageId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateMessageLastOpenedTime(req, res);
  },
);

module.exports = router;
