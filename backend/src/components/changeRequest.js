'use strict';

const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { ChangeRequestMappings, ChangeActionRequestMappings, MtfiMappings } = require('../util/mapping/ChangeRequestMappings');

const { mapFacilityObjectForBack } = require('./facility');
const { ACCOUNT_TYPE, CCOF_STATUS_CODES, CHANGE_REQUEST_TYPES, CHANGE_REQUEST_EXTERNAL_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');

const HttpStatus = require('http-status-codes');

const { getLabelFromValue, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, getChangeActionDocument, postChangeActionDocument } = require('./utils');


function mapChangeRequestForBack(data, changeType) {
  let changeRequestForBack = new MappableObjectForBack(data, ChangeRequestMappings).toJSON();
  changeRequestForBack['ccof_program_year@odata.bind'] = `/ccof_program_years(${data.programYearId})`;
  delete changeRequestForBack._ccof_program_year_value;

  changeRequestForBack['ccof_Application@odata.bind'] = `/ccof_applications(${data.applicationId})`;
  delete changeRequestForBack._ccof_application_value;
  changeRequestForBack['ccof_change_action_change_request'] = [
    {
      ccof_changetype: changeType
    }
  ];
  if (changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY) {
    changeRequestForBack.ccof_provider_type = 100000000; //New facilities are only available for GROUP provider types
  }
  return changeRequestForBack;
}


// get Change Action
async function getChangeActionDetails(changeActionId, joiningTable, mapper) {
  if (joiningTable) {
    try {
      let operation = `ccof_change_actions(${changeActionId})?$select=${joiningTable}&$expand=${joiningTable}($select=${getMappingString(mapper)})`;
      let changeActionDetails = await getOperation(operation);
      let details = changeActionDetails[joiningTable];
      let retVal = [];
      details?.forEach(el => retVal.push(new MappableObjectForFront(el, mapper).toJSON()));
      return retVal;
    } catch (e) {
      log.error('Unable to get change action details',e);
    }
  } else {
    return undefined;
  }
}


async function mapChangeRequestObjectForFront(data) {
  let retVal = new MappableObjectForFront(data, ChangeRequestMappings).toJSON();
  let changeList = [];
  await Promise.all(  retVal.changeActions?.map(async (el) =>  {
    let changeAction = new MappableObjectForFront(el, ChangeActionRequestMappings).toJSON();
    if (changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE) {
      const mtfi = await getChangeActionDetails(changeAction.changeActionId, 'ccof_change_request_mtfi_Change_Action', MtfiMappings );
      changeAction.mtfi = mtfi;
    }
    changeList.push(changeAction);
  }));
  retVal.changeActions = changeList;
  log.info('change actions: ', retVal);

  return retVal;
}


// get Change Request
async function getChangeRequest(req, res) {
  log.info('get changeRequest called');

  try {
    let operation = `ccof_change_requests(${req.params.changeRequestId})?$expand=ccof_change_action_change_request($select=ccof_change_actionid,statuscode,ccof_changetype)`;
    let changeRequest = await getOperation(operation);
    changeRequest = await mapChangeRequestObjectForFront(changeRequest);
    changeRequest.providerType = getLabelFromValue(changeRequest.providerType , ORGANIZATION_PROVIDER_TYPES);
    changeRequest.externalStatus = getLabelFromValue(changeRequest.externalStatus , CHANGE_REQUEST_EXTERNAL_STATUS_CODES);
    log.info(changeRequest);
    log.info(CHANGE_REQUEST_EXTERNAL_STATUS_CODES);
    return res.status(HttpStatus.OK).json(changeRequest);
  } catch (e) {
    console.log('e', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateChangeRequest(req, res){
  let changeRequest = req.body;
  //changeRequest.externalStatus = CHANGE_REQUEST_EXTERNAL_STATUS_CODES.externalStatus;
  changeRequest = new MappableObjectForBack(changeRequest, ChangeRequestMappings);
  changeRequest = changeRequest.toJSON();

  try {
    log.verbose('update change Request: payload', changeRequest);
    let response = await patchOperationWithObjectId('ccof_change_requests', req.params.changeRequestId, changeRequest);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

// create Change Request
async function createChangeRequest(req, res) {
  log.info('createChangeRequest called');

  try {
    let changeRequest = req.body;
    let changeType = changeRequest.changeType;
    //log.info('change type', changeType);
    //this is kind of ugly, replace with a better mapping function
    if (changeType === 'PARENT_FEE_CHANGE'){
      changeType = CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE;
    }
    else if(changeType === 'NEW_FACILITY'){
      changeType = CHANGE_REQUEST_TYPES.NEW_FACILITY;
    }
    else if(changeType === 'PDF_CHANGE'){
      changeType = CHANGE_REQUEST_TYPES.PDF_CHANGE;
    }
    log.info('change type', changeType);
    changeRequest = mapChangeRequestForBack(changeRequest, changeType);
    const changeRequestId = await postOperation('ccof_change_requests', changeRequest);
    let operation = `ccof_change_requests(${changeRequestId})?$select=ccof_change_requestid&$expand=ccof_change_action_change_request($select=ccof_change_actionid,statuscode)`;
    const payload = await getOperation(operation);
    let changeActionId = undefined;
    if (payload && payload.ccof_change_action_change_request?.length > 0) {
      changeActionId = payload.ccof_change_action_change_request[0].ccof_change_actionid;
    }
    return res.status(HttpStatus.CREATED).json({
      changeRequestId: changeRequestId,
      changeActionId: changeActionId,
    });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function buildNewFacilityPayload(req) {
  let facility = req.body;

  facility = mapFacilityObjectForBack(facility);
  facility['ccof_accounttype'] = ACCOUNT_TYPE.FACILITY;
  facility['parentaccountid@odata.bind'] = `/accounts(${req.body.organizationId})`,
  facility['ccof_ccof_change_request_new_facility_facility'] = [
    {
      'ccof_change_action@odata.bind': `/ccof_change_actions(${req.params.changeActionId})`,
    },
  ];
  facility['ccof_application_basefunding_Facility'] = [
    {
      'ccof_Application@odata.bind': `/ccof_applications(${req.body.applicationId})`,
    }
  ];

  return facility;
}

async function updateChangeRequestNewFacility(changeRequestFacilityId, payload){
  try{
    let response = await patchOperationWithObjectId('ccof_change_request_new_facilities', changeRequestFacilityId, payload);
    return response;
  }
  catch(e){
    log.error('error', e);
    return e.data ? e.data : e?.status;
  }
}

async function createChangeRequestFacility(req, res) {
  let facility = buildNewFacilityPayload(req);
  try {
    const facilityGuid = await postOperation('accounts', facility);
    //After the 'ChangeActionNewFacility' entity is created, grab the guid
    let operation = 'accounts(' + facilityGuid + ')?$select=accountid&$expand=ccof_ccof_change_request_new_facility_facility($select=ccof_change_request_new_facilityid,statuscode),ccof_application_basefunding_Facility($select=ccof_application_basefundingid,statuscode)';
    let payload = await getOperation(operation);
    console.log(payload);
    let changeRequestNewFacilityId = undefined;
    let ccofBaseFundingId = undefined;
    let ccofBaseFundingStatus = undefined;
    if ( payload?.ccof_application_basefunding_Facility?.length > 0) {
      ccofBaseFundingId = payload.ccof_application_basefunding_Facility[0].ccof_application_basefundingid;
      ccofBaseFundingStatus = getLabelFromValue(payload.ccof_application_basefunding_Facility[0].statuscode, CCOF_STATUS_CODES);
    }
    if ( payload?.ccof_ccof_change_request_new_facility_facility?.length > 0) {
      changeRequestNewFacilityId = payload.ccof_ccof_change_request_new_facility_facility[0].ccof_change_request_new_facilityid;
    }
    if (ccofBaseFundingId && changeRequestNewFacilityId) {
      await updateChangeRequestNewFacility(changeRequestNewFacilityId,
        {
          "ccof_CCOF@odata.bind": `/ccof_application_basefundings(${ccofBaseFundingId})`
        }
      );
    }
    return res.status(HttpStatus.CREATED).json({facilityId: facilityGuid, changeRequestNewFacilityId: changeRequestNewFacilityId, ccofBaseFundingId: ccofBaseFundingId, ccofBaseFundingStatus: ccofBaseFundingStatus});
  } catch (e) {
    console.log(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function deleteChangeRequest(req, res){

  let { changeRequestId } = req.params;
  log.verbose(changeRequestId);

  try{
    await deleteOperationWithObjectId('ccof_change_requests', changeRequestId);
    return res.status(HttpStatus.OK).end();
  }catch(e){
    log.info(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

//TODO: need some mapping here prob but lets figure out Sukanyas component first
async function getChangeRequestDocs(req, res){

  let { changeRequestId } = req.params;
  log.verbose(changeRequestId);

  try{
    let response = await getChangeActionDocument(changeRequestId);

    log.verbose(response.value);
    return res.status(HttpStatus.OK).json(response.value);
  }catch(e){
    log.info(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function saveChangeRequestDocs(req, res) {
  try {
    let documents = req.body;
    //log.info(documents);
    for (let document of documents) {
      await postChangeActionDocument(document);
    }
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function buildMTFIFacilityPayload(facility) {
  // let payload = new MappableObjectForBack(facility, MtfiMappings);
  // Program Year table has no logical name to bind??
  // payload['ccof_programyear@odata.bind'] = `/accounts(${facility.ccfriApplicationId})`;
  let payload = {
    // 'ccof_FacilityId': facility.facilityId,
    'ccof_Change_Action@odata.bind': `/ccof_change_actions(${facility.changeActionId})`,
    'ccof_Organization@odata.bind': `/accounts(${facility.organizationId})`,
    'ccof_facility@odata.bind': `/accounts(${facility.facilityId})`,
    // 'ccof_ccfri@odata.bind': `/ccof_applicationccfris(${facility.ccfriApplicationId})`,
    // 'ccof_ccfri_facility@odata.bind': `/ccof_adjudication_ccfri_facilitys(${facility.ccfriFacilityId})`,
    'ccof_ProgramYear@odata.bind': `/ccof_program_years(${facility.programYearId})`,
    // 'ccof_change_request_mtfi_application_ccfri': [
    //   {
    //       'ccof_ccfrioptin': 1,
    //       'ccof_Facility@odata.bind': '/accounts(d524bae2-0d2c-ee11-bdf4-000d3af4865d)',
    //       'ccof_Application@odata.bind': '/ccof_applications(5733c527-9722-ee11-9967-000d3a09d699)',
    //   }
    // ],
  };
  return payload;
}


async function createMTFIFacilities(req, res) {
  let retVal = [];
  let facilities = req.body;
  console.log('createMTFIFacilities ========================== ');
  console.log(facilities);
  try {
    await Promise.all(facilities.map(async (facility) => {
      let payload = buildMTFIFacilityPayload(facility);
      console.log(payload);
      let response = await postOperation('ccof_change_request_mtfis', payload);
      retVal.push(response);
    }));
    return res.status(HttpStatus.CREATED).json(retVal);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getChangeRequest,
  createChangeRequest,
  createChangeRequestFacility,
  deleteChangeRequest,
  getChangeRequestDocs,
  saveChangeRequestDocs,
  updateChangeRequest,
  createMTFIFacilities
};
