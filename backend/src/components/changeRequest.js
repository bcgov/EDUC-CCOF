'use strict';

const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ChangeRequestMappings } = require('../util/mapping/ChangeRequestMappings');
const { mapFacilityObjectForBack } = require('./facility');
const { ACCOUNT_TYPE, CCOF_STATUS_CODES, APPLICATION_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES, CHANGE_REQUEST_EXTERNAL_STATUS_CODES } = require('../util/constants');

const HttpStatus = require('http-status-codes');

const { getOperationWithObjectId, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, getChangeActionDocument, postChangeActionDocument, getLabelFromValue } = require('./utils');

const CHANGE_REQUEST_TYPES_FRONT = Object.freeze({
  NEW_FACILITY: 'NEW_FACILITY',
  PDF_CHANGE: 'PDF_CHANGE',
});


function mapChangeRequestForBack(data, changeType) {
  let changeRequestForBack = new MappableObjectForBack(data, ChangeRequestMappings).toJSON();
  changeRequestForBack['ccof_program_year@odata.bind'] = `/ccof_program_years(${data.programYearId})`;
  delete changeRequestForBack._ccof_program_year_value;

  changeRequestForBack['ccof_Application@odata.bind'] = `/ccof_applications(${data.applicationId})`;
  delete changeRequestForBack._ccof_application_value;

  changeRequestForBack['ccof_change_action_change_request'] = [
    {
      ccof_changetype: changeType === CHANGE_REQUEST_TYPES_FRONT.PDF_CHANGE ? 100000013 : 100000005
    }
  ];
  if (changeType === CHANGE_REQUEST_TYPES_FRONT.NEW_FACILITY) {
    changeRequestForBack.ccof_provider_type = 100000000; //New facilities are only available for GROUP provider types
  }
  return changeRequestForBack;
}

function mapChangeRequestObjectForFront(data) {
  return new MappableObjectForFront(data, ChangeRequestMappings).toJSON();
}

// get Change Request
async function getChangeRequest(req, res) {
  log.info('get changeRequest called');

  try {
    let changeRequest = await getOperationWithObjectId('ccof_change_requests', req.params.changeRequestId);
    changeRequest = mapChangeRequestObjectForFront(changeRequest);
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
async function createChangeRequest(req, res, changeType) {
  log.info('createChangeRequest called');
  try {
    let changeRequest = req.body;
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

module.exports = {
  getChangeRequest,
  createChangeRequest,
  createChangeRequestFacility,
  CHANGE_REQUEST_TYPES_FRONT,
  deleteChangeRequest,
  getChangeRequestDocs,
  saveChangeRequestDocs,
  updateChangeRequest
};
