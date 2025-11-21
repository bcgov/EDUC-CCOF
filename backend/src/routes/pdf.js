const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { getPdf, getPdfs } = require('../components/pdf');
const { param } = require('express-validator');

// special case this does not use frontend axios, so need to refresh here to handle expired jwt.
router.get(
  '/getDocument/:annotationId',
  auth.refreshJWT,
  isValidBackendToken,
  validatePermission(PERMISSIONS.DOWNLOAD_PCF_PDF),
  [param('annotationId', 'URL param: [annotationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return getPdf(req, res);
  },
);

//Gets all the pdfs for summaryDeclaration and changeRequest submissions
router.get(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidBackendToken,
  validatePermission(PERMISSIONS.DOWNLOAD_PCF_PDF),
  [param('organizationId', 'URL param: [organizationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return getPdfs(req, res);
  },
);

module.exports = router;
