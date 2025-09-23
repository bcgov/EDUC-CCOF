const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getFundingAgreement, getFundingAgreements, getFundingAgreementPDF, updateFundingAgreement } = require('../components/fundingAgreement');
const { PERMISSIONS } = require('../util/constants');
const { param, query, validationResult } = require('express-validator');
const validatePermission = require('../middlewares/validatePermission');
/**
 * Get the list of Funding Agreements using OrgID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  query('organizationId').notEmpty().withMessage('organizationId is required').isUUID().withMessage('organizationId must be a valid UUID'),
  (req, res) => {
    validationResult(req).throw();
    return getFundingAgreements(req, res);
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
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
  validatePermission(PERMISSIONS.VIEW_FUNDING_AGREEMENT),
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
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
  [param('fundingAgreementId', 'URL param: [fundingAgreementId] is required').notEmpty().isUUID()],
  (req, res) => {
    validationResult(req).throw();
    return updateFundingAgreement(req, res);
  },
);
module.exports = router;
