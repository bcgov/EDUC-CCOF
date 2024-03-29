const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');

const isValidBackendToken = auth.isValidBackendToken();
const { getChangeRequest, updateChangeRequest, createChangeRequest, createChangeRequestFacility, deleteChangeRequest, getChangeRequestDocs, saveChangeRequestDocs, createChangeAction, deleteChangeAction } = require('../components/changeRequest');
const { updateChangeRequestMTFI, deleteChangeRequestMTFI, getChangeRequestMTFIByCcfriId } = require('../components/changeRequest');
const { param, validationResult, checkSchema } = require('express-validator');
const { CHANGE_REQUEST_TYPES } = require('../util/constants');

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
router.get('/:changeRequestId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getChangeRequest(req, res);
  });


/**
 * Update Change Request
 */

router.patch('/:changeRequestId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return updateChangeRequest(req, res);
  });


/**
 * Create the change Request new facility
 */
router.post('/newFacility', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [checkSchema(newFacilityChangeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res);
  });

/**
 * Create the change Request
 */
router.post('/newFacility/:changeActionId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeActionId', 'URL param: [changeActionId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return createChangeRequestFacility(req, res);
  });


/**
 * Get Change Requests Documents
 */
router.get('/documents/:changeRequestId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getChangeRequestDocs(req, res);
  });


/**
 * Create the change request TODO: Rename this to something better
 */
router.post('/documents', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [checkSchema(documentChangeRequestSchema)], (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res);
  });



/**
 * Save uploaded document
 */
router.post('/documentUpload', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  (req, res) => {
    //validationResult(req).throw();
    return saveChangeRequestDocs(req, res);
  });


router.post('/:changeRequestId/documents', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return createChangeAction(req, res, CHANGE_REQUEST_TYPES.PDF_CHANGE);
  });

/**
 * Delete a change action
 */
router.delete('/changeAction/:changeActionId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeActionId', 'URL param: [changeActionId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return deleteChangeAction(req, res);
  });

/**
 * Delete a change request
 */
router.delete('/:changeRequestId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('changeRequestId', 'URL param: [changeRequestId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return deleteChangeRequest(req, res);
  });

/**
 * Get Change Requests MTFI using CCFRI Application Id
 */
router.get('/mtfi/:ccfriId/', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    return getChangeRequestMTFIByCcfriId(req, res);
  });

/**
 * Delete Change Requests MTFI
 */
router.delete('/mtfi/:mtfiId/', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('mtfiId', 'URL param: [mtfiId] is required').not().isEmpty()],  (req, res) => {
    return deleteChangeRequestMTFI(req, res);
  });


/**
 * Update Change Request MTFI
 */

router.patch('/mtfi/:mtfiId/', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('mtfiId', 'URL param: [mtfiId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return updateChangeRequestMTFI(req, res);
  });


module.exports = router;
