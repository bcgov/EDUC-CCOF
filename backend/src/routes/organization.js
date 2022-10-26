const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getOrganization, createOrganization, updateOrganization } = require('../components/organization');
const { param, validationResult, checkSchema} = require('express-validator');


const organizationSchema = {
  legalName: { in: ['body'],
    exists: { errorMessage: '[legalName] is required', },
    isLength: { options: { max: 160 }, errorMessage: '[legalName] has a max length of 160'}},
  address1: { in: ['body'],
    exists: { errorMessage: '[address1] is required', },
    isLength: { options: { max: 200 }, errorMessage: '[address1] has a max length of 200'}},
  city1: { in: ['body'],
    exists: { errorMessage: '[city1] is required', },
    isLength: { options: { max: 80 }, errorMessage: '[city1] has a max length of 80'}},
  postalCode1: { in: ['body'],
    exists: { errorMessage: '[postalCode1] is required', },
    isLength: { options: { max: 20 }, errorMessage: '[postalCode1] has a max length of 20'}},
  address2: { in: ['body'],
    exists: { errorMessage: '[address2] is required', },
    isLength: { options: { max: 200 }, errorMessage: '[address2] has a max length of 200'}},
  city2: { in: ['body'],
    exists: { errorMessage: '[city2] is required', },
    isLength: { options: { max: 80 }, errorMessage: '[city2] has a max length of 80'}},
  postalCode2: { in: ['body'],
    exists: { errorMessage: '[postalCode2] is required', },
    isLength: { options: { max: 20 }, errorMessage: '[postalCode2] has a max length of 20'}},
  organizationTypeId: { in: ['body'],
    exists: { errorMessage: '[organizationTypeId] is required', },
    isInt: { errorMessage: '[organizationTypeId] must be numeric'}}

};

module.exports = router;

/**
 * Get Organization details
 */
router.get('/:organizationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('organizationId', 'URL param: [organizationId] is required').not().isEmpty()], (req, res) => {
  validationResult(req).throw();
  return getOrganization(req, res);
});

/**
 * Create a new Organization
 */
router.post('/', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  checkSchema(organizationSchema)], (req, res) => { 
  validationResult(req).throw();
  return createOrganization(req, res);
});

/**
 * Update an existing Organization
 */
router.put('/:organizationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('organizationId', 'URL param: [organizationId] is required').not().isEmpty(),
  checkSchema(organizationSchema)], (req, res) => {
  validationResult(req).throw();
  return updateOrganization(req, res);
});

module.exports = router;
