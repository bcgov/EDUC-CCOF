/* eslint-disable quotes */
'use strict';
const { postOperation, patchOperationWithObjectId, getOperationWithObjectId, getHttpHeader, minify,} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');
const { info } = require('./logger');
const { loadFiles } = require('../config/index');


//I think we most likely can take this out -- I get info from the CCFRI application now 
// async function getCCFRIApplication(req,res) {

//   log.info(req.params.ccfriId);

//   try {
//     let response = await getOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId);

//     log.info(response);

//     //use mappable objects here?
//     const payload = {
//       facilityId : response._ccof_facility_value,
//     };
//     return res.status(HttpStatus.OK).json(payload);
//   } catch (e) {
//     log.error(e);
//     return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
//   }
// }

//creates or updates CCFRI application. TODO: add a post function!
async function updateCCFRIApplication(req, res) {
  let body = req.body;

  body.forEach(async(facility) => { 
    let payload = {
      'ccof_ccfrioptin' : facility.optInResponse,
    };
    
    log.info(payload);
    let url = `_ccof_application_value=${facility.applicationID},_ccof_facility_value=${facility.facilityID}`;
    log.info(' updateURL: ', url);

    try {
      let response = await patchOperationWithObjectId('ccof_applicationccfris', url, payload);
      log.info('res data:' , response);
      return res.status(HttpStatus.OK).json(response);
    } catch (e) {
      log.error(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }); //end for each
}


/* child care and program year GUIDs are looked up in AddNewFees.vue */ 

async function upsertParentFees(req, res) {
  let body = req.body;
  
  //the front end sends over an array of objects. This loops through the array and sends a dynamics API request
  //for each object.
  body.forEach(async(feeGroup) => {

    let childCareCategory = `/ccof_childcare_categories(${feeGroup.childCareCategory})`;
    let programYear = `/ccof_program_years(${feeGroup.programYear})`;

    log.info(feeGroup.notes);
    log.info(feeGroup.ccfriApplicationGuid);

    let payload = {
      "ccof_frequency": feeGroup.feeFrequency,
      "ccof_ChildcareCategory@odata.bind": childCareCategory, 
      "ccof_ProgramYear@odata.bind": programYear, 
      //this is breaking it for some reason
    };

    Object.assign(payload, 
      {
        "ccof_apr": feeGroup.aprFee,
        "ccof_may": feeGroup.mayFee,
        "ccof_jun": feeGroup.junFee,
        "ccof_jul": feeGroup.julFee,
        "ccof_aug": feeGroup.augFee,
        "ccof_sep": feeGroup.sepFee,
        "ccof_oct": feeGroup.octFee,
        "ccof_nov": feeGroup.novFee,
        "ccof_dec": feeGroup.decFee,
        "ccof_jan": feeGroup.janFee,
        "ccof_feb": feeGroup.febFee,
        "ccof_mar": feeGroup.marFee,
      }
    );
    

    //payload = JSON.parse(JSON.stringify(payload));
    // log.info(payload);
    let url =  `_ccof_applicationccfri_value=${feeGroup.ccfriApplicationGuid},_ccof_childcarecategory_value=${feeGroup.childCareCategory},_ccof_programyear_value=${feeGroup.programYear} `;

    try {
      let response = await patchOperationWithObjectId('ccof_application_ccfri_childcarecategories', url, payload);
      //log.info('feeResponse', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      //log.info(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }

  }); //end forEach


  //if no notes, don't bother sending any requests. Even if left blank, front end will send over an empty string
  //so body[0].notes will always exist 
  if (body[0].notes){

    let payload = {
      "ccof_informationccfri" : body[0].notes
    };

    
    try {
      let response = patchOperationWithObjectId('ccof_applicationccfris', body[0].ccfriApplicationGuid, payload);
      log.info('notesRes', response);
      //return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }

  //if no closure dates, don't bother sending any requests
  //closure dates are the same for each age group - so pick the first group in the array and take data from there
  if (body[0].facilityClosureDates){
    try {
      let response = postClosureDates(body[0].facilityClosureDates, body[0].ccfriApplicationGuid, res);
      //log.info('datesRes', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }

}

async function postClosureDates(dates, ccfriApplicationGuid, res){

  //if the user selects an end date, create a start and end date. else, use the only date for start and end.
  dates.forEach(async (date) => {

    let payload = {
      "ccof_startdate": new Date (date.selectedDates[0]),
      "ccof_paidclosure": date.feesPaidWhileClosed,
      "ccof_enddate": date.selectedDates[1]? new Date (date.selectedDates[1]) :new Date (date.selectedDates[0]),
      "ccof_comment": date.message,
      "ccof_ApplicationCCFRI@odata.bind": `/ccof_applicationccfris(${ccfriApplicationGuid})`
    };

    try {
      let response = await postOperation('ccof_application_ccfri_closures', payload);
      log.info('feeResponse', response);
      return res.status(HttpStatus.CREATED).json(response);
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }

  });

}

module.exports = {
  updateCCFRIApplication,
  upsertParentFees,
  //getCCFRIApplication
};
