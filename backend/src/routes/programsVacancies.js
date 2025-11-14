const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken = auth.isValidBackendToken();
const { getProgramsVacancies, updateProgramsVacancies } = require('../components/programsVacancies');
const validatePermission = require('../middlewares/validatePermission');
const { PERMISSIONS, UUID_VALIDATOR_VERSION } = require('../util/constants');
const { param, query, validationResult } = require('express-validator');
/**
 * Get the Programs and Vacancies using facilityID
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  isValidBackendToken,
  validatePermission(PERMISSIONS.VIEW_PROGRAMS_VACANCIES),
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
  validatePermission(PERMISSIONS.EDIT_PROGRAMS_VACANCIES),
  [param('programsVacanciesId', 'URL param: [programsVacanciesId] is required').notEmpty().isUUID(UUID_VALIDATOR_VERSION)],
  (req, res) => {
    validationResult(req).throw();
    return updateProgramsVacancies(req, res);
  },
);
module.exports = router;
