const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { createECEReport, getECEReport, getECEReports } = require('../components/eceReport');
const { checkSchema, param, query, validationResult } = require('express-validator');

module.exports = router;

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
    isNumeric: { errorMessage: '[month] must be a number' },
  },
  year: {
    in: ['body'],
    exists: { errorMessage: '[year] is required' },
    isNumeric: { errorMessage: '[year] must be a number' },
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

module.exports = router;
