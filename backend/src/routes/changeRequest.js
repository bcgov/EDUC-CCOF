const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');

const isValidBackendToken = auth.isValidBackendToken();
const {
  getChangeRequest,
  updateChangeRequest,
  createChangeRequest,
  createChangeRequestFacility,
  createClosureChangeRequest,
  getChangeRequestDocs,
  getChangeActionClosure,
  getChangeActionClosures,
  createChangeAction,
  deleteChangeAction,
} = require('../components/changeRequest');
const { updateChangeRequestMTFI, deleteChangeRequestMTFI, getChangeRequestMTFIByCcfriId } = require('../components/changeRequest');
const { checkSchema, param, query, validationResult } = require('express-validator');
const validateFacility = require('../middlewares/validateFacility');
const validatePermission = require('../middlewares/validatePermission');
const { CHANGE_REQUEST_TYPES, PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { scanFilePayload } = require('../util/clamav');

module.exports = router;

const newFacilityChangeRequestSchema = {
  applicationId: {
    in: ['body'],
    exists: { errorMessage: '[applicationId] is required' },
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required' },
  },
};

const closureChangeRequestSchema = {
  applicationId: {
    in: ['body'],
    exists: { errorMessage: '[applicationId] is required' },
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required' },
  },
  changeType: {
    in: ['body'],
    isIn: {
      options: [[CHANGE_REQUEST_TYPES.NEW_CLOSURE, CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE, CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE]],
      errorMessage: '[changeType] must be NEW_CLOSURE, EDIT_EXISTING_CLOSURE, or REMOVE_A_CLOSURE',
    },
  },
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
  },
  organizationId: {
    in: ['body'],
    exists: { errorMessage: '[organizationId] is required' },
  },
  closureId: {
    in: ['body'],
    custom: {
      options: (value, { req }) => {
        if (req.body.changeType === CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE && !value) {
          throw new Error('[closureId] is required for closure removal requests');
        }
        return true;
      },
    },
  },
};

const documentChangeRequestSchema = {
  ...newFacilityChangeRequestSchema,
  providerType: {
    in: ['body'],
    exists: { errorMessage: '[providerType] is required' },
  },
};

/**
 * Get Change Action Closures using query
 */
router.get(
  '/changeActionClosure',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_CLOSURES),
  validateFacility(),
  query('facilityId', 'URL query: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  query('programYearId', 'URL query: [programYearId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return getChangeActionClosures(req, res);
  },
);

/**
 * Get Change Action Closure
 */
router.get(
  '/changeActionClosure/:changeActionClosureId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_CLOSURES),
  [param('changeActionClosureId', 'URL param: [changeActionClosureId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getChangeActionClosure(req, res);
  },
);

/**
 * Get Change Requests
 */
router.get(
  '/:changeRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO What other Change Request permissions?
  validatePermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES, PERMISSIONS.VIEW_A_CR, PERMISSIONS.MTFI),
  [param('changeRequestId', 'URL param: [changeRequestId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getChangeRequest(req, res);
  },
);

/**
 * Update Change Request
 */
router.patch(
  '/:changeRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO What other Change Request permissions?
  validatePermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES),
  [param('changeRequestId', 'URL param: [changeRequestId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateChangeRequest(req, res);
  },
);

/**
 * Create the change Request new facility
 */
router.post('/newFacility', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(newFacilityChangeRequestSchema)], (req, res) => {
  validationResult(req).throw();
  return createChangeRequest(req, res);
});

/**
 * Create the change Request
 */
router.post(
  '/newFacility/:changeActionId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('changeActionId', 'URL param: [changeActionId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return createChangeRequestFacility(req, res);
  },
);

/**
 * Create the closure change request
 */
router.post(
  '/closure',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.REQUEST_CLOSURE, PERMISSIONS.EDIT_CLOSURE, PERMISSIONS.REMOVE_CLOSURE),
  validateFacility(),
  [checkSchema(closureChangeRequestSchema)],
  scanFilePayload,
  (req, res) => {
    validationResult(req).throw();
    return createClosureChangeRequest(req, res);
  },
);

/**
 * Get Change Requests Documents
 */
router.get(
  '/documents/:changeRequestId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES, PERMISSIONS.VIEW_A_CR),
  [param('changeRequestId', 'URL param: [changeRequestId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getChangeRequestDocs(req, res);
  },
);

/**
 * Create the change request
 */
router.post(
  '/documents',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES, PERMISSIONS.MTFI),
  [checkSchema(documentChangeRequestSchema)],
  (req, res) => {
    validationResult(req).throw();
    return createChangeRequest(req, res);
  },
);

router.post(
  '/:changeRequestId/documents',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.ADD_NEW_FACILITY),
  [param('changeRequestId', 'URL param: [changeRequestId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return createChangeAction(req, res, CHANGE_REQUEST_TYPES.PDF_CHANGE);
  },
);

/**
 * Delete a change action
 */
router.delete(
  '/changeAction/:changeActionId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('changeActionId', 'URL param: [changeActionId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return deleteChangeAction(req, res);
  },
);

/**
 * Get Change Requests MTFI using CCFRI Application Id
 */
router.get(
  '/mtfi/:ccfriId/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return getChangeRequestMTFIByCcfriId(req, res);
  },
);

/**
 * Delete Change Requests MTFI
 */
router.delete(
  '/mtfi/:mtfiId/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('mtfiId', 'URL param: [mtfiId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return deleteChangeRequestMTFI(req, res);
  },
);

/**
 * Update Change Request MTFI
 */

router.patch(
  '/mtfi/:mtfiId/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('mtfiId', 'URL param: [mtfiId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateChangeRequestMTFI(req, res);
  },
);

module.exports = router;
