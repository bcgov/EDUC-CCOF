const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VERSION } = require('../util/constants');
const { createClosure, deleteClosures, getClosures, updateClosure } = require('../components/closure');
const { checkSchema, oneOf, param, query, validationResult } = require('express-validator');

module.exports = router;

const closureSchema = {
  closureStatus: {
    in: ['body'],
    exists: { errorMessage: '[closureStatus] is required' },
  },
  closureType: {
    in: ['body'],
    exists: { errorMessage: '[closureType] is required' },
  },
  paidClosure: {
    in: ['body'],
    exists: { errorMessage: '[paidClosure] is required' },
  },
  paymentEligibility: {
    in: ['body'],
    exists: { errorMessage: '[paymentEligibility] is required' },
  },
  ccfriApplicationId: {
    in: ['body'],
    exists: { errorMessage: '[ccfriApplicationId] is required' },
  },
  facilityId: {
    in: ['body'],
    exists: { errorMessage: '[facilityId] is required' },
  },
  organizationId: {
    in: ['body'],
    exists: { errorMessage: '[organizationId] is required' },
  },
  programYearId: {
    in: ['body'],
    exists: { errorMessage: '[programYearId] is required' },
  },
};

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_CLOSURES, PERMISSIONS.VIEW_SUBMITTED_PCF),
  oneOf([query('organizationId').notEmpty().isUUID(UUID_VERSION), query('programYearId').notEmpty().isUUID(UUID_VERSION), query('ccfriApplicationId').notEmpty().isUUID(UUID_VERSION)], {
    message: 'URL query: [organizationId or programYearId or ccfriApplicationId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getClosures(req, res);
  },
);

// TODO #securitymatrix - Implement with Applications security
router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(closureSchema)], (req, res) => {
  validationResult(req).throw();
  return createClosure(req, res);
});

// TODO #securitymatrix - Implement with Applications security
router.patch(
  '/:closureId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('closureId', 'URL param: [closureId] is required').notEmpty().isUUID(UUID_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateClosure(req, res);
  },
);

// TODO #securitymatrix - Implement with Applications security
router.delete('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, deleteClosures);

module.exports = router;
