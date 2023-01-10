/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, minify} = require('./utils');
const { CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES, APPLICATION_STATUS_CODES } = require('../util/constants');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ECEWEApplicationMappings, ECEWEFacilityMappings, RFIApplicationMappings, DeclarationMappings } = require('../util/mapping/Mappings');
const { getCCFRIClosureDates } = require('./facility');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function renewCCOFApplication(req, res) {
  log.info('renew CCOF application called');
  try {
    const application = req.body;
    let payload = {
      'ccof_providertype': application.providerType == 'GROUP' ? ORGANIZATION_PROVIDER_TYPES.GROUP : ORGANIZATION_PROVIDER_TYPES.FAMILY,
      'ccof_applicationtype': CCOF_APPLICATION_TYPES.RENEW,
      'ccof_ProgramYear@odata.bind': `/ccof_program_years(${application.programYearId})`,
      'ccof_Organization@odata.bind': `/ccof_program_years(${application.organizationId})`
    };
    log.info('Payload for renew is: ', payload.toJSON);
    let applicationGuid = await postOperation('ccof_applications', payload);
    //After the application is created, get the application guid
    return res.status(HttpStatus.CREATED).json({ applicationId: applicationGuid });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getRFIApplication(req, res) {
  let query  = `ccof_rfipfis?$filter=(statuscode eq 1) and (_ccof_applicationccfri_value eq ${req.params.ccfriId})`;
  try {
    const response = await getOperation(query);
    console.log('response: ', minify(response.value));
    console.log('response length: ', response.value.length);
    if (response.value.length == 1) {
      return res.status(HttpStatus.OK).json(new MappableObjectForFront(response.value[0], RFIApplicationMappings));
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'No data'});
    }
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateRFIApplication(req, res) {
  try {
    const friApplication = new MappableObjectForBack(req.body, RFIApplicationMappings).toJSON();
    delete friApplication['_ccof_applicationccfri_value@OData.Community.Display.V1.FormattedValue'];
    delete friApplication._ccof_applicationccfri_value;
    delete friApplication.ccof_rfipfiid;
    let friApplicationResponse = await patchOperationWithObjectId('ccof_rfipfis', req.params.rfipfiid, friApplication);
    friApplicationResponse = new MappableObjectForFront(friApplicationResponse, RFIApplicationMappings);
    return res.status(HttpStatus.OK).json(friApplicationResponse);
  } catch (e) {
    log.error('updateRFIApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createRFIApplication(req, res) {
  try {
    const friApplication = new MappableObjectForBack(req.body, RFIApplicationMappings).toJSON();
    friApplication['ccof_applicationccfri@odata.bind'] = `/contacts(ccof_applicationccfris='${req.params.ccfriId}')`;
    log.info('createRFIApplication payload:', friApplication);
    const friApplicationGuid = await postOperation('ccof_rfipfis', friApplication);
    return res.status(HttpStatus.CREATED).json({ friApplicationGuid: friApplicationGuid });
  } catch (e) {
    log.error('createRFIApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


//creates or updates CCFRI application.
async function updateCCFRIApplication(req, res) {
  let body = req.body;
  let retVal= [];
  try {
    await Promise.all(body.map(async(facility) => {
      let payload = {
        'ccof_ccfrioptin' : facility.optInResponse,
        'ccof_Facility@odata.bind': `/accounts(${facility.facilityID})`,
        'ccof_Application@odata.bind': `/ccof_applications(${facility.applicationID})`
      };
      //log.info(payload);

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
      await sleep(100); //slow down the hits to dynamics.
      //log.info('res data:' , response);
    })); //end for each
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }

  return res.status(HttpStatus.OK).json(retVal);
}


/* child care and program year GUIDs are looked up in AddNewFees.vue */

async function upsertParentFees(req, res) {
  let body = req.body;

  log.info(body);
  let hasError = false;
  let theResponse = [];
  //the front end sends over an array of objects. This loops through the array and sends a dynamics API request
  //for each object.
  body.forEach(async(feeGroup) => {

    //getting a weird error regarding feeGroup.deleteMe is null - trying this out to fix it
    if (!feeGroup.deleteMe){
      log.info('nothing to delete');
    } else{
      try {
        let response = await deleteOperationWithObjectId('ccof_application_ccfri_childcarecategories', feeGroup.parentFeeGUID);
        log.info('delete feeGroup res:', response);
        theResponse.push(res.status(HttpStatus.OK).json(response));
      } catch (e) {
        //log.info(e);
        theResponse.push( res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status ));
      }
    }

    if (feeGroup.feeFrequency && !feeGroup.deleteMe){

      let childCareCategory = `/ccof_childcare_categories(${feeGroup.childCareCategory})`;
      let programYear = `/ccof_program_years(${feeGroup.programYear})`;

      // log.info(feeGroup.notes);
      // log.info(feeGroup.ccfriApplicationGuid);

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
      let url =  `_ccof_applicationccfri_value=${feeGroup.ccfriApplicationGuid},_ccof_childcarecategory_value=${feeGroup.childCareCategory},_ccof_programyear_value=${feeGroup.programYear} `;
      try {
        let response = await patchOperationWithObjectId('ccof_application_ccfri_childcarecategories', url, payload);
        //log.info('feeResponse', response);
        theResponse.push( res.status(HttpStatus.CREATED).json(response));
      } catch (e) {
        //log.info(e);
        theResponse.push(res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status ));
        hasError = true;
      }
    }
  }); //end forEach


  //if no notes, don't bother sending any requests. Even if left blank, front end will send over an empty string
  //so body[0].notes will always exist
  if (body[0].notes || body[0].ccof_formcomplete){

    let payload = {
      "ccof_informationccfri" : body[0].notes,
      "ccof_formcomplete" : body[0].ccof_formcomplete
    };
    try {
      let response = await patchOperationWithObjectId('ccof_applicationccfris', body[0].ccfriApplicationGuid, payload);
      log.info('notesRes', response);
      theResponse.push(res.status(HttpStatus.CREATED).json(response));
    } catch (e) {
      theResponse.push( res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status ));
      hasError = true;
    }
  }

  //if no closure dates, don't bother sending any requests
  //closure dates are the same for each age group - so pick the first group in the array and take data from there
  if (body[0].facilityClosureDates){
    log.info(body[0].facilityClosureDates);
    try {
      let response = await postClosureDates(body[0].facilityClosureDates, body[0].ccfriApplicationGuid, res);
      //log.info('datesRes', response);
      theResponse.push(res.status(HttpStatus.CREATED).json(response));
    } catch (e) {
      theResponse.push( res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status ));
      hasError = true;
    }
  }
  if (hasError) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(theResponse);
  } else {
    return res.status(HttpStatus.OK).json(theResponse);
  }

}

async function postClosureDates(dates, ccfriApplicationGuid, res){
  let retVal= [];

  //delete all the old closure dates from the application - otherwise we will get duplicates when we save
  let dynamicsClosureDates = await getCCFRIClosureDates(ccfriApplicationGuid);

  //don't bother trying to delete if there are no dates saved
  if (dynamicsClosureDates.length > 0){
    try{
      await Promise.all(dynamicsClosureDates.map(async (date) => {
        let response = await deleteOperationWithObjectId('ccof_application_ccfri_closures', date.closureDateId);
        //log.info(response);
      }));
    }catch (e){
      log.info(e);
      //return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
    }
  }

  try{
    //if the user selects an end date, create a start and end date. else, use the only date for start and end.
    await Promise.all(dates.map(async (date) => {

      let payload = {
        "ccof_startdate": new Date (date.formattedStartDate),
        "ccof_paidclosure": date.feesPaidWhileClosed,
        "ccof_enddate": date.formattedEndDate? new Date (date.formattedEndDate) :new Date (date.formattedStartDate),
        "ccof_comment": date.closureReason,
        "ccof_ApplicationCCFRI@odata.bind": `/ccof_applicationccfris(${ccfriApplicationGuid})`
      };

      try {
        let response = await postOperation('ccof_application_ccfri_closures', payload);
        log.info('feeResponse', response);
        retVal.push(response);
        //return res.status(HttpStatus.CREATED).json(response);
      } catch (e) {
        log.info(e);
        //return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
      }

      return res.status(HttpStatus.CREATED).json(retVal);

    }));

  } catch (e){
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );

  }



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
    log.verbose('updateECEWEApplication: payload', application);
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
      if (eceweApplicationId) {
        // send PATCH (update existing ECEWE facility)
        response = await patchOperationWithObjectId('ccof_applicationecewes', eceweApplicationId , facility);
      } else {
        if (facility.ccof_optintoecewe != null) {
          // send POST (create a new ECEWE facility)
          let operation = 'ccof_applicationecewes';
          response = await postOperation(operation, facility);
          facilities[key].eceweApplicationId = response;
        }
      }
    }
    return res.status(HttpStatus.OK).json({facilities: facilities});
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* Get the user declaration for a given application id. */
async function getDeclaration(req, res) {
  try {
    let operation = 'ccof_applications('+req.params.applicationId+')?$select=ccof_consent,ccof_submittedby,ccof_declarationastatus,ccof_declarationbstatus,statuscode';
    let declaration = await getOperation(operation);
    declaration = new MappableObjectForFront(declaration, DeclarationMappings);
    return res.status(HttpStatus.OK).json(declaration);
  } catch (e) {
    log.error('An error occurred while getting Declaration', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* Submit CCOF/CCFRI/ECEWE application */
async function submitApplication(req, res) {
  let declaration = new MappableObjectForBack(req.body, DeclarationMappings);
  declaration.data.statuscode = APPLICATION_STATUS_CODES.SUBMITTED;
  declaration = declaration.toJSON();
  try {
    let response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, declaration);
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
  renewCCOFApplication,
  getRFIApplication,
  createRFIApplication,
  updateRFIApplication,
  getDeclaration,
  submitApplication
};
