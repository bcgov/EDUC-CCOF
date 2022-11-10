const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { createCCFRIApplication, updateCCFRIApplication} = require('../components/application');
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


/* UPDATE an existing CCFRI application */


router.patch('/ccfri', passport.authenticate('jwt', {session: false}),isValidBackendToken, [],  (req, res) => { 
  //validationResult(req).throw();
  //console.log(req.bpdy);
  return updateCCFRIApplication(req, res);
});



module.exports = router;
