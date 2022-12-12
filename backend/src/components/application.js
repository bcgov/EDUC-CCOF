/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, getHttpHeader, minify,} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ECEWEApplicationMappings, ECEWEFacilityMappings } = require('../util/mapping/Mappings');
const { info } = require('./logger');

//creates or updates CCFRI application. 

async function updateCCFRIApplication(req, res) {
  let body = req.body;

  body.forEach(async(facility) => { 
    let payload = {
      'ccof_ccfrioptin' : '',
    };
    payload.ccof_ccfrioptin = facility.optInResponse;

    payload = JSON.parse(JSON.stringify(payload));
    log.info(payload);
    let url = `_ccof_application_value=${facility.applicationID},_ccof_facility_value=${facility.facilityID}`;

    try {
      let response = await patchOperationWithObjectId('ccof_applicationccfris', url, payload);
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
    

    payload = JSON.parse(JSON.stringify(payload));
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


  //if no notes, don't bother sending any requests
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
    log.info('@#$@$#$ = '+e);
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
      forBackFacilities[key].statuscode = 0;
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
        log.info('~~~~~~~~~~~~~~~~~ SEND PATCH')
        response = await patchOperationWithObjectId('ccof_applicationecewes', eceweApplicationId , facility);
      } else {
        if (facility.ccof_optintoecewe != null) {
          log.info('~~~~~~~~~~~~~~~~~ SEND POST')
          // send POST (create a new ECEWE facility)
          let operation = 'ccof_applicationecewes';
          response = await postOperation(operation, facility) ;
        }
        /*
        let forFrontFacilities = [];
        Object.values(eceweApp.data.facilities).forEach(value => forFrontFacilities.push(new MappableObjectForFront(value, ECEWEFacilityMappings).data));
        eceweApp.data.facilities = forFrontFacilities; 
        */
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
  updateECEWEFacilityApplication
};
