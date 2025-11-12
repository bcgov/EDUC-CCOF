const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { checkFundingAgreementExists, getFundingAgreement, getFundingAgreements, getFundingAgreementPDF, updateFundingAgreement } = require('../components/fundingAgreement');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { oneOf, param, query, validationResult } = require('express-validator');
const validatePermission = require('../middlewares/validatePermission');

/**
 * Get the list of Funding Agreements using OrgID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  query('organizationId').notEmpty().withMessage('organizationId is required').isUUID(UUID_VALIDATOR_VERSION).withMessage('organizationId must be a valid UUID'),
  (req, res) => {
    validationResult(req).throw();
    return getFundingAgreements(req, res);
  },
);

/**
 * Checks whether any funding agreement exists for the given query (e.g.: organization, program year, and internal status).
 */
router.get(
  '/exists',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_RENEWAL_PCF),
  query('organizationId').notEmpty().withMessage('URL query: [organizationId] is required').isUUID(UUID_VALIDATOR_VERSION).withMessage('organizationId must be a valid UUID'),
  oneOf([query('programYearId').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('internalStatusCode').notEmpty()], {
    message: 'URL query: [programYearId or internalStatusCode] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return checkFundingAgreementExists(req, res);
  },
);

/**
 * Get the Funding Agreement using fundingAgreementId
 */
router.get(
  '/:fundingAgreementId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFundingAgreement(req, res);
  },
);

/**
 * Retrieve the PDF for a funding agreement using fundingAgreementId
 */
router.get(
  '/:fundingAgreementId/pdf',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.DOWNLOAD_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getFundingAgreementPDF(req, res);
  },
);

/**
 * Update an existing Funding Agreement using fundingAgreementId
 */
router.patch(
  '/:fundingAgreementId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.SIGN_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateFundingAgreement(req, res);
  },
);
module.exports = router;
