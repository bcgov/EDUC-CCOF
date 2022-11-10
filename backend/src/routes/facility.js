const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { getFacility, createFacility, updateFacility } = require('../components/facility');
const { param, validationResult, checkSchema} = require('express-validator');


const facilitySchema = {
  facilityName: { in: ['body'],
    exists: { errorMessage: '[facilityName] is required', },
    isLength: { options: { max: 160 }, errorMessage: '[legalName] has a max length of 160'}},
  facilityAddress: { in: ['body'],
    exists: { errorMessage: '[address1] is required', },
    isLength: { options: { max: 250 }, errorMessage: '[address1] has a max length of 250'}},
  city: { in: ['body'],
    exists: { errorMessage: '[city] is required', },
    isLength: { options: { max: 80 }, errorMessage: '[city1] has a max length of 80'}},
  organizationId: { in: ['body'],
    exists: { errorMessage: '[organizationId] is required', }},
  ccofApplicationId: { in: ['body'],
    exists: { errorMessage: '[ccofApplicationId] is required', }},
  yearBeginOperation: { in: ['body'],
    exists: { errorMessage: '[yearBeginOperation] is required', }},
};

module.exports = router;

/**
 * Get Facility details
 */
router.get('/:facilityId', //passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('facilityId', 'URL param: [facilityId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getFacility(req, res);
  });

/**
 * Create a new Facility
 */
router.post('/', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  checkSchema(facilitySchema)], (req, res) => { 
  validationResult(req).throw();
  return createFacility(req, res);
});

/**
 * Update an existing Facility
 */
router.put('/:facilityId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('facilityId', 'URL param: [facilityId] is required').not().isEmpty(),
  checkSchema(facilitySchema)], (req, res) => {
  validationResult(req).throw();
  return updateFacility(req, res);
});

/**
 * Submit a complete application
 */
router.post('/:facilityId/submit', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  checkSchema(facilitySchema)], (req, res) => { 
  validationResult(req).throw();
  return createFacility(req, res);
});

module.exports = router;
