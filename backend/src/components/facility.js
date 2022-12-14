'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, minify, getLabelFromValue, deleteOperationWithObjectId} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { FacilityMappings } = require('../util/mapping/Mappings');
const { CHILD_AGE_CATEGORY_TYPES, ACCOUNT_TYPE, CCOF_STATUS_CODES} = require('../util/constants');
const { getLicenseCategory } = require('./lookup');


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

function buildNewFacilityPayload(req) {
  let facility = req.body;
  let organizationString = '/accounts(' + facility.organizationId + ')';
  let applicationString = '/ccof_applications(' + facility.applicationId + ')';

  facility = mapFacilityObjectForBack(facility);
  facility['ccof_accounttype'] = ACCOUNT_TYPE.FACILITY;
  facility['parentaccountid@odata.bind'] = organizationString;
  facility['ccof_application_basefunding_Facility'] = [
    {
      'ccof_Application@odata.bind': applicationString
    }
  ];
  
  return facility;
}

function mapFacilityObjectForBack(data) { 
  let facilityForBack = new MappableObjectForBack(data, FacilityMappings).toJSON();

  if (facilityForBack.ccof_facilitystartdate) { 
    facilityForBack.ccof_facilitystartdate = `${facilityForBack.ccof_facilitystartdate}-01-01`;
  }

  return facilityForBack;
}

function mapFacilityObjectForFront(data) { 
  if (data.ccof_facilitystartdate) {
    let year = data.ccof_facilitystartdate.split('-')[0];
    data.ccof_facilitystartdate = year;
  }

  return new MappableObjectForFront(data, FacilityMappings).toJSON();
}

async function getFacility(req, res) {
  try {
    // let operation = 'accounts('+req.params.facilityId+')?$select=accountid,address1_city,address1_line1,address1_postalcode,ccof_facilitylicencenumber,ccof_facilitystartdate,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep,ccof_frequency),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)';
    let operation = 'accounts('+req.params.facilityId+')?$select=ccof_accounttype,' + getMappingString(FacilityMappings) + '&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep,ccof_frequency),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)';
    log.info('operation: ', operation);
    let facility = await getOperation(operation);
    if (ACCOUNT_TYPE.FACILITY != facility?.ccof_accounttype) {
      return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not facility.'});
    }
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

        //ugly I know- but I just need a way to make previous year dates appear for the demo tomorrow. Will change soon to pull the previous date from API
        childCareTypes.push(
          {
            childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
            programYear: '2021/22 FY',
            programYearId: 'fba5721b-9434-ed11-9db1-002248d53d53',
          }
        );

      }

    });
    log.info('child care types: ', childCareTypes);

    facility = mapFacilityObjectForFront(facility);
    facility.childCareTypes = childCareTypes;

    return res.status(HttpStatus.OK).json(facility);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateFacilityLicenseType(facilityId, data) {
  // Load the license categories from Lookup
  let categories = await getLicenseCategory();
  let groupLicenseCategory = categories.groupLicenseCategory;
  
  // Figure out new License categories from data form
  let newLicenseCategories = [];
  log.info('updateFacilityLicenseType DATA: ', data);
  if (data.maxGroupChildCareUnder36 > 0) {
    newLicenseCategories.push(groupLicenseCategory.find(item => item.ccof_categorynumber == 1).ccof_license_categoryid);
  }
  if (data.maxGroupChildCare36 > 0) {
    newLicenseCategories.push(groupLicenseCategory.find(item => item.ccof_categorynumber == 2).ccof_license_categoryid);
  }
  if (data.maxGroupChildCareMultiAge > 0) {
    newLicenseCategories.push(groupLicenseCategory.find(item => item.ccof_categorynumber == 3).ccof_license_categoryid);
  }
  if (data.maxGroupChildCareSchool > 0) {
    newLicenseCategories.push(groupLicenseCategory.find(item => item.ccof_categorynumber == 7).ccof_license_categoryid);
  }
  if (data.maxPreschool > 0) {
    newLicenseCategories.push(groupLicenseCategory.find(item => item.ccof_categorynumber == 8).ccof_license_categoryid);
  }

  // Find the current License Categories associated with this facility
  let toDelete = [];
  log.info('New license categories: ', newLicenseCategories);
  try {
    let currentCategoryList = await getOperation(`ccof_facility_licenseses?$select=ccof_facility_licensesid,_ccof_licensecategory_value,_ccof_facility_value&$filter=_ccof_facility_value eq '${facilityId}'`);
    currentCategoryList = currentCategoryList.value;
    log.info('current categories: ', currentCategoryList);
    if (currentCategoryList?.length) {
      currentCategoryList.forEach(currentItem => {
        let index = newLicenseCategories.indexOf(currentItem._ccof_licensecategory_value);
        if (index > -1) {
          // item found, so no need to add it, remove for list
          log.info(`Found category for ${currentItem._ccof_licensecategory_value}, removing it from newLicenseCategories`);
          newLicenseCategories.splice(index, 1);
        } else {
          // item not in new list, so delete from current
          log.info(`Did not find category for ${currentItem._ccof_licensecategory_value}, adding it toDelete list`);
          toDelete.push(currentItem.ccof_facility_licensesid);
        }
      });
    }
    // delete old unneeded categories
    log.info(`Number of items to delete: [${toDelete.length}]`);
    toDelete.forEach( async itemId =>  {
      await deleteOperationWithObjectId('ccof_facility_licenseses', itemId);
    });
    // add new reccords
    log.info(`Number of items to add: [${newLicenseCategories.length}]`);
    newLicenseCategories.forEach ( async item => {
      await postOperation('ccof_facility_licenseses', {
        'ccof_LicenseCategory@odata.bind': `/ccof_license_categories(${item})`,
        'ccof_Facility@odata.bind': `/accounts(${facilityId})`
      });
    });

  } catch (e) {
    console.log('Error while trying to get list of FacilityLicenses.', e);
    throw e;
  }
}


async function createFacility(req, res) {
  let facility = buildNewFacilityPayload(req);
  try {
    let facilityGuid = await postOperation('accounts', facility);
    //After the base ccof application is created, get the application guid
    let operation = 'accounts(' + facilityGuid + ')?$select=accountid&$expand=ccof_application_basefunding_Facility($select=ccof_application_basefundingid,statuscode)';
    let ccofApplicationPayload = await getOperation(operation);
    let ccofBaseFundingId = undefined;
    let ccofBaseFundingStatus = undefined;
    if ( ccofApplicationPayload?.ccof_application_basefunding_Facility?.length > 0) {
      ccofBaseFundingId = ccofApplicationPayload.ccof_application_basefunding_Facility[0].ccof_application_basefundingid;
      ccofBaseFundingStatus = getLabelFromValue(ccofApplicationPayload.ccof_application_basefunding_Facility[0].statuscode, CCOF_STATUS_CODES);
    }
    return res.status(HttpStatus.CREATED).json({facilityId: facilityGuid, ccofBaseFundingId: ccofBaseFundingId, ccofBaseFundingStatus: ccofBaseFundingStatus});
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateFacility(req, res) {
  let facility = mapFacilityObjectForBack(req.body);
  try {
    log.info('updateFacility: Payload is: ', minify(facility));
    let response = await patchOperationWithObjectId('accounts', req.params.facilityId, facility);
    response = mapFacilityObjectForFront(response);
    log.info('updateFacility: Response is: ', minify(response));
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getFacility,
  createFacility,
  updateFacility,
  updateFacilityLicenseType
};

