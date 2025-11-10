const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getAllMessages, updateMessageLastOpenedTime } = require('../components/message');
const { param, validationResult } = require('express-validator');

module.exports = router;

/**
 * Get ALL messages of an organization
 */
router.get(
  '/organization/:organizationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO #securitymatrix Add with User security
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()],
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
  // TODO #securitymatrix Add with User security
  [param('messageId', 'URL param: [messageId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw();
    return updateMessageLastOpenedTime(req, res);
  },
);

module.exports = router;
