const express = require('express');
const passport = require('passport');
const router = express.Router();
const auth = require('../components/auth');
const isValidBackendToken= auth.isValidBackendToken();
const { upsertParentFees, updateCCFRIApplication, getCCFRIApplication} = require('../components/application');
const { param, validationResult, checkSchema} = require('express-validator');
const { log } = require('../components/logger');


/* CREATE a NEW CCFRI application */
//post does not work rn, so leaving this commented out - JB 

// router.post('/ccfri', passport.authenticate('jwt', {session: false}),isValidBackendToken, [], (req, res) => { 
//   //validationResult(req).throw();
//   return createCCFRIApplication(req, res);
// });


/* CREATE or UPDATE an existing CCFRI application for opt-in and out
  CCOF application guid and facility guid are defined in the payload
*/

router.get('/ccfri/:ccfriId', passport.authenticate('jwt', {session: false}),isValidBackendToken,
  [param('ccfriId', 'URL param: [ccfriId] is required').not().isEmpty()], (req, res) => {
    validationResult(req).throw();
    return getCCFRIApplication(req, res);
  });

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





module.exports = router;
