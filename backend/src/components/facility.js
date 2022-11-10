'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, minify } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { FacilityMappings } = require('../util/mapping/Mappings');
const { CHILD_AGE_CATEGORY_TYPES, ACCOUNT_TYPE } = require('../util/constants');

function hasChildCareCategory(item) {
  return (
    item.ccof_apr ||
    item.ccof_aug ||
    item.ccof_dec ||
    item.ccof_feb ||
    item.ccof_jan ||
    item.ccof_jul ||
    item.ccof_jun ||
    item.ccof_mar ||
    item.ccof_may ||
    item.ccof_nov ||
    item.ccof_oct ||
    item.ccof_sep
  );
}

function buildPayload(req) {
  let facility = req.body;
  let organizationString = '/accounts(' + facility.organizationId + ')';
  facility = new MappableObjectForBack(facility, FacilityMappings);
  facility.data['ccof_accounttype'] = ACCOUNT_TYPE.FACILITY;
  facility.data['parentaccountid@odata.bind'] = organizationString;
  return facility;
}

async function getFacility(req, res) {
  try {
    // let operation = 'accounts('+req.params.facilityId+')?$select=accountid,address1_city,address1_line1,address1_postalcode,ccof_facilitylicencenumber,ccof_facilitystartdate,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep,ccof_frequency),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)';
    let operation = 'accounts('+req.params.facilityId+')?$select=' + getMappingString(FacilityMappings) + '&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep,ccof_frequency),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)';
    log.info('operation: ', operation);
    let facility = await getOperation(operation);
    // TODO: confirm with Dynamics team on account type
    // if (100000001 != facility?.ccof_accounttype) {
    //   return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not facility.'});
    // }
    let childCareTypes = [];
    facility.ccof_account_ccof_parent_fees_Facility.forEach(item =>{
      if (hasChildCareCategory(item)) {
        childCareTypes.push(
          {
            childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
            programYear: item['_ccof_programyear_value@OData.Community.Display.V1.FormattedValue'],
            programYearId: item._ccof_programyear_value,
            approvedFeeApr: item.ccof_apr,
            approvedFeeAug: item.ccof_aug,
            approvedFeeDec: item.ccof_dec,
            approvedFeeFeb: item.ccof_feb,
            approvedFeeJan: item.ccof_jan,
            approvedFeeJul: item.ccof_jul,
            approvedFeeJun: item.ccof_jun,
            approvedFeeMar: item.ccof_mar,
            approvedFeeMay: item.ccof_may,
            approvedFeeNov: item.ccof_nov,
            approvedFeeOct: item.ccof_oct,
            approvedFeeSep: item.ccof_sep,
            feeFrequency: (item.ccof_frequency == '100000000') ? 'Monthly' : ((item.ccof_frequency == '100000001') ? 'Weekly' : ((item.ccof_frequency == '100000002') ? 'Daily' : '') )
          }
        );
      }

    });
    log.info('child care types: ', childCareTypes);
    facility = new MappableObjectForFront(facility, FacilityMappings);
    facility.data.childCareTypes = childCareTypes;
    log.info(minify(facility));
    return res.status(HttpStatus.OK).json(facility);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}



async function createFacility(req, res) {
  let facility = buildPayload(req);

  try {
    let facilityGuid = await postOperation('accounts', facility);
    return res.status(HttpStatus.CREATED).json({facilityId: facilityGuid});
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateFacility(req, res) {
  let facility = buildPayload(req);
  try {
    console.log('Payload is: ', minify(facility));
    let response = await patchOperationWithObjectId('accounts', req.params.facilityId, facility);
    response = new MappableObjectForFront(response, FacilityMappings);
    console.log('Response is: ', minify(response));

    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getFacility,
  createFacility,
  updateFacility
};

