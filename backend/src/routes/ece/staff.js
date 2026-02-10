const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { createECEFacilityStaff, createECEReportStaff, getECEFacilityStaff, getECEStaffCertificates, updateECEFacilityStaff, updateECEReportStaff } = require('../../components/ece/staff');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../../util/constants');
const { body, checkSchema, oneOf, query, validationResult } = require('express-validator');
const validatePermission = require('../../middlewares/validatePermission');

const createECEFacilityStaffSchema = {
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[facilityId] must be a valid UUID' },
  },
  hourlyWage: {
    in: ['body'],
    exists: { errorMessage: '[hourlyWage] is required' },
    isFloat: {
      options: { min: 1, max: 1000 },
      errorMessage: '[hourlyWage] must be a number between 1 and 1000',
    },
  },
};

const updateECEFacilityStaffSchema = {
  '*.eceFacilityStaffId': {
    in: ['body'],
    exists: { errorMessage: '[eceFacilityStaffId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceFacilityStaffId] must be a valid UUID' },
  },
  '*.hourlyWage': {
    in: ['body'],
    exists: {
      errorMessage: '[hourlyWage] is required',
    },
    isFloat: {
      options: { min: 0, max: 1000 },
      errorMessage: '[hourlyWage] must be a number between 0 and 1000',
    },
  },
  '*.status': {
    in: ['body'],
    exists: { errorMessage: '[status] is required' },
    isIn: {
      options: [[0, 1]],
      errorMessage: '[status] must be either 0 (inactive) or 1 (active)',
    },
  },
};

const createECEReportStaffSchema = {
  '*.eceStaffId': {
    in: ['body'],
    exists: { errorMessage: '[eceStaffId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceStaffId] must be a valid UUID' },
  },
  '*.eceReportId': {
    in: ['body'],
    exists: { errorMessage: '[eceReportId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceReportId] must be a valid UUID' },
  },
  '*.hourlyWage': {
    in: ['body'],
    exists: {
      errorMessage: '[hourlyWage] is required',
    },
    isFloat: {
      options: { min: 1, max: 1000 },
      errorMessage: '[hourlyWage] must be a number between 1 and 1000',
    },
  },
};

const updateECEReportStaffSchema = {
  '*.eceReportStaffId': {
    in: ['body'],
    exists: { errorMessage: '[eceReportStaffId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceReportStaffId] must be a valid UUID' },
  },
  '*.totalHoursWorked': {
    in: ['body'],
    exists: {
      errorMessage: '[totalHoursWorked] is required',
    },
    isFloat: {
      options: { min: 0, max: 195 },
      errorMessage: '[totalHoursWorked] must be a number between 0 and 195',
    },
  },
};

/**
 * Get the ECE Staff records using facilityID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ECE_STAFF),
  query('facilityId', 'Query param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return getECEFacilityStaff(req, res);
  },
);

/**
 * Retrieves the list of certificates for a specific ECE staff member.
 */
router.get(
  '/certificates',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ECE_STAFF),
  [
    query('registrationNumber').notEmpty().withMessage('[registrationNumber] is required').matches(/^\d+$/),
    oneOf([query('firstName').notEmpty().isString(), query('lastName').notEmpty().isString()], {
      message: 'URL query: [firstName, or lastName] is required',
    }),
  ],
  (req, res) => {
    validationResult(req).throw();
    return getECEStaffCertificates(req, res);
  },
);

/**
 * Update an existing ECE Staff record
 */
router.patch(
  '/facility-staff',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.EDIT_ECE_STAFF),
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(updateECEFacilityStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return updateECEFacilityStaff(req, res);
  },
);

/**
 * Create a new ECE Facility Staff record
 */
router.post(
  '/facility-staff',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.ADD_ECE_STAFF),
  checkSchema(createECEFacilityStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return createECEFacilityStaff(req, res);
  },
);

// TODO: Implement ECE Reports permission
/**
 * Create a ECE Report Staff record
 */
router.post(
  '/report-staff',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(createECEReportStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return createECEReportStaff(req, res);
  },
);

// TODO: Implement ECE Reports permission
/**
 * Update ECE Report Staff information in bulk
 */
router.patch(
  '/report-staff',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(updateECEReportStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return updateECEReportStaff(req, res);
  },
);

module.exports = router;
