const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VERSION } = require('../util/constants');
const isValidBackendToken = auth.isValidBackendToken();
const { getFacility, getFacilityChildCareTypes, createFacility, updateFacility, deleteFacility, getLicenseCategories, getApprovedParentFees } = require('../components/facility');
const { param, validationResult, checkSchema } = require('express-validator');
const validateFacility = require('../middlewares/validateFacility');

const facilitySchema = {
  organizationId: { in: ['body'], exists: { errorMessage: '[organizationId] is required' } },
  applicationId: { in: ['body'], exists: { errorMessage: '[applicationId] is required' } },
};

module.exports = router;

/**
 * Get Facility details
 */
router.get(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.VIEW_FACILITY_INFORMATION),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFacility(req, res);
  },
);

router.get(
  '/:facilityId/licenseCategories',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.REQUEST_CLOSURE),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getLicenseCategories(req, res);
  },
);

/**
 * Get Facility details for CCFRI Application (less detailed)
 */
//i think i want ccfri guid here ?? passing in CCFRI application GUID now - trying it out
// TODO #securitymatrix - Implement with Applications security
router.get('/ccfri/:ccfriId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return getFacilityChildCareTypes(req, res);
});

/**
 * Get Parent Fees for a facility
 *
 */
// TODO #securitymatrix - Implement with Applications security
router.get(
  '/fees/:facilityId/year/:programYearId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty(), param('programYearId', 'URL param: [programYearId] is required').not().isEmpty()],
  (req, res) => {
    validationResult(req).throw();
    return getApprovedParentFees(req, res);
  },
);

/**
 * Create a new Facility
 */
// TODO #securitymatrix - Implement with Applications security
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(facilitySchema)], (req, res) => {
  validationResult(req).throw();
  return createFacility(req, res);
});

/**
 * Update an existing Facility
 */
router.put(
  '/:facilityId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.UPDATE_FACILITY_INFORMATION),
  validateFacility(),
  [param('facilityId', 'URL param: [facilityId] is required').notEmpty().isUUID(UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateFacility(req, res);
  },
);

// TODO #securitymatrix - Implement with Applications security
router.delete('/:facilityId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return deleteFacility(req, res);
});

/**
 * Submit a complete application
 */
// TODO #securitymatrix - Implement with Applications security
router.post('/:facilityId/submit', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(facilitySchema)], (req, res) => {
  validationResult(req).throw();
  return createFacility(req, res);
});

module.exports = router;
