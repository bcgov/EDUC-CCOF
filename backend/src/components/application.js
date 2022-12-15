/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, getOperationWithObjectId, getHttpHeader, minify,} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ECEWEApplicationMappings, ECEWEFacilityMappings } = require('../util/mapping/Mappings');
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
  let retVal= [];
  await Promise.all(body.map(async(facility) => { 
    let payload = {
      'ccof_ccfrioptin' : facility.optInResponse,
      'ccof_Facility@odata.bind': `/accounts(${facility.facilityID})`,
      'ccof_Application@odata.bind': `/ccof_applications(${facility.applicationID})`
    };
    log.info(payload);
    try {
      let response = undefined;
      if (facility.ccfriApplicationId) {
        response = await patchOperationWithObjectId('ccof_applicationccfris', facility.ccfriApplicationId, payload);
        retVal.push(response);
      } else {
        response = await postOperation('ccof_applicationccfris', payload);
        retVal.push({
          facilityId: facility.facilityID,
          applicationId: facility.applicationID,
          ccfriApplicationId: response,
          ccof_ccfrioptin: facility.optInResponse,
        });
      }
      log.info('res data:' , response);
    } catch (e) {
      log.error(e);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  })); //end for each
  return res.status(HttpStatus.OK).json(retVal);
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
    

    log.info(payload);
    let url =  `_ccof_applicationccfri_value=${feeGroup.ccfriApplicationGuid},_ccof_childcarecategory_value=${feeGroup.childCareCategory},_ccof_programyear_value=${feeGroup.programYear} `;

    log.info("SUPER URL:" , url);
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

async function getECEWEApplication(req, res) {
  try {
    let operation = 'ccof_applications('+req.params.applicationId+')?$select=ccof_ecewe_optin,ccof_ecewe_employeeunion,ccof_ecewe_selecttheapplicablefundingmodel,ccof_ecewe_confirmation&$expand=ccof_ccof_application_ccof_applicationecewe_application($select=ccof_name,_ccof_facility_value,ccof_optintoecewe,statuscode)';
    let eceweApp = await getOperation(operation);
    eceweApp = new MappableObjectForFront(eceweApp, ECEWEApplicationMappings);
    let forFrontFacilities = [];
    Object.values(eceweApp.data.facilities).forEach(value => forFrontFacilities.push(new MappableObjectForFront(value, ECEWEFacilityMappings).data));
    eceweApp.data.facilities = forFrontFacilities;
    return res.status(HttpStatus.OK).json(eceweApp);
  } catch (e) {
    log.error('An error occurred while getting ECEWEApplication', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEApplication(req, res) {
  let application = req.body;
  application = new MappableObjectForBack(application, ECEWEApplicationMappings);
  application = application.toJSON();
  application.ccof_ecewe_employeeunion = (application.ccof_ecewe_optin==0)?null:application.ccof_ecewe_employeeunion;
  try {
    log.info(application);
    let response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, application);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEFacilityApplication(req, res) {
  let facilities = req.body;
  let forBackFacilities = [];
  let response;
  Object.values(facilities).forEach(value => forBackFacilities.push(new MappableObjectForBack(value, ECEWEFacilityMappings).data));
  let eceweApplicationId;
  
  try {
    for (let key in forBackFacilities) {
      // add join attributes for application and facility
      forBackFacilities[key]['ccof_application@odata.bind'] = '/ccof_applications('+req.params.applicationId+')';
      forBackFacilities[key]['ccof_Facility@odata.bind'] = '/accounts('+forBackFacilities[key]._ccof_facility_value+')';
      eceweApplicationId = forBackFacilities[key].ccof_applicationeceweid;
      // remove attributes that are already used in payload join (above) and not needed.
      delete forBackFacilities[key].ccof_applicationeceweid;
      delete forBackFacilities[key]._ccof_facility_value;

      let facility = forBackFacilities[key];
      log.info('TEMP FACLITY JSON = '+JSON.stringify(facility, null, 2));

      if (eceweApplicationId) {
        // send PATCH (update existing ECEWE facility)
        response = await patchOperationWithObjectId('ccof_applicationecewes', eceweApplicationId , facility);
      } else {
        if (facility.ccof_optintoecewe != null) {
          // send POST (create a new ECEWE facility)
          let operation = 'ccof_applicationecewes';
          response = await postOperation(operation, facility);
        }
      }
    }
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  updateCCFRIApplication,
  upsertParentFees,
  getECEWEApplication,
  updateECEWEApplication,
  updateECEWEFacilityApplication,

  //getCCFRIApplication
};
