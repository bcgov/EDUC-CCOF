const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const {
  checkDueEnrolmentReports,
  createAdjustmentEnrolmentReport,
  getDailyEnrolments,
  getEnrolmentReport,
  getEnrolmentReports,
  updateDailyEnrolments,
  updateEnrolmentReport,
} = require('../components/enrolmentReport');
const { body, checkSchema, oneOf, param, query, validationResult } = require('express-validator');

module.exports = router;

router.get(
  '/:enrolmentReportId/daily-enrolments',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ER),
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
  validatePermission(PERMISSIONS.EDIT_DRAFT_ER, PERMISSIONS.ADJUST_EXISTING_ER),
  [
    param('enrolmentReportId', 'URL param: [enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
    body().isArray({ min: 1 }).withMessage('Request body must be a non-empty array'),
    checkSchema({
      '*.dailyEnrolmentId': {
        in: ['body'],
        exists: { errorMessage: '[dailyEnrolmentId] is required' },
        isUUID: { options: [UUID_VALIDATOR_VERSION], errorMessage: '[dailyEnrolmentId] must be a valid UUID' },
      },
    }),
  ],
  (req, res) => {
    validationResult(req).throw();
    return updateDailyEnrolments(req, res);
  },
);

router.get(
  '/has-due',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SUBMIT_ENROLMENT_REPORT),
  [
    query('organizationId').notEmpty().withMessage('organizationId is required').isUUID(UUID_VALIDATOR_VERSION).withMessage('organizationId must be a valid UUID'),
    query('programYearId').notEmpty().withMessage('programYearId is required').isUUID(UUID_VALIDATOR_VERSION).withMessage('programYearId must be a valid UUID'),
    query('prevProgramYearId').notEmpty().withMessage('prevProgramYearId is required').isUUID(UUID_VALIDATOR_VERSION).withMessage('prevProgramYearId must be a valid UUID'),
  ],
  (req, res) => {
    validationResult(req).throw();
    return checkDueEnrolmentReports(req, res);
  },
);

router.get(
  '/:enrolmentReportId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_ER),
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
  validatePermission(PERMISSIONS.VIEW_ER),
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
  validatePermission(PERMISSIONS.EDIT_DRAFT_ER, PERMISSIONS.ADJUST_EXISTING_ER, PERMISSIONS.SUBMIT_ENROLMENT_REPORT),
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
  validatePermission(PERMISSIONS.ADJUST_EXISTING_ER),
  [body('enrolmentReportId', '[enrolmentReportId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION), body('contactId', '[contactId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return createAdjustmentEnrolmentReport(req, res);
  },
);

module.exports = router;
