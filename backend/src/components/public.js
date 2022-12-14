'use strict';

const axios = require('axios');
const log = require('./logger');
const config = require('../config/index');
const { errorResponse, minify, HttpStatus, getHttpHeader, getOperation } = require('./utils');
const {ApiError} = require('./error');

//This is the Child age category types used by the estimator
//It is different from the CHILD_AGE_CATEGORY_TYPES in util/constants
//The wording is used to match values in CCFRIEstimator.
//TODO: merge this back to util/constants after we figure out which wording is correct.
//      and update CCFRIEstimator.vue if there are changes.
const CHILD_AGE_CATEGORY_TYPES = new Map();
CHILD_AGE_CATEGORY_TYPES.set('0-18', '0 - 18 Months');
CHILD_AGE_CATEGORY_TYPES.set('18-36', '18 - 36 Months');
CHILD_AGE_CATEGORY_TYPES.set('3Y-K', '3 Years to Kindergarten');
CHILD_AGE_CATEGORY_TYPES.set('OOSC-K', 'Before & After School (Kindergarten Only)');

// Get facilities which match user search critiera via query param (i.e. facility/city).
async function getFacilities(req, res) {
  try {
    let results = [];
    let payLoad = await searchFacility(req.query.criteria);
    // Iterate through the payload to colect what we need, lighten, and return a condensed payload...
    for (let x in payLoad) {
      results.push({facilityId: payLoad[x]['@search.objectid'],
        accountNumber: payLoad[x].accountnumber,
        facilityName: payLoad[x].name,
        city: payLoad[x].address1_city});
    }
    return res.status(200).json(results);
  } catch (e) {
    log.error(e, 'getFacilities', 'Error occurred while attempting to GET Facilities.');
    return errorResponse(res);
  }
}

// Get a facility by facilityId (url parameter).
async function getFacility(req, res) {
  try {
    let results = {};
    let approvedFeesByChildAgeCategory = [];
    
    let operation = `accounts(${req.params.facilityId})?$select=accountid,address1_city,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_availability,ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep,ccof_frequency;$filter=(Microsoft.Dynamics.CRM.In(PropertyName='ccof_availability',PropertyValues=['100000001','100000002']))),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)`    
    let payLoad = await getOperation(operation);
  
    results.facilityId = payLoad.accountnumber;
    results.name = payLoad.name;
    results.city = payLoad.address1_composite;
    results.approvedFeesByChildAgeCategory = [];
    approvedFeesByChildAgeCategory = payLoad.ccof_account_ccof_parent_fees_Facility;

    // Iterate through the payload to colect what we need, lighten, and return a condensed payload...
    let rec;
    for (let y in approvedFeesByChildAgeCategory) {
      rec = {
        childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(approvedFeesByChildAgeCategory[y]['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
        programYear: approvedFeesByChildAgeCategory[y]['_ccof_programyear_value@OData.Community.Display.V1.FormattedValue'],
        approvedFeeApr: approvedFeesByChildAgeCategory[y].ccof_apr,
        approvedFeeAug: approvedFeesByChildAgeCategory[y].ccof_aug,
        approvedFeeDec: approvedFeesByChildAgeCategory[y].ccof_dec,
        approvedFeeFeb: approvedFeesByChildAgeCategory[y].ccof_feb,
        approvedFeeJan: approvedFeesByChildAgeCategory[y].ccof_jan,
        approvedFeeJul: approvedFeesByChildAgeCategory[y].ccof_jul,
        approvedFeeJun: approvedFeesByChildAgeCategory[y].ccof_jun,
        approvedFeeMar: approvedFeesByChildAgeCategory[y].ccof_mar,
        approvedFeeMay: approvedFeesByChildAgeCategory[y].ccof_may,
        approvedFeeNov: approvedFeesByChildAgeCategory[y].ccof_nov,
        approvedFeeOct: approvedFeesByChildAgeCategory[y].ccof_oct,
        approvedFeeSep: approvedFeesByChildAgeCategory[y].ccof_sep,
        feeFrequency: (approvedFeesByChildAgeCategory[y].ccof_frequency == '100000000') ? 'Monthly' : ((approvedFeesByChildAgeCategory[y].ccof_frequency == '100000001') ? 'Weekly' : ((approvedFeesByChildAgeCategory[y].ccof_frequency == '100000002') ? 'Daily' : '') )
      };
      results.approvedFeesByChildAgeCategory.push(rec);
    }
    return res.status(200).json(results);
  } catch (e) {
    log.error(e, 'getFacility', 'Error occurred while attempting to GET Facility.');
    return errorResponse(res);
  }
}


async function searchFacility(searchQuery) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Search';
    const params = {
      'search': searchQuery,
    };
    log.info('search query: ' + JSON.stringify(params));
    log.info('post Data Url', url);
    const response = await axios.post(url, params, getHttpHeader());
    log.info(`get Data Status for url ${url} :: is :: `, response.status);
    log.info(`get Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`get Data Response for url ${url}  :: is :: `, minify(response.data));

    return response.data?.value;
  } catch (e) {
    log.error('searchFacility Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, {message: 'API Get error'}, e);
  }
}

module.exports = {
  getFacilities,
  getFacility,
};
