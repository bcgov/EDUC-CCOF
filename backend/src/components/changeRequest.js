'use strict';

const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { ChangeRequestMappings, ChangeActionRequestMappings, MtfiMappings, NewFacilityMappings } = require('../util/mapping/ChangeRequestMappings');
const { UserProfileBaseCCFRIMappings } = require('../util/mapping/Mappings');

const { mapFacilityObjectForBack } = require('./facility');
const { printPdf } = require('./application');
const { ACCOUNT_TYPE, CCOF_STATUS_CODES, CHANGE_REQUEST_TYPES, CHANGE_REQUEST_EXTERNAL_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');

const HttpStatus = require('http-status-codes');

const { getLabelFromValue, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, getChangeActionDocument, postChangeActionDocument, postChangeRequestSummaryDocument} = require('./utils');
const {getFileExtension, convertHeicDocumentToJpg} = require('../util/uploadFileUtils');

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

// get Change Action details.  depending on the entity, we may want to get details 2 level below change action
async function getChangeActionDetails(changeActionId, changeDetailEntity, changeDetailMapper, joiningTable, joiningTableMapping) {
  if (changeActionId && changeDetailEntity && changeDetailMapper) {
    try {
      let operation;
      if (joiningTable) {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'&$expand=${joiningTable}($select=${getMappingString(joiningTableMapping)})`;
      } else {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'`;
      }

      let changeActionDetails = await getOperation(operation);
      let details = changeActionDetails?.value;
      let retVal = [];
      details?.forEach(el => {
        let data = new MappableObjectForFront(el, changeDetailMapper).toJSON();
        let joinData = undefined;
        if (joiningTable) {
          joinData = new MappableObjectForFront(el[joiningTable], joiningTableMapping).toJSON();
        }
        retVal.push({...data, ...joinData});
      });
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
      const mtfi = await getChangeActionDetails(changeAction.changeActionId, 'ccof_change_request_mtfis', MtfiMappings, 'ccof_CCFRI', UserProfileBaseCCFRIMappings );
      changeAction.mtfi = mtfi;
    } else if (changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY) {
      const newFacilities = await getChangeActionDetails(changeAction.changeActionId, 'ccof_change_request_new_facilities', NewFacilityMappings);
      changeAction.newFacilities = newFacilities;
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
    let operation = `ccof_change_requests(${req.params.changeRequestId})?$expand=ccof_change_action_change_request($select=ccof_change_actionid,statuscode,ccof_changetype,createdon)`;
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

    //is change req complete ? (status 2 i think )

    if (changeRequest.ccof_externalstatus == 2){
      const pdfPayload = await printPdf(req);
      await postChangeRequestSummaryDocument(pdfPayload);
    }

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

async function createChangeAction(req, res, changeType) {
  log.info('createChangeAction called');
  try {
    const payload = {
      ccof_changetype: changeType,
      'ccof_change_request@odata.bind': `ccof_change_requests(${req.params.changeRequestId})`
    };
    const changeActionId = await postOperation('ccof_change_actions', payload);
    return res.status(HttpStatus.CREATED).json({
      changeRequestId: req.params.changeRequestId,
      changeActionId: changeActionId,
      changeType: changeType
    });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteChangeAction(req, res) {
  log.info('deleteChangeAction called - changeActionId = ' + req.params.changeActionId);
  try {
    await deleteOperationWithObjectId('ccof_change_actions', req.params.changeActionId);
    return res.status(HttpStatus.OK).end();
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

async function updateChangeRequestNewFacility(changeRequestNewFacilityId, payload){
  try{
    let response = await patchOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId, payload);
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
          'ccof_CCOF@odata.bind': `/ccof_application_basefundings(${ccofBaseFundingId})`
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
    for (let document of documents) {
      let documentClone = document;
      if (getFileExtension(documentClone.filename) === 'heic' ) {
        log.verbose(`saveChangeRequestDocs :: heic detected for file name ${documentClone.filename} starting conversion`);
        documentClone = await convertHeicDocumentToJpg(documentClone);
      }

      await postChangeActionDocument(documentClone);
    }
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getChangeRequestMTFIByCcfriId(req, res){
  try{
    log.info('getChangeRequestMTFIByCcfriId - ccfriId = ', req.params.ccfriId);
    let operation = `ccof_applicationccfris(${req.params.ccfriId})?$expand=ccof_change_request_mtfi_application_ccfri`;
    let response = await getOperation(operation);
    let mtfiDetails = [];
    response?.ccof_change_request_mtfi_application_ccfri?.forEach(mtfiFacility => {
      mtfiDetails.push(new MappableObjectForFront(mtfiFacility, MtfiMappings).toJSON());
    });
    return res.status(HttpStatus.OK).json(mtfiDetails);
  }
  catch (e){
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteChangeRequestMTFI(req, res){
  try{
    log.info('deleteChangeRequestMTFI - mtfiId = ', req.params.mtfiId);
    let response = await deleteOperationWithObjectId('ccof_change_request_mtfis', req.params.mtfiId);
    return res.status(HttpStatus.OK).json(response);
  }
  catch (e){
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateChangeRequestMTFI(req, res){
  try{
    let response = await patchOperationWithObjectId('ccof_change_request_mtfis', req.params.mtfiId, req.body);
    return res.status(HttpStatus.OK).json();
  }
  catch(e){
    log.error('error', e);
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
  createChangeAction,
  updateChangeRequestMTFI,
  deleteChangeAction,
  getChangeRequestMTFIByCcfriId,
  deleteChangeRequestMTFI,
};
