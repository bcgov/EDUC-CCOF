'use strict';

const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ChangeRequestMappings } = require('../util/mapping/ChangeRequestMappings');

const HttpStatus = require('http-status-codes');

const { getOperationWithObjectId, getOperation, postOperation } = require('./utils');

const CHANGE_REQUEST_TYPES = Object.freeze({
  NEW_FACILITY: 'NEW_FACILITY',
  PDF_CHANGE: 'PDF_CHANGE',
});


function mapOrganizationForBack(data, changeType) {
  let changeRequestForBack = new MappableObjectForBack(data, ChangeRequestMappings).toJSON();
  changeRequestForBack['ccof_program_year@odata.bind'] = `/ccof_program_years(${data.programYearId})`;
  delete changeRequestForBack._ccof_program_year_value;

  changeRequestForBack['ccof_Application@odata.bind'] = `/ccof_applications(${data.applicationId})`;
  delete changeRequestForBack._ccof_application_value;


  changeRequestForBack['ccof_change_action_change_request'] = [
    {
      ccof_changetype: changeType === CHANGE_REQUEST_TYPES.PDF_CHANGE ? 100000013 : 100000005
    }
  ];
  return changeRequestForBack;

}


function mapOrganizationObjectForFront(data) {
  return new MappableObjectForFront(data, ChangeRequestMappings).toJSON();
}

// get Change Request
async function getChangeRequest(req, res) {
  log.info('get changeRequest called');

  try {
    let changeRequest = await getOperationWithObjectId('ccof_change_requests', req.params.changeRequestId);
    changeRequest = mapOrganizationObjectForFront(changeRequest);

    return res.status(HttpStatus.OK).json(changeRequest);
  } catch (e) {
    console.log('e', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

// create Change Request
async function createChangeRequest(req, res, changeType) {
  log.info('createChangeRequest called');
  try {
    let changeRequest = req.body;
    changeRequest = mapOrganizationForBack(changeRequest, changeType);
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


module.exports = {
  getChangeRequest,
  createChangeRequest,
  CHANGE_REQUEST_TYPES,
};
