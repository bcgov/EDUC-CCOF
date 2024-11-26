const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const { param, validationResult } = require('express-validator');
const isValidBackendToken = auth.isValidBackendToken();
const { createApplicationDocuments, getApplicationDocuments, deleteUploadedDocuments } = require('../components/document');

module.exports = router;

router.post('/application/', passport.authenticate('jwt', { session: false }), isValidBackendToken, createApplicationDocuments);

router.get(
  '/application/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return getApplicationDocuments(req, res);
  },
);

router.delete('/application/', passport.authenticate('jwt', { session: false }), isValidBackendToken, deleteUploadedDocuments);
