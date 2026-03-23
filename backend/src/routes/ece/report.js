const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { ECE_REPORT_STATUS_CODES, PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../../util/constants');
const { adjustECEReport, createECEReport, getECEReport, getECEReports, getECETopUpReports, submitECEReport, updateECEReport } = require('../../components/ece/report');
const { body, checkSchema, oneOf, param, query, validationResult } = require('express-validator');
const validatePermission = require('../../middlewares/validatePermission');

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
};
const updateECEReportSchema = {
  statusCode: {
    in: ['body'],
    optional: true,
    isIn: {
      options: [Object.values(ECE_REPORT_STATUS_CODES)],
      errorMessage: '[statusCode] is invalid',
    },
  },
  version: {
    in: ['body'],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: '[version] must be a positive integer',
    },
  },
};
const topUpReportsSchema = {
  year: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'year is required',
    },
    isInt: {
      options: { min: 2000, max: 2200 },
      errorMessage: 'year must be between 2000 and 2200',
    },
  },
  fromMonth: {
    in: ['body'],
    optional: true,
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'fromMonth must be between 1 and 12',
    },
  },
  toMonth: {
    in: ['body'],
    optional: true,
    isInt: {
      options: { min: 1, max: 12 },
      errorMessage: 'toMonth must be between 1 and 12',
    },
  },
  facilityIds: {
    in: ['body'],
    isArray: {
      options: { min: 1 },
      errorMessage: 'facilityIds must be a non-empty array',
    },
  },
  'facilityIds.*': {
    in: ['body'],
    isUUID: {
      options: UUID_VALIDATOR_VERSION,
      errorMessage: 'Each facilityId must be a valid UUID',
    },
  },
  eceStaffIds: {
    in: ['body'],
    isArray: {
      options: { min: 1 },
      errorMessage: 'eceStaffIds must be a non-empty array',
    },
  },
  'eceStaffIds.*': {
    in: ['body'],
    isUUID: {
      options: UUID_VALIDATOR_VERSION,
      errorMessage: 'Each eceStaffId must be a valid UUID',
    },
  },
};

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ECE_REPORT),
  [
    query('organizationId', 'URL param: [organizationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    query('programYearId', 'URL param: [programYearId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  ],
  (req, res) => {
    validationResult(req).throw();
    return getECEReports(req, res);
  },
);

router.post('/top-up', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.VIEW_ECE_REPORT), checkSchema(topUpReportsSchema), (req, res) => {
  validationResult(req).throw();
  return getECETopUpReports(req, res);
});

router.get(
  '/:eceReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ECE_REPORT),
  [param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getECEReport(req, res);
  },
);

router.patch(
  '/:eceReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.EDIT_ECE_REPORT),
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  oneOf([body('statusCode').exists(), body('version').exists()], {
    message: 'At least one updatable field is required',
  }),
  checkSchema(updateECEReportSchema),
  (req, res) => {
    validationResult(req).throw();
    return updateECEReport(req, res);
  },
);

router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, validatePermission(PERMISSIONS.CREATE_ECE_REPORT), [checkSchema(createECEReportSchema)], (req, res) => {
  validationResult(req).throw();
  return createECEReport(req, res);
});

router.post(
  '/:eceReportId/submit',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_ECE_REPORT),
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return submitECEReport(req, res);
  },
);

router.post(
  '/:eceReportId/adjustment',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.ADJUST_ECE_REPORT),
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return adjustECEReport(req, res);
  },
);

module.exports = router;
