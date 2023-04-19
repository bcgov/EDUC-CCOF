'use strict';

const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ChangeRequestMappings } = require('../util/mapping/ChangeRequestMappings');

const HttpStatus = require('http-status-codes');

const { errorResponse, minify, getHttpHeader, getOperationWithObjectId, postOperation } = require('./utils');
const { ApiError } = require('./error');


function mapOrganizationForBack(data) {
  let changeRequestForBack = new MappableObjectForBack(data, ChangeRequestMappings).toJSON();
  changeRequestForBack['ccof_ProgramYear@odata.bind'] = `/ccof_program_years(${data.programYearId})`
  delete changeRequestForBack._ccof_program_year_value;

  // changeRequestForBack['ccof_Application@odata.bind'] = `/ccof_applications(${data.applicationId})`
  delete changeRequestForBack._ccof_application_value;
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
async function createChangeRequest(req, res) {
  log.info('createChangeRequest called');
  try {
    let changeRequest = req.body;
    changeRequest = mapOrganizationForBack(changeRequest);
    // changeRequest['ccof_change_action_change_request'] = [
    //   {
    //     // 'ccof_change_request@odata.bind': `'/ccof_applications('
    //     'ccof_change_type': 100000013
    //   }
    // ];


    const changeRequestId = await postOperation('ccof_change_requests', changeRequest);
    return res.status(HttpStatus.CREATED).json({
      changeRequestId: changeRequestId,
    });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getChangeRequest,
  createChangeRequest,
};
