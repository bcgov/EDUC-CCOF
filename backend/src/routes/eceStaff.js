const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { createECEStaff, getECEStaff, getECEStaffCertificates, updateECEStaff } = require('../components/eceStaff');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { body, checkSchema, oneOf, query, validationResult } = require('express-validator');
const validatePermission = require('../middlewares/validatePermission');
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
    return getECEStaff(req, res);
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

const updateECEStaffSchema = {
  '*.eceStaffId': {
    in: ['body'],
    exists: { errorMessage: '[eceStaffId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceStaffId] must be a valid UUID' },
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

/**
 * Update an existing ECE Staff record
 */
router.patch(
  '/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.EDIT_ECE_STAFF),
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(updateECEStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return updateECEStaff(req, res);
  },
);

const createECEStaffSchema = {
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

/**
 * Create a new ECE Staff record
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.ADD_ECE_STAFF),
  [body('facilityId').notEmpty().withMessage('[facilityId] is required').isUUID(UUID_VALIDATOR_VERSION)],
  checkSchema(createECEStaffSchema),
  (req, res) => {
    validationResult(req).throw();
    return createECEStaff(req, res);
  },
);

module.exports = router;
