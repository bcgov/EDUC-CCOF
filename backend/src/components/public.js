'use strict';

const axios = require('axios');
const log = require('./logger');
const config = require('../config/index');
const cacheHelper = config.get('redis:use') ? require('../util/redis/estimator-cache-helper') : require('../util/redis/estimator-no-redis-cache-helper');
const { errorResponse, minify, getHttpHeader, getOperation } = require('./utils');

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
CHILD_AGE_CATEGORY_TYPES.set('OOSC-G', 'Before & After School (Grade 1+)');
CHILD_AGE_CATEGORY_TYPES.set('PRE', 'Preschool');

// Get facilities which match user search critiera via query param (i.e. facility/city).
async function getFacilities(req, res) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Search';
    const params = {
      search: req.query.criteria,
    };
    log.verbose('search query: ' + JSON.stringify(params));
    const response = await axios.post(url, params, getHttpHeader());
    log.info(`get Data Status for url ${url} :: is :: `, response.status);
    log.info(`get Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`get Data Response for url ${url}  :: is :: `, minify(response.data));
    let results = [];
    if (response.data?.value) {
      results = await Promise.all(
        response.data.value.map(async (item) => {
          return {
            facilityId: await cacheHelper.getGuidE(item['@search.objectid']),
            facilityName: item.name,
            careType: item.accountnumber?.charAt(0),
            city: item.address1_city,
          };
        }),
      );
    }
    return res.status(200).json(results);
  } catch (e) {
    log.error('searchFacility Error', e.response ? e.response.status : e.message);
    return errorResponse(res);
  }
}

// Get a facility by facilityId (url parameter).
async function getFacility(req, res) {
  try {
    let approvedFeesByChildAgeCategory = [];
    const guidd = req.params.facilityId;
    let results = await cacheHelper.getFacility(guidd);
    if (!results) {
      results = {};
      const facilityId = await cacheHelper.getGuidD(guidd);
      const operation = `accounts(${facilityId})?$select=accountid,address1_city,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,_ccof_facility_value,_ccof_programyear_value,_ccof_childcarecategory_value,ccof_frequency,ccof_availability,ccof_apr,ccof_may,ccof_jun,ccof_jul,ccof_aug,ccof_sep,ccof_oct,ccof_nov,ccof_dec,ccof_jan,ccof_feb,ccof_mar;$filter=(statuscode eq 1 and Microsoft.Dynamics.CRM.In(PropertyName='ccof_availability',PropertyValues=['100000001','100000002']) and Microsoft.Dynamics.CRM.In(PropertyName='ccof_frequency',PropertyValues=['100000000','100000002']));$orderby= _ccof_programyear_value desc),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)`;
      const payLoad = await getOperation(operation);

      results.facilityId = payLoad.accountnumber?.charAt(0);
      results.name = payLoad.name;
      results.city = payLoad.address1_composite;
      results.approvedFeesByChildAgeCategory = [];
      approvedFeesByChildAgeCategory = payLoad.ccof_account_ccof_parent_fees_Facility;

      // Iterate through the payload to collect what we need, lighten, and return a condensed payload...
      let rec;
      let latestProgramYear;
      //only bring back the latest current year.
      if (approvedFeesByChildAgeCategory?.length > 0) {
        latestProgramYear = approvedFeesByChildAgeCategory[0]['_ccof_programyear_value@OData.Community.Display.V1.FormattedValue'];
      }
      for (let y in approvedFeesByChildAgeCategory) {
        if (latestProgramYear == approvedFeesByChildAgeCategory[y]['_ccof_programyear_value@OData.Community.Display.V1.FormattedValue']) {
          const feeFrequencies = { ['100000000']: 'Monthly', ['100000001']: 'Weekly', ['100000002']: 'Daily', [undefined]: '' };
          const feeFrequency = feeFrequencies[approvedFeesByChildAgeCategory[y].ccof_frequency];
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
            feeFrequency,
          };
          results.approvedFeesByChildAgeCategory.push(rec);
        }
      }
      cacheHelper.setFacility(guidd, results);
    }
    return res.status(200).json(results);
  } catch (e) {
    log.error(e, 'getFacility', 'Error occurred while attempting to GET Facility.');
    return errorResponse(res);
  }
}

module.exports = {
  getFacilities,
  getFacility,
};
