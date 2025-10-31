const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { createAdjustmentEnrolmentReport, getDailyEnrolments, getEnrolmentReport, getEnrolmentReports, updateDailyEnrolments, updateEnrolmentReport } = require('../components/enrolmentReport');
const { body, checkSchema, oneOf, param, query, validationResult } = require('express-validator');

module.exports = router;

router.get(
  '/:enrolmentReportId/daily-enrolments',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getDailyEnrolments(req, res);
  },
);

/**
 * Update daily enrolments
 */
router.patch(
  '/:enrolmentReportId/daily-enrolments/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [
    param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
    checkSchema({
      '*.dailyEnrolmentId': {
        in: ['body'],
        exists: { errorMessage: '[dailyEnrolmentId] is required' },
        isUUID: { errorMessage: '[dailyEnrolmentId] must be a valid UUID' },
      },
    }),
  ],
  (req, res) => {
    validationResult(req).throw();
    return updateDailyEnrolments(req, res);
  },
);

router.get(
  '/:enrolmentReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getEnrolmentReport(req, res);
  },
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  oneOf([query('organizationId').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('programYearId').notEmpty().isUUID(UUID_VALIDATOR_VERSION)], {
    message: 'URL query: [organizationId or programYearId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getEnrolmentReports(req, res);
  },
);

router.patch(
  '/:enrolmentReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateEnrolmentReport(req, res);
  },
);

router.post(
  '/adjustment',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [body('enrolmentReportId', '[enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return createAdjustmentEnrolmentReport(req, res);
  },
);

module.exports = router;
