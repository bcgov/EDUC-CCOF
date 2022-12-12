const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { upsertParentFees, upsertCCFRIApplication} = require('../components/application');
const { getECEWEApplication, updateECEWEApplication, updateECEWEFacilityApplication } = require('../components/application');
const { param, validationResult, checkSchema} = require('express-validator');
const { log } = require('../components/logger');


// const facilitySchema = {
//   facilityName: { in: ['body'],
//     exists: { errorMessage: '[facilityName] is required', },
//     isLength: { options: { max: 160 }, errorMessage: '[legalName] has a max length of 160'}},
//   facilityAddress: { in: ['body'],
//     exists: { errorMessage: '[address1] is required', },
//     isLength: { options: { max: 250 }, errorMessage: '[address1] has a max length of 250'}},
//   city: { in: ['body'],
//     exists: { errorMessage: '[city] is required', },
//     isLength: { options: { max: 80 }, errorMessage: '[city1] has a max length of 80'}},
//   organizationId: { in: ['body'],
//     exists: { errorMessage: '[organizationId] is required', },
//     isBase64: { errorMessage: '[organizationId] must be a GUID'}},
//   yearBeginOperation: { in: ['body'],
//     exists: { errorMessage: '[yearBeginOperation] is required', },
//     isDate: { errorMessage: '[yearBeginOperation] must be a date'}}
// };


/* CREATE a NEW CCFRI application */
//post does not work rn, so leaving this commented out - JB 

// router.post('/ccfri', passport.authenticate('jwt', {session: false}),isValidBackendToken, [], (req, res) => { 
//   //validationResult(req).throw();
//   return createCCFRIApplication(req, res);
// });


/* CREATE or UPDATE an existing CCFRI application for opt-in and out
  CCOF application guid and facility guid are defined in the payload
*/

router.patch('/ccfri', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => { 
  //validationResult(req).throw();
  //console.log(req.bpdy);
  return updateCCFRIApplication(req, res);
});

/* CREATE or UPDATE parent fees for a specified age group and year. 
  age group and year are defined in the payload   
*/
router.patch('/parentfee', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => { 
  //validationResult(req).throw();
  //console.log(req.bpdy);
  return upsertParentFees(req, res);
});


/* Retrieve an ECEWE application for an application id. */
router.get('/ecewe/:applicationId', (req, res) => {
  return getECEWEApplication(req, res);
});

/* Update an ECEWE applciation for an application id. */
router.patch('/ecewe/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => { 
  return updateECEWEApplication(req, res);
});

/* Update an ECEWE facility applciation for an ecewe application id. */
router.put('/ecewe/facilities/:applicationId', passport.authenticate('jwt', {session: false}),isValidBackendToken, [
  param('applicationId', 'URL param: [applicationId] is required').not().isEmpty()],  (req, res) => { 
  return updateECEWEFacilityApplication(req, res);
});

module.exports = router;

