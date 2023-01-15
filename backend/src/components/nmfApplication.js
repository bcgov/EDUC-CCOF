/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, minify} = require('./utils');
const { CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES, APPLICATION_STATUS_CODES } = require('../util/constants');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { NMFApplicationMappings } = require('../util/mapping/Mappings');
const { getCCFRIClosureDates } = require('./facility');


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mapNMFApplicationObjectForFront(data) {
  data.ccof_supportneeds = (data.ccof_supportneeds === 1) ? "Yes" : "No";
  data.ccof_lowincome_families = (data.ccof_lowincome_families === 1) ? "Yes" : "No";
  data.ccof_remote_communities = (data.ccof_remote_communities === 1) ? "Yes" : "No";
  return new MappableObjectForFront(data, NMFApplicationMappings).toJSON();
}

function mapNMFApplicationObjectForBack(data) {
  data.supportNeeds = (data.supportNeeds === "Yes") ? 1 : 0;
  data.lowIncomeFamilies = (data.lowIncomeFamilies === "Yes") ? 1 : 0;
  data.remoteCommunities = (data.remoteCommunities === "Yes") ? 1 : 0;
  return new MappableObjectForBack(data, NMFApplicationMappings).toJSON();
}
  
async function getNMFApplication(req, res) {
  let query = `ccof_rfi_pfi_nmfs?$filter=(_ccof_applicationccfri_value eq ${req.params.ccfriId})`;
  log.info('GET NMF query ' + query);
  try {
    const response = await getOperation(query);
    console.log('response: ', minify(response.value));
    console.log('response length: ', response.value.length);
    if (response.value.length === 1) {
      let nmfApplication = mapNMFApplicationObjectForFront(response.value[0]);
      return res.status(HttpStatus.OK).json(nmfApplication);
    } else {
      return res.status(HttpStatus.OK).json({});
    //   return res.status(HttpStatus.NOT_FOUND).json({message: 'There is 0 or more than 1 NMF application'});
    }
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateNMFApplication(req, res) {
  try {
    const nmfApplication = mapNMFApplicationObjectForBack(req.body);
    const nmfpfiid = req.params.nmfpfiid;
    delete nmfApplication.ccof_rfi_pfi_nmfid;

    log.info('updateNMFApplication payload:', nmfApplication);
    let nmfApplicationResponse = await patchOperationWithObjectId('ccof_rfi_pfi_nmfs', nmfpfiid, nmfApplication);
    nmfApplicationResponse = mapNMFApplicationObjectForFront(nmfApplicationResponse);
    return res.status(HttpStatus.OK).json(nmfApplicationResponse);
  } catch (e) {
    log.error('updateNMFApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function createNMFApplication(req, res) {
  try {
    const nmfApplication = mapNMFApplicationObjectForBack(req.body);
    delete nmfApplication.ccof_rfi_pfi_nmfid;

    nmfApplication['ccof_ApplicationCCFRI@odata.bind'] = `/ccof_applicationccfris(${req.params.ccfriId})`;
    log.info('createNMFApplication payload:', nmfApplication);
    const nmfApplicationGuid = await postOperation('ccof_rfi_pfi_nmfs', nmfApplication);
    return res.status(HttpStatus.CREATED).json({ nmfApplicationGuid: nmfApplicationGuid });
  } catch (e) {
    log.error('createNMFApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getNMFApplication,
  createNMFApplication,
  updateNMFApplication,
};