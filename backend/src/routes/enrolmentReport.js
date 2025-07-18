const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getEnrolmentReports } = require('../components/enrolmentReport');
const { oneOf, query, validationResult } = require('express-validator');

module.exports = router;

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  oneOf([query('organizationId').notEmpty().isUUID(), query('programYearId').notEmpty().isUUID()], {
    message: 'URL query: [organizationId or programYearId] is required',
  }),
  (req, res) => {
    validationResult(req).throw();
    return getEnrolmentReports(req, res);
  },
);

module.exports = router;
