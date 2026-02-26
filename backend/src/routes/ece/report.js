const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { ECE_REPORT_TYPES, UUID_VALIDATOR_VERSION } = require('../../util/constants');
const { createECEReport, getECEReport, getECEReports, submitECEReport, updateECEReportStatus, updateECEReportVersion } = require('../../components/ece/report');
const { checkSchema, param, query, validationResult } = require('express-validator');

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

router.patch(
  '/:eceReportId/status',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return updateECEReportStatus(req, res);
  },
);

router.patch(
  '/:eceReportId/version',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateECEReportVersion(req, res);
  },
);

// TODO: Implement ECE Reports permission
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(createECEReportSchema)], (req, res) => {
  validationResult(req).throw();
  return createECEReport(req, res);
});

// TODO: Implement ECE Reports permission
router.post(
  '/:eceReportId/submit',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  param('eceReportId', 'URL param: [eceReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return submitECEReport(req, res);
  },
);

module.exports = router;
