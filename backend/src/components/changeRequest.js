'use strict';

const log = require('./logger');
const { getUserGuid } = require('./utils');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { ChangeActionClosureMappings, ChangeActionRequestMappings, ChangeRequestMappings, MtfiMappings, NewFacilityMappings } = require('../util/mapping/ChangeRequestMappings');
const { DocumentsMappings, UserProfileBaseCCFRIMappings, UserProfileBaseFundingMappings, UserProfileECEWEMappings } = require('../util/mapping/Mappings');
const { ChangeRequestUnlockMapping } = require('../util/mapping/ChangeRequestMappings');

const { mapFacilityObjectForBack } = require('./facility');
const { ACCOUNT_TYPE, CCOF_STATUS_CODES, CHANGE_REQUEST_TYPES, CHANGE_REQUEST_EXTERNAL_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES, CCFRI_STATUS_CODES } = require('../util/constants');

const HttpStatus = require('http-status-codes');

const { getLabelFromValue, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, getChangeActionDocument, postChangeActionDocument } = require('./utils');
const { buildFilterQuery } = require('./../components/utils');

function mapChangeRequestForBack(data, changeType) {
  const changeRequestForBack = new MappableObjectForBack(data, ChangeRequestMappings).toJSON();
  changeRequestForBack['ccof_program_year@odata.bind'] = `/ccof_program_years(${data.programYearId})`;
  delete changeRequestForBack._ccof_program_year_value;

  changeRequestForBack['ccof_Application@odata.bind'] = `/ccof_applications(${data.applicationId})`;
  delete changeRequestForBack._ccof_application_value;
  changeRequestForBack['ccof_change_action_change_request'] = [
    {
      ccof_changetype: changeType,
    },
  ];
  if (changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY) {
    changeRequestForBack.ccof_provider_type = 100000000; //New facilities are only available for GROUP provider types
  }
  return changeRequestForBack;
}

async function getChangeActionNewFacilitityDetails(changeActionId) {
  if (changeActionId) {
    try {
      const operation = `ccof_change_request_new_facilities?$filter=_ccof_change_action_value eq '${changeActionId}'&$expand=ccof_ccfri($select=${getMappingString(
        UserProfileBaseCCFRIMappings,
      )}),ccof_ecewe($select=${getMappingString(UserProfileECEWEMappings)}),ccof_CCOF($select=${getMappingString(UserProfileBaseFundingMappings)})`;
      const changeActionDetails = await getOperation(operation);
      const details = changeActionDetails?.value;
      const retVal = [];
      details?.forEach((el) => {
        const data = new MappableObjectForFront(el, NewFacilityMappings).toJSON();
        data.ccfri = new MappableObjectForFront(el.ccof_ccfri, UserProfileBaseCCFRIMappings).toJSON();
        data.ecewe = new MappableObjectForFront(el.ccof_ecewe, UserProfileECEWEMappings).toJSON();
        data.baseFunding = new MappableObjectForFront(el.ccof_CCOF, UserProfileBaseFundingMappings).toJSON();
        retVal.push(data);
      });
      return retVal;
    } catch (e) {
      log.error('Unable to get change action details', e);
    }
  } else {
    return undefined;
  }
}

// get Change Action details.  depending on the entity, we may want to get details 2 level below change action
async function getChangeActionDetails(changeActionId, changeDetailEntity, changeDetailMapper, joiningTable, joiningTableMapping) {
  if (changeActionId && changeDetailEntity && changeDetailMapper) {
    try {
      let operation;
      if (joiningTable) {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'&$expand=${joiningTable}($select=${getMappingString(
          joiningTableMapping,
        )})`;
      } else {
        operation = `${changeDetailEntity}?$select=${getMappingString(changeDetailMapper)}&$filter=_ccof_change_action_value eq '${changeActionId}'`;
      }

      const changeActionDetails = await getOperation(operation);
      const details = changeActionDetails?.value;
      const retVal = [];
      details?.forEach((el) => {
        const data = new MappableObjectForFront(el, changeDetailMapper).toJSON();
        let joinData = undefined;
        if (joiningTable) {
          joinData = new MappableObjectForFront(el[joiningTable], joiningTableMapping).toJSON();
        }
        retVal.push({ ...data, ...joinData });
      });
      return retVal;
    } catch (e) {
      log.error('Unable to get change action details', e);
    }
  } else {
    return undefined;
  }
}

async function mapChangeRequestObjectForFront(data) {
  const retVal = new MappableObjectForFront(data, ChangeRequestMappings).toJSON();

  const changeList = [];
  await Promise.all(
    retVal.changeActions?.map(async (el) => {
      let changeAction = new MappableObjectForFront(el, ChangeActionRequestMappings).toJSON();
      if (changeAction.changeType == CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE) {
        const mtfi = await getChangeActionDetails(changeAction.changeActionId, 'ccof_change_request_mtfis', MtfiMappings, 'ccof_CCFRI', UserProfileBaseCCFRIMappings);
        mtfi?.forEach((item) => {
          item.ccfriStatus = getLabelFromValue(item.ccfriStatus, CCFRI_STATUS_CODES, 'NOT STARTED');
        });
        changeAction.mtfi = mtfi;
      } else if (changeAction.changeType == CHANGE_REQUEST_TYPES.NEW_FACILITY) {
        const newFacilities = await getChangeActionNewFacilitityDetails(changeAction.changeActionId);
        changeAction.newFacilities = newFacilities;
      }
      const unlockVals = new MappableObjectForFront(el, ChangeRequestUnlockMapping).toJSON();
      changeAction = { ...changeAction, ...unlockVals };
      changeList.push(changeAction);
    }),
  );
  retVal.changeActions = changeList;
  return retVal;
}

// get Change Request
async function getChangeRequest(req, res) {
  try {
    const operation = `ccof_change_requests(${req.params.changeRequestId})?$expand=ccof_change_action_change_request($select=ccof_change_actionid,statuscode,ccof_changetype,createdon,ccof_unlock_ecewe,ccof_unlock_ccof,ccof_unlock_supporting_document,ccof_unlock_other_changes_document,ccof_unlock_change_request,ccof_unlock_licence_upload)`;
    let changeRequest = await getOperation(operation);
    changeRequest = await mapChangeRequestObjectForFront(changeRequest);
    changeRequest.providerType = getLabelFromValue(changeRequest.providerType, ORGANIZATION_PROVIDER_TYPES);
    changeRequest.externalStatus = getLabelFromValue(changeRequest.externalStatus, CHANGE_REQUEST_EXTERNAL_STATUS_CODES);
    return res.status(HttpStatus.OK).json(changeRequest);
  } catch (e) {
    console.log('e', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateChangeRequest(req, res) {
  let changeRequest = req.body;
  changeRequest = new MappableObjectForBack(changeRequest, ChangeRequestMappings);
  changeRequest = changeRequest.toJSON();

  try {
    log.verbose('update change Request: payload', changeRequest);
    const response = await patchOperationWithObjectId('ccof_change_requests', req.params.changeRequestId, changeRequest);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createRawChangeRequest(req) {
  try {
    let changeRequest = req.body;
    let changeType = changeRequest.changeType;
    //this is kind of ugly, replace with a better mapping function
    if (changeType === 'PARENT_FEE_CHANGE') {
      changeType = CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE;
    } else if (changeType === 'NEW_FACILITY') {
      changeType = CHANGE_REQUEST_TYPES.NEW_FACILITY;
    } else if (changeType === 'PDF_CHANGE') {
      changeType = CHANGE_REQUEST_TYPES.PDF_CHANGE;
    }
    changeRequest = mapChangeRequestForBack(changeRequest, changeType);
    const changeRequestId = await postOperation('ccof_change_requests', changeRequest);
    const operation = `ccof_change_requests(${changeRequestId})?$select=ccof_change_requestid&$expand=ccof_change_action_change_request($select=ccof_change_actionid,statuscode)`;
    const payload = await getOperation(operation);
    let changeActionId = undefined;
    if (payload && payload.ccof_change_action_change_request?.length > 0) {
      changeActionId = payload.ccof_change_action_change_request[0].ccof_change_actionid;
    }
    return {
      changeRequestId: changeRequestId,
      changeActionId: changeActionId,
    };
  } catch (e) {
    log.error('error', e);
    throw e;
  }
}

async function createChangeRequest(req, res) {
  try {
    const rawChangeRequest = await createRawChangeRequest(req);
    return res.status(HttpStatus.CREATED).json(rawChangeRequest);
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createChangeAction(req, res, changeType) {
  try {
    const payload = {
      ccof_changetype: changeType,
      'ccof_change_request@odata.bind': `ccof_change_requests(${req.params.changeRequestId})`,
    };
    const changeActionId = await postOperation('ccof_change_actions', payload);
    return res.status(HttpStatus.CREATED).json({
      changeRequestId: req.params.changeRequestId,
      changeActionId: changeActionId,
      changeType: changeType,
    });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteChangeAction(req, res) {
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
  (facility['parentaccountid@odata.bind'] = `/accounts(${req.body.organizationId})`),
    (facility['ccof_ccof_change_request_new_facility_facility'] = [
      {
        'ccof_change_action@odata.bind': `/ccof_change_actions(${req.params.changeActionId})`,
      },
    ]);
  facility['ccof_application_basefunding_Facility'] = [
    {
      'ccof_Application@odata.bind': `/ccof_applications(${req.body.applicationId})`,
    },
  ];

  return facility;
}

async function updateChangeRequestNewFacility(changeRequestNewFacilityId, payload) {
  try {
    const response = await patchOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId, payload);
    return response;
  } catch (e) {
    log.error('error', e);
    return e.data ? e.data : e?.status;
  }
}

function mapChangeActionClosureObjectForBack(req) {
  const changeActionClosure = req.body;
  const changeActionClosureMapp = new MappableObjectForBack(changeActionClosure, ChangeActionClosureMappings).toJSON();
  changeActionClosureMapp['ccof_program_year@odata.bind'] = `/ccof_program_years(${changeActionClosure.programYearId})`;
  changeActionClosureMapp['ccof_facility@odata.bind'] = `/accounts(${changeActionClosure.facilityId})`;
  changeActionClosureMapp['ccof_organization@odata.bind'] = `/accounts(${changeActionClosure.organizationId})`;
  changeActionClosureMapp['ccof_request_raised_by@odata.bind'] = `/contacts(ccof_userid='${getUserGuid(req)}')`;
  delete changeActionClosureMapp._ccof_closure_value;
  delete changeActionClosureMapp._ccof_facility_value;
  delete changeActionClosureMapp._ccof_program_year_value;
  return changeActionClosureMapp;
}

async function createClosureChangeRequest(req, res) {
  try {
    const createChangeRequestResponse = await createRawChangeRequest(req);
    const changeActionClosure = mapChangeActionClosureObjectForBack(req);
    changeActionClosure['ccof_change_action@odata.bind'] = `/ccof_change_actions(${createChangeRequestResponse.changeActionId})`;
    if (req.body.changeType !== CHANGE_REQUEST_TYPES.NEW_CLOSURE) {
      changeActionClosure['ccof_closure@odata.bind'] = `/ccof_application_ccfri_closures(${req.body.closureId})`;
    }
    const asyncOperations = [postOperation('ccof_change_action_closures', changeActionClosure), getOperation(`ccof_change_requests(${createChangeRequestResponse.changeRequestId})?$select=ccof_name`)];

    if (req.body.changeType !== CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE) {
      req.body.documents?.forEach((document) => {
        const mappedDocument = new MappableObjectForBack(document, DocumentsMappings).toJSON();
        mappedDocument.ccof_change_action_id = createChangeRequestResponse.changeActionId;
        asyncOperations.push(postChangeActionDocument(mappedDocument));
      });
    }
    const asyncOperationResponses = await Promise.all(asyncOperations);
    await patchOperationWithObjectId('ccof_change_requests', createChangeRequestResponse.changeRequestId, { ccof_externalstatus: CHANGE_REQUEST_EXTERNAL_STATUS_CODES.SUBMITTED });
    return res.status(HttpStatus.CREATED).json({ changeActionClosureId: asyncOperationResponses[0], changeRequestReferenceId: asyncOperationResponses[1].ccof_name });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createChangeRequestFacility(req, res) {
  const facility = buildNewFacilityPayload(req);
  try {
    const facilityGuid = await postOperation('accounts', facility);
    //After the 'ChangeActionNewFacility' entity is created, grab the guid
    let operation =
      'accounts(' +
      facilityGuid +
      ')?$select=accountid&$expand=ccof_ccof_change_request_new_facility_facility($select=ccof_change_request_new_facilityid,statuscode),ccof_application_basefunding_Facility($select=ccof_application_basefundingid,statuscode)';
    const payload = await getOperation(operation);
    let changeRequestNewFacilityId;
    let ccofBaseFundingId;
    let ccofBaseFundingStatus;
    if (payload?.ccof_application_basefunding_Facility?.length > 0) {
      ccofBaseFundingId = payload.ccof_application_basefunding_Facility[0].ccof_application_basefundingid;
      ccofBaseFundingStatus = getLabelFromValue(payload.ccof_application_basefunding_Facility[0].statuscode, CCOF_STATUS_CODES);
    }
    if (payload?.ccof_ccof_change_request_new_facility_facility?.length > 0) {
      changeRequestNewFacilityId = payload.ccof_ccof_change_request_new_facility_facility[0].ccof_change_request_new_facilityid;
    }
    if (ccofBaseFundingId && changeRequestNewFacilityId) {
      await updateChangeRequestNewFacility(changeRequestNewFacilityId, {
        'ccof_CCOF@odata.bind': `/ccof_application_basefundings(${ccofBaseFundingId})`,
      });
    }
    return res
      .status(HttpStatus.CREATED)
      .json({ facilityId: facilityGuid, changeRequestNewFacilityId: changeRequestNewFacilityId, ccofBaseFundingId: ccofBaseFundingId, ccofBaseFundingStatus: ccofBaseFundingStatus });
  } catch (e) {
    console.log(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getChangeRequestDocs(req, res) {
  const { changeRequestId } = req.params;
  log.verbose(changeRequestId);

  try {
    const response = await getChangeActionDocument(changeRequestId);

    log.verbose(response.value);
    return res.status(HttpStatus.OK).json(response.value);
  } catch (e) {
    log.info(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getChangeActionClosure(req, res) {
  const { changeActionClosureId } = req.params;
  try {
    const changeActionClosure = await getOperation(`ccof_change_action_closures(${changeActionClosureId})?$select=_ccof_change_action_value,ccof_any_details_added_on_request`);
    const changeActionClosureForFront = new MappableObjectForFront(changeActionClosure, ChangeActionClosureMappings).toJSON();
    changeActionClosureForFront.documents = [];
    if (changeActionClosure?._ccof_change_action_value) {
      const getDocumentsResponse = await getChangeActionDocument(changeActionClosure._ccof_change_action_value);
      getDocumentsResponse?.value?.forEach((document) => {
        changeActionClosureForFront.documents.push(new MappableObjectForFront(document, DocumentsMappings));
      });
    }
    return res.status(HttpStatus.OK).json(changeActionClosureForFront);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getChangeActionClosures(req, res) {
  try {
    const response = await getOperation(`ccof_change_action_closures?$select=${getMappingString(ChangeActionClosureMappings)}&${buildFilterQuery(req.query, ChangeActionClosureMappings)}`);
    const changeActionClosures = response?.value?.map((changeActionClosure) => new MappableObjectForFront(changeActionClosure, ChangeActionClosureMappings).toJSON());
    return res.status(HttpStatus.OK).json(changeActionClosures);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getChangeRequestMTFIByCcfriId(req, res) {
  try {
    const operation = `ccof_applicationccfris(${req.params.ccfriId})?$expand=ccof_change_request_mtfi_application_ccfri`;
    const response = await getOperation(operation);
    const mtfiDetails = [];
    const rfiDetails = new MappableObjectForFront(response, UserProfileBaseCCFRIMappings).toJSON();
    //Add in the rfi details mapping so on the front when we update hasRFI for the first time, we have the value needed to update it
    response?.ccof_change_request_mtfi_application_ccfri?.forEach((mtfiFacility) => {
      mtfiDetails.push({ ...new MappableObjectForFront(mtfiFacility, MtfiMappings).toJSON(), ...rfiDetails });
    });
    return res.status(HttpStatus.OK).json(mtfiDetails);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteChangeRequestMTFI(req, res) {
  try {
    const response = await deleteOperationWithObjectId('ccof_change_request_mtfis', req.params.mtfiId);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateChangeRequestMTFI(req, res) {
  try {
    const payload = new MappableObjectForBack(req?.body, MtfiMappings);
    await patchOperationWithObjectId('ccof_change_request_mtfis', req.params.mtfiId, payload);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getChangeRequest,
  createChangeRequest,
  createChangeRequestFacility,
  createClosureChangeRequest,
  getChangeRequestDocs,
  getChangeActionClosure,
  getChangeActionClosures,
  updateChangeRequest,
  createChangeAction,
  updateChangeRequestMTFI,
  deleteChangeAction,
  getChangeRequestMTFIByCcfriId,
  deleteChangeRequestMTFI,
};
