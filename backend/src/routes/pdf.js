const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { getPdfs } = require('../components/pdf');
const { param } = require('express-validator');

//Gets all the pdfs for summaryDeclaration and changeRequest submissions
router.get(
  '/:organizationId',
  passport.authenticate('jwt', { session: false }, undefined),
  isValidBackendToken,
  validatePermission(PERMISSIONS.DOWNLOAD_PCF_PDF),
  [param('organizationId', 'URL param: [organizationId] is required').not().isEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    return getPdfs(req, res);
  },
);

module.exports = router;
