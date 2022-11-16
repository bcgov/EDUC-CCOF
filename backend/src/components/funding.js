'use strict';
const { getUserGuid, postOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const { MappableObjectForBack } = require('../util/mapping/MappableObject');
const { CCOFApplicationFundingMapping } = require('../util/mapping/Mappings');

async function createFunding(req, res) {
  const userGuid = getUserGuid(req);

  console.log('route /funding', req.body);

  new MappableObjectForBack(req.body, CCOFApplicationFundingMapping);

  try {
    let organizationGuid = await postOperation('accounts', 'XXX');
    return res.status(HttpStatus.CREATED).json({ organizationId: organizationGuid });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  createFunding,
};
