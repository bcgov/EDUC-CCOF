/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, minify} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { NMFApplicationMappings } = require('../util/mapping/Mappings');

function mapNMFApplicationObjectForFront(data) {
  data.ccof_supportneeds = data.ccof_supportneeds != null ? ((data.ccof_supportneeds === 1) ? "Yes" : "No") : null;
  data.ccof_lowincome_families = data.ccof_lowincome_families != null ? ((data.ccof_lowincome_families === 1) ? "Yes" : "No") : null;
  data.ccof_remote_communities = data.ccof_remote_communities != null? ((data.ccof_remote_communities === 1) ? "Yes" : "No") : null;
  return new MappableObjectForFront(data, NMFApplicationMappings).toJSON();
}

function mapNMFApplicationObjectForBack(data) {
  data.supportNeeds = data.supportNeeds ? ((data.supportNeeds === "Yes") ? 1 : 0) : null;
  data.lowIncomeFamilies = data.lowIncomeFamilies ? ((data.lowIncomeFamilies === "Yes") ? 1 : 0) : null;
  data.remoteCommunities = data.remoteCommunities ? ((data.remoteCommunities === "Yes") ? 1 : 0) : null;
  return new MappableObjectForBack(data, NMFApplicationMappings).toJSON();
}

async function getNmfApplicationByCcfriId(ccfriId) {
  const query = `ccof_rfi_pfi_nmfs?$filter=(_ccof_applicationccfri_value eq ${ccfriId})`;
  log.info('GET NMF query ' + query);

  const response = await getOperation(query);
  if (response.value.length === 1) {
    const nmfApplication = mapNMFApplicationObjectForFront(response.value[0]);
    return nmfApplication;
  } else if (response.value.length === 0) {
    return {};
  } else {
    return null;
  }
}

async function getNMFApplication(req, res) {
  try {
    const nmfApplication = await getNmfApplicationByCcfriId(req.params.ccfriId);

    if (nmfApplication === null) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'There is more than 1 NMF application'});
    }

    return res.status(HttpStatus.OK).json(nmfApplication);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateNMFApplication(req, res) {
  try {
    const nmfApplication = mapNMFApplicationObjectForBack(req.body.nmfModel);
    const nmfpfiid = req.params.nmfpfiid;

    delete nmfApplication.ccof_rfi_pfi_nmfid;

    // update isComplete status
    const isNmfComplete = req.body.nmfModel.isNmfComplete;
    const ccfriId = req.body.ccfriId;
    if (isNmfComplete != null ) {
      await patchOperationWithObjectId('ccof_applicationccfris', ccfriId, {ccof_nmf_formcomplete: isNmfComplete});
    }

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
    const nmfApplication = mapNMFApplicationObjectForBack(req.body.nmfModel);
    delete nmfApplication.ccof_rfi_pfi_nmfid;

    //set a flag in ccof_applicationccfri that a NMF exists for this application
    let isNmfComplete = req.body.nmfModel.isNmfComplete;
    await patchOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId, {ccof_has_nmf: true, ccof_nmf_formcomplete: isNmfComplete});

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
  getNmfApplicationByCcfriId
};
