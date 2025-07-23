const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getDailyEnrolments, getEnrolmentReport, getEnrolmentReports, updateDailyEnrolments } = require('../components/enrolmentReport');
const { body, checkSchema, oneOf, param, query, validationResult } = require('express-validator');

module.exports = router;

router.get(
  '/daily-enrolments',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [query('enrolmentReportId', 'URL query: [enrolmentReportId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return getDailyEnrolments(req, res);
  },
);

/**
 * Update daily enrolments
 */
router.patch(
  '/daily-enrolments/bulk',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
    checkSchema({
      '*.dailyEnrolmentId': {
        in: ['body'],
        exists: { errorMessage: '[dailyEnrolmentId] is required' },
        isUUID: { errorMessage: '[dailyEnrolmentId] must be a valid UUID' },
      },
      '*.value': {
        in: ['body'],
        exists: { errorMessage: '[value] is required' },
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
  [param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return getEnrolmentReport(req, res);
  },
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  oneOf([query('organizationId').notEmpty().isUUID(), query('programYearId').notEmpty().isUUID()], {
    message: 'URL query: [organizationId or programYearId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getEnrolmentReports(req, res);
  },
);

module.exports = router;
