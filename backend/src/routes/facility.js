const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const isValidBackendToken = auth.isValidBackendToken();
const {
  getFacility,
  getFacilityChildCareTypes,
  createFacility,
  updateFacility,
  deleteFacility,
  getLicenseCategories,
  getApprovedParentFees,
  getCcfriFacilities,
  getEceweFacilities,
} = require('../components/facility');
const { param, validationResult, checkSchema } = require('express-validator');
const validateFacility = require('../middlewares/validateFacility');

const facilitySchema = {
  organizationId: { in: ['body'], exists: { errorMessage: '[organizationId] is required' } },
  applicationId: { in: ['body'], exists: { errorMessage: '[applicationId] is required' } },
};

module.exports = router;

const { query } = require('express-validator');

/**
 * Get CCFRI facility details
 */
router.get(
  '/ccfri-facilities',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_INFORMATION),
  [query('orgId', 'Query param [orgId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('selectedFY', 'Query param [selectedFY] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  getCcfriFacilities,
);

/**
 * Get ECE-WE facility details
 */
router.get(
  '/ecewe-facilities',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ORG_INFORMATION),
  [query('orgId', 'Query param [orgId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('selectedFY', 'Query param [selectedFY] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  getEceweFacilities,
);
/**
 * Get Facility details
 */
router.get(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(
    PERMISSIONS.CREATE_NEW_APPLICATION,
    PERMISSIONS.CREATE_RENEWAL_PCF,
    PERMISSIONS.VIEW_SUBMITTED_PCF,
    PERMISSIONS.VIEW_FACILITY_INFORMATION,
    PERMISSIONS.ADD_NEW_FACILITY,
    PERMISSIONS.VIEW_A_CR,
  ),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFacility(req, res);
  },
);

/**
 * Get Facility License Categories
 */
router.get(
  '/:facilityId/licenseCategories',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(
    PERMISSIONS.CREATE_NEW_APPLICATION,
    PERMISSIONS.CREATE_RENEWAL_PCF,
    PERMISSIONS.VIEW_SUBMITTED_PCF,
    PERMISSIONS.REQUEST_CLOSURE,
    PERMISSIONS.MTFI,
    PERMISSIONS.VIEW_A_CR,
    PERMISSIONS.ADD_NEW_FACILITY,
  ),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getLicenseCategories(req, res);
  },
);

/**
 * Get Facility details for CCFRI Application (less detailed)
 */
router.get(
  '/ccfri/:ccfriId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF, PERMISSIONS.MTFI, PERMISSIONS.ADD_NEW_FACILITY, PERMISSIONS.VIEW_A_CR),
  [param('ccfriId', 'URL param: [ccfriId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFacilityChildCareTypes(req, res);
  },
);

/**
 * Get Parent Fees for a facility
 */
router.get(
  '/fees/:facilityId/year/:programYearId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF, PERMISSIONS.MTFI, PERMISSIONS.ADD_NEW_FACILITY, PERMISSIONS.VIEW_A_CR),
  [
    param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    param('programYearId', 'URL param: [programYearId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  ],
  (req, res) => {
    validationResult(req).throw();
    return getApprovedParentFees(req, res);
  },
);

/**
 * Create a new Facility
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.ADD_NEW_FACILITY),
  [checkSchema(facilitySchema)],
  (req, res) => {
    validationResult(req).throw();
    return createFacility(req, res);
  },
);

/**
 * Update an existing Facility
 */
router.put(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.UPDATE_FACILITY_INFORMATION, PERMISSIONS.ADD_NEW_FACILITY),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateFacility(req, res);
  },
);

/**
 * Delete a Facility
 */
router.delete(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.ADD_NEW_FACILITY),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return deleteFacility(req, res);
  },
);

module.exports = router;
