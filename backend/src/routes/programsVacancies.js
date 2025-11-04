const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getprogramsVacancies } = require('../components/programsVacancies');
const { query, validationResult } = require('express-validator');
/**
 * Get the Programs and Vacancies using facilityID
 */
router.get('/', passport.authenticate('jwt', { session: false }), isValidBackendToken, query('facilityId', 'Query param: [facilityId] is required').notEmpty().isUUID(), (req, res) => {
  validationResult(req).throw();
  return getprogramsVacancies(req, res);
});
module.exports = router;
