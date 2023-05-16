const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');

const isValidBackendToken = auth.isValidBackendToken();
const { getChangeRequest, createChangeRequest, createChangeRequestFacility, CHANGE_REQUEST_TYPES, deleteChangeRequest, getChangeRequestDocs, saveChangeRequestDocs } = require('../components/changeRequest');
const { param, validationResult, checkSchema } = require('express-validator');

module.exports = router;

const newFacilityChangeRequestSchema = {
  applicationId: {
    in: ['body'],
    exists: { errorMessage: '[applicationId] is required', }
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required', }
  },
};

const documentChangeRequestSchema = {
  ...newFacilityChangeRequestSchema,
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
  [checkSchema(newFacilityChangeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res, CHANGE_REQUEST_TYPES.NEW_FACILITY);
  });

/**
 * Create the change Request
 */
router.post('/newFacility/:changeActionId', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeActionId', 'URL param: [changeActionId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return createChangeRequestFacility(req, res);
  });


/**
 * Get Change Requests Documents
 */
router.get('/documents/:changeRequestId', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getChangeRequestDocs(req, res);
  });


/**
 * Create the change request TODO: Rename this to something better
 */
router.post('/documents', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [checkSchema(documentChangeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res, CHANGE_REQUEST_TYPES.PDF_CHANGE);
  });



/**
 * Save uploaded document
 */
router.post('/documentUpload', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  (req, res) => {
    //validationResult(req).throw();
    return saveChangeRequestDocs(req, res);
  });




/**
 * Delete a change request
 */

router.delete('/:changeRequestId', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return deleteChangeRequest(req, res);
  });


module.exports = router;
