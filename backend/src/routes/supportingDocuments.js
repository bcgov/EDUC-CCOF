const express = require('express');
const { param } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { saveDocument, getUploadedDocuments } = require('../components/supportingDocumentUpload');
const { scanFilePayload } = require('../util/clamav');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');

module.exports = router;

router.post(
  '',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF),
  scanFilePayload,
  saveDocument,
);

router.get(
  '/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF, PERMISSIONS.MTFI, PERMISSIONS.VIEW_A_CR),
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  getUploadedDocuments,
);
