const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const { param, validationResult } = require('express-validator');
const isValidBackendToken = auth.isValidBackendToken();
const { createApplicationDocuments, createChangeActionDocuments, getApplicationDocuments, deleteDocuments, updateDocument } = require('../components/document');
const { scanFilePayload } = require('../util/clamav');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');

module.exports = router;

router.post(
  '/application/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF),
  scanFilePayload,
  createApplicationDocuments,
);

router.post(
  '/change-action/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO Are there others?
  validatePermission(PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES),
  scanFilePayload,
  createChangeActionDocuments,
);

router.get(
  '/application/:applicationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.VIEW_SUBMITTED_PCF, PERMISSIONS.MTFI, PERMISSIONS.VIEW_A_CR),
  [param('applicationId', 'URL param: [applicationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return getApplicationDocuments(req, res);
  },
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.CREATE_NEW_APPLICATION, PERMISSIONS.CREATE_RENEWAL_PCF, PERMISSIONS.LICENCE_CHANGE, PERMISSIONS.ORGANIZATION_CHANGE, PERMISSIONS.OTHER_CHANGES),
  deleteDocuments,
);

router.patch(
  '/:annotationId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  // TODO #securitymatrix - Implement with Applications/Change Request security
  [param('annotationId', 'URL param: [annotationId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  scanFilePayload,
  (req, res) => {
    validationResult(req).throw();
    return updateDocument(req, res);
  },
);
