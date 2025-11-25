const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { getPayments } = require('../components/payment');
const { oneOf, query, validationResult } = require('express-validator');

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  oneOf([query('organizationId').notEmpty().isUUID(UUID_VALIDATOR_VERSION), query('programYearId').notEmpty().isUUID(UUID_VALIDATOR_VERSION)], {
    message: 'URL query: [organizationId or programYearId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getPayments(req, res);
  },
);

module.exports = router;
