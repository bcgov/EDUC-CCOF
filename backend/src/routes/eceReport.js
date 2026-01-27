const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { ECE_REPORT_TYPES, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { createECEReport, createECEStaffInformation, getECEReport, getECEReports, updateECEStaffInformation } = require('../components/eceReport');
const { body, checkSchema, param, query, validationResult } = require('express-validator');

const createECEReportSchema = {
  organizationId: {
    in: ['body'],
    exists: { errorMessage: '[organizationId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[organizationId] must be a valid UUID' },
  },
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[facilityId] must be a valid UUID' },
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[programYearId] must be a valid UUID' },
  },
  month: {
    in: ['body'],
    exists: { errorMessage: '[month] is required' },
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: '[month] must be an integer between 1 and 12',
    },
  },
  year: {
    in: ['body'],
    exists: { errorMessage: '[year] is required' },
    isInt: {
      options: { min: 2000, max: 2200 },
      errorMessage: '[year] must be an integer between 2000 and 2200',
    },
  },
  reportType: {
    in: ['body'],
    exists: {
      options: { checkFalsy: true },
      errorMessage: '[reportType] is required',
    },
    toInt: true,
    isIn: {
      options: [Object.values(ECE_REPORT_TYPES)],
      errorMessage: '[reportType] must be a valid report type',
    },
  },
};

const createECEStaffInformationSchema = {
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

const updateECEStaffInformationSchema = {
  '*.eceStaffInformationId': {
    in: ['body'],
    exists: { errorMessage: '[eceStaffInformationId] is required' },
    isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[eceStaffInformationId] must be a valid UUID' },
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

// TODO: Implement ECE Reports permission
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [
    query('organizationId', 'URL param: [organizationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    query('programYearId', 'URL param: [programYearId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  ],
  (req, res) => {
    validationResult(req).throw();
    return getECEReports(req, res);
  },
);

// TODO: Implement ECE Reports permission
router.get(
  '/:eceReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getECEReport(req, res);
  },
);

// TODO: Implement ECE Reports permission
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(createECEReportSchema)], (req, res) => {
  validationResult(req).throw();
  return createECEReport(req, res);
});

// TODO: Implement ECE Reports permission
router.post(
  '/:eceReportId/staff-information',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(createECEStaffInformationSchema),
  (req, res) => {
    validationResult(req).throw();
    return createECEStaffInformation(req, res);
  },
);

router.patch(
  '/staff-information/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  //TODO: Add permissions here
  body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
  checkSchema(updateECEStaffInformationSchema),
  (req, res) => {
    validationResult(req).throw();
    return updateECEStaffInformation(req, res);
  },
);

module.exports = router;
