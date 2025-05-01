const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { createClosure, deleteClosures, getClosures, updateClosure } = require('../components/closure');
const { checkSchema, oneOf, query, param, validationResult } = require('express-validator');

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
  oneOf([query('organizationId').notEmpty().isUUID(), query('programYearId').notEmpty().isUUID(), query('ccfriApplicationId').notEmpty().isUUID()], {
    message: 'URL query: [organizationId or programYearId or ccfriApplicationId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getClosures(req, res);
  },
);

router.post('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, [checkSchema(closureSchema)], (req, res) => {
  validationResult(req).throw();
  return createClosure(req, res);
});

router.patch('/:closureId', passport.authenticate('jwt', { session: false }), isValidBackendToken, [param('closureId', 'URL param: [closureId] is required').notEmpty().isUUID()], (req, res) => {
  validationResult(req).throw();
  return updateClosure(req, res);
});

router.delete('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, deleteClosures);

module.exports = router;
