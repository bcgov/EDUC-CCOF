const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getProgramsVacancies, updateProgramsVacancies } = require('../components/programsVacancies');
const { UUID_VALIDATOR_VERSION } = require('../util/constants');
const { param, query, validationResult } = require('express-validator');
/**
 * Get the Programs and Vacancies using facilityID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  query('facilityId', 'Query param: [facilityId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION),
  (req, res) => {
    validationResult(req).throw();
    return getProgramsVacancies(req, res);
  },
);

/**
 * Update Programs and Vacancies using programsVacanciesId
 */
router.patch(
  '/:programsVacanciesId',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  [param('programsVacanciesId', 'URL param: [programsVacanciesId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateProgramsVacancies(req, res);
  },
);
module.exports = router;
