'use strict';
const { deleteOperationWithObjectId, getOperation, patchOperationWithObjectId, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ClosureMappings } = require('../util/mapping/Mappings');
const { buildFilterQuery } = require('./../components/utils');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');

function mapClosureForBack(data) {
  const closureForBack = new MappableObjectForBack(data, ClosureMappings).toJSON();
  closureForBack['ccof_ApplicationCCFRI@odata.bind'] = `/ccof_applicationccfris(${data?.ccfriApplicationId})`;
  closureForBack['ccof_FacilityInfo@odata.bind'] = `/accounts(${data?.facilityId})`;
  closureForBack['ccof_OrganizationFacility@odata.bind'] = `/accounts(${data?.organizationId})`;
  closureForBack['ccof_program_year@odata.bind'] = `/ccof_program_years(${data?.programYearId})`;
  delete closureForBack._ccof_change_action_closure_value;
  delete closureForBack._ccof_applicationccfri_value;
  delete closureForBack._ccof_facilityinfo_value;
  delete closureForBack._ccof_organizationfacility_value;
  delete closureForBack._ccof_program_year_value;
  return closureForBack;
}

async function getClosures(req, res) {
  try {
    const response = await getOperation(`ccof_application_ccfri_closures${buildFilterQuery(req.query, ClosureMappings)}`);
    const closures = [];
    response?.value?.forEach((closure) => closures.push(new MappableObjectForFront(closure, ClosureMappings).toJSON()));
    return res.status(HttpStatus.OK).json(closures);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createClosure(req, res) {
  try {
    await postOperation('ccof_application_ccfri_closures', mapClosureForBack(req.body));
    return res.status(HttpStatus.CREATED).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateClosure(req, res) {
  try {
    await patchOperationWithObjectId('ccof_application_ccfri_closures', req.params.closureId, mapClosureForBack(req.body));
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteClosures(req, res) {
  try {
    await Promise.all(req.body?.map(async (closureId) => await deleteOperationWithObjectId('ccof_application_ccfri_closures', closureId)));
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  createClosure,
  deleteClosures,
  getClosures,
  updateClosure,
};
