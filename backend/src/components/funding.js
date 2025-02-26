'use strict';
const { patchOperationWithObjectId, getOperationWithObjectId, minify } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');
const { updateFacilityLicenseType } = require('./facility');
const { getLicenseCategory } = require('./lookup');
const log = require('./logger');

function mapFundingObjectForBack(data) {
  return new MappableObjectForBack(data, CCOFApplicationFundingMapping).toJSON();
}

function mapFundingObjectForFront(data) {
  return new MappableObjectForFront(data, CCOFApplicationFundingMapping).toJSON();
}

async function updateFunding(req, res) {
  try {
    let fundId = req.params.fundId;
    log.verbose('patch operation: ', `ccof_application_basefundings(${fundId})`);

    let facilityId = req.body.facilityId;
    delete req.body.facilityId;

    await updateFacilityLicenseType(facilityId, req.body);
    let familyLicenseId = undefined;
    if (req.body.familyLicenseType) {
      let categories = await getLicenseCategory();
      familyLicenseId = categories.familyLicenseCategory.find((item) => item.ccof_categorynumber == req.body.familyLicenseType)?.ccof_license_categoryid;
      delete req.body.familyLicenseType;
    }

    let payload = mapFundingObjectForBack(req.body);
    if (familyLicenseId) {
      payload['ccof_licensetypes@odata.bind'] = `/ccof_license_categories(${familyLicenseId})`;
    }
    log.verbose('payload is: ', minify(payload));
    let response = await patchOperationWithObjectId('ccof_application_basefundings', fundId, payload);
    response = mapFundingObjectForFront(response);
    // update to funding will not return back facilityId.  add it back!
    // we will need it for further updates.
    response.facilityId = facilityId;
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getFunding(req, res) {
  try {
    log.info('get operation: ', `ccof_application_basefundings(${req.params.fundId})`);
    let funding = await getOperationWithObjectId('ccof_application_basefundings', req.params.fundId);
    let model = mapFundingObjectForFront(funding);
    if (funding._ccof_licensetypes_value) {
      let categories = await getLicenseCategory();
      model.familyLicenseType = categories.familyLicenseCategory.find((item) => item.ccof_license_categoryid == funding._ccof_licensetypes_value)?.ccof_categorynumber;
    }
    return res.status(HttpStatus.OK).json(model);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  updateFunding,
  getFunding,
  mapFundingObjectForFront,
};
