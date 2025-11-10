const express = require('express');
const { param } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const isValidBackendToken = auth.isValidBackendToken();
const { scanFilePayload } = require('../util/clamav');
const { saveLicenses, getLicenseFiles, deleteLicenseFiles } = require('../components/licenseUpload');

module.exports = router;

router.post(
  '',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF),
  scanFilePayload,
  saveLicenses,
);

router.get(
  '/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF),
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  getLicenseFiles,
);

router.delete('', passport.authenticate('jwt', { session: false }), isValidBackendToken, isValidBackendToken, validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION), deleteLicenseFiles);
