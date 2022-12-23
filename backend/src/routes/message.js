const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getMessage, getAllMessages, updateMessageLastOpenedTime } = require('../components/message');
const { param, validationResult, checkSchema} = require('express-validator');

module.exports = router;

/**
 * Get ALL messages of an organization
 */
router.get('/:organizationId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getAllMessages(req, res);
  });

/**
 * Get a message of an organization
 */
router.get('/:messageId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('messageId', 'URL param: [messageId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getMessage(req, res);
  });

/**
 * Update Last Opened Time of an existing Message
 */
router.put('/:messageId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('messageId', 'URL param: [messageId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return updateMessageLastOpenedTime(req, res);
});

module.exports = router;
