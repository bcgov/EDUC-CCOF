const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getChangeRequest, createChangeRequest, CHANGE_REQUEST_TYPES } = require('../components/changeRequest');
const { param, validationResult, checkSchema } = require('express-validator');

module.exports = router;

const changeRequestSchema = {
  applicationId: {
    in: ['body'],
    exists: { errorMessage: '[applicationId] is required', }
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required', }
  },
  providerType: {
    in: ['body'],
    exists: { errorMessage: '[providerType] is required', }
  }
};

/**
 * Get Change Requests
 */
router.get('/:changeRequestId', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getChangeRequest(req, res);
  });

/**
 * Create the change Request
 */
router.post('/newFacility', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [checkSchema(changeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res, CHANGE_REQUEST_TYPES.NEW_FACILITY);
  });

/**
 * Create the change request upload document
 */
router.post('/documents', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [checkSchema(changeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res, CHANGE_REQUEST_TYPES.PDF_CHANGE);
  });
module.exports = router;
