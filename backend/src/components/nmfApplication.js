/* eslint-disable quotes */
'use strict';
const { getOperation, postOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { NMFApplicationMappings } = require('../util/mapping/Mappings');

function mapNMFApplicationObjectForFront(data) {
  return new MappableObjectForFront(data, NMFApplicationMappings).toJSON();
}

function mapNMFApplicationObjectForBack(data) {
  return new MappableObjectForBack(data, NMFApplicationMappings).toJSON();
}

async function getNmfApplicationByCcfriId(ccfriId) {
  const query = `ccof_rfi_pfi_nmfs?$filter=(_ccof_applicationccfri_value eq ${ccfriId})`;
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
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'There is more than 1 NMF application' });
    }

    return res.status(HttpStatus.OK).json(nmfApplication);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
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
    if (isNmfComplete != null) {
      await patchOperationWithObjectId('ccof_applicationccfris', ccfriId, { ccof_nmf_formcomplete: isNmfComplete });
    }
    const response = await patchOperationWithObjectId('ccof_rfi_pfi_nmfs', nmfpfiid, nmfApplication);
    return res.status(HttpStatus.OK).json(mapNMFApplicationObjectForFront(response));
  } catch (e) {
    log.error('updateNMFApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createNMFApplication(req, res) {
  try {
    const nmfApplication = mapNMFApplicationObjectForBack(req.body.nmfModel);
    delete nmfApplication.ccof_rfi_pfi_nmfid;

    //set a flag in ccof_applicationccfri that a NMF exists for this application
    const isNmfComplete = req.body.nmfModel.isNmfComplete;
    await patchOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId, { ccof_has_nmf: true, ccof_nmf_formcomplete: isNmfComplete });

    nmfApplication['ccof_ApplicationCCFRI@odata.bind'] = `/ccof_applicationccfris(${req.params.ccfriId})`;
    log.info('createNMFApplication payload:', nmfApplication);
    const nmfApplicationGuid = await postOperation('ccof_rfi_pfi_nmfs', nmfApplication);
    return res.status(HttpStatus.CREATED).json({ nmfApplicationGuid: nmfApplicationGuid });
  } catch (e) {
    log.error('createNMFApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getNMFApplication,
  createNMFApplication,
  updateNMFApplication,
  getNmfApplicationByCcfriId,
};
