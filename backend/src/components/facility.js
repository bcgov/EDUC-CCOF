'use strict';
const { getOperation, postOperation, patchOperationWithObjectId, minify, getLabelFromValue, deleteOperationWithObjectId, getApplicationDocument, getHttpHeader } = require('./utils');
const HttpStatus = require('http-status-codes');
const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const { FacilityMappings, CCFRIFacilityMappings } = require('../util/mapping/Mappings');
const { CHILD_AGE_CATEGORY_TYPES, ACCOUNT_TYPE, CCOF_STATUS_CODES, CHILD_AGE_CATEGORY_ORDER } = require('../util/constants');
const { getLicenseCategory } = require('./lookup');

function buildNewFacilityPayload(req) {
  let facility = req.body;

  const organizationString = `/accounts(${facility.organizationId})`;
  const applicationString = `/ccof_applications(${facility.applicationId})`;

  facility = mapFacilityObjectForBack(facility);
  facility['ccof_accounttype'] = ACCOUNT_TYPE.FACILITY;
  facility['parentaccountid@odata.bind'] = organizationString;
  facility['ccof_application_basefunding_Facility'] = [
    {
      'ccof_Application@odata.bind': applicationString,
    },
  ];

  return facility;
}

function mapFacilityObjectForBack(data) {
  const facilityForBack = new MappableObjectForBack(data, FacilityMappings).toJSON();
  facilityForBack.ccof_facilitystartdate = facilityForBack.ccof_facilitystartdate ? `${facilityForBack.ccof_facilitystartdate}-01-01` : null;
  if (facilityForBack.ccof_licensestartdate) {
    facilityForBack.ccof_licensestartdate = facilityForBack.ccof_licensestartdate + 'T12:00:00-07:00';
  }
  return facilityForBack;
}

function mapFacilityObjectForFront(data) {
  if (data.ccof_facilitystartdate) {
    const year = data.ccof_facilitystartdate.split('-')[0];
    data.ccof_facilitystartdate = year;
  }
  if (data.ccof_licensestartdate) {
    data.ccof_licensestartdate = data.ccof_licensestartdate.split('T')[0];
  }
  const obj = new MappableObjectForFront(data, FacilityMappings).toJSON();
  return obj;
}

function mapCCFRIObjectForFront(data) {
  return new MappableObjectForFront(data, CCFRIFacilityMappings).toJSON();
}

async function getFacilityByFacilityId(facilityId) {
  const operation = `accounts(${facilityId})?$select=ccof_accounttype,name,ccof_facilitystartdate,address1_line1,address1_city,address1_stateorprovince,address1_postalcode,ccof_position,emailaddress1,address1_primarycontactname,telephone1,ccof_facilitylicencenumber,ccof_licensestartdate,ccof_formcomplete,ccof_everreceivedfundingundertheccofprogram,ccof_facilityreceived_ccof_funding,accountnumber,ccof_facilitystatus,ccof_is_facility_address_entered_manually,ccof_is_facility_address_same_as_org,ccof_is_facility_contact_same_as_org,ccof_healthauthority`;
  const facility = await getOperation(operation);

  if (ACCOUNT_TYPE.FACILITY != facility?.ccof_accounttype) {
    return null;
  }

  return mapFacilityObjectForFront(facility);
}

async function getFacility(req, res) {
  try {
    const facility = await getFacilityByFacilityId(req.params.facilityId);

    if (facility === null) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Account found but is not facility.' });
    }

    return res.status(HttpStatus.OK).json(facility);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getLicenseCategoriesByFacilityId(facilityId) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Facility?id=' + facilityId;
  const response = await axios.get(url, getHttpHeader());
  const map = new Map();
  response.data.value.forEach((item) => {
    map.set(item['CareType.ccof_childcare_categoryid'], {
      childCareCategoryId: item['CareType.ccof_childcare_categoryid'],
      childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(item['CareType.ccof_name']),
      orderNumber: CHILD_AGE_CATEGORY_ORDER.get(item['CareType.ccof_name']),
      licenseCategoryId: item['_ccof_licensecategory_value'],
    });
  });
  return map;
}

async function getLicenseCategories(req, res) {
  try {
    const map = await getLicenseCategoriesByFacilityId(req.params.facilityId);
    return res.status(HttpStatus.OK).json(Array.from(map.values()));
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function getFeeFrequency(feeCode) {
  switch (feeCode) {
    case 100000000:
      return 'Monthly';
    case 100000001:
      return 'Weekly';
    case 100000002:
      return 'Daily';
    default:
      return '';
  }
}

async function getFacilityChildCareTypesByCcfriId(ccfriId) {
  const operation = `ccof_applicationccfris(${ccfriId})?$select=${getMappingString(
    CCFRIFacilityMappings,
  )}&$expand=ccof_application_ccfri_ccc($select=ccof_name,ccof_apr,ccof_may,ccof_jun,ccof_jul,ccof_aug,ccof_sep,ccof_oct,ccof_nov,ccof_dec,ccof_jan,ccof_feb,ccof_mar,_ccof_childcarecategory_value,_ccof_programyear_value,ccof_frequency,ccof_application_ccfri_childcarecategoryid)`;
  let ccfriData = await getOperation(operation);

  const childCareTypes = [];
  ccfriData.ccof_application_ccfri_ccc.forEach((item) => {
    childCareTypes.push({
      parentFeeGUID: item.ccof_application_ccfri_childcarecategoryid,
      childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
      childCareCategoryId: item._ccof_childcarecategory_value,
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
      feeFrequency: getFeeFrequency(item.ccof_frequency),
      orderNumber: CHILD_AGE_CATEGORY_ORDER.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
    });
  }); //end for each

  ccfriData = mapCCFRIObjectForFront(ccfriData);

  ccfriData.childCareTypes = childCareTypes;
  return ccfriData;
}

async function getFacilityChildCareTypes(req, res) {
  try {
    const ccfriData = await getFacilityChildCareTypesByCcfriId(req.params.ccfriId);
    return res.status(HttpStatus.OK).json(ccfriData);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateFacilityLicenseType(facilityId, data) {
  // Load the license categories from Lookup
  const categories = await getLicenseCategory();
  const groupLicenseCategory = categories.groupLicenseCategory;

  // Figure out new Licence categories from data form
  const newLicenseCategories = [];
  if (data.familyLicenseType) {
    newLicenseCategories.push(categories.familyLicenseCategory.find((item) => item.ccof_categorynumber == data.familyLicenseType).ccof_license_categoryid);
  } else {
    if (data.maxGroupChildCareUnder36 > 0) {
      newLicenseCategories.push(groupLicenseCategory.find((item) => item.ccof_categorynumber == 1)?.ccof_license_categoryid);
    }
    if (data.maxGroupChildCare36 > 0) {
      newLicenseCategories.push(groupLicenseCategory.find((item) => item.ccof_categorynumber == 2)?.ccof_license_categoryid);
    }
    if (data.maxGroupChildCareMultiAge > 0) {
      newLicenseCategories.push(groupLicenseCategory.find((item) => item.ccof_categorynumber == 4)?.ccof_license_categoryid);
    }
    if (data.maxGroupChildCareSchool > 0) {
      newLicenseCategories.push(groupLicenseCategory.find((item) => item.ccof_categorynumber == 3)?.ccof_license_categoryid);
    }
    if (data.maxPreschool > 0) {
      newLicenseCategories.push(groupLicenseCategory.find((item) => item.ccof_categorynumber == 8)?.ccof_license_categoryid);
    }
  }

  // Find the current Licence Categories associated with this facility
  const toDelete = [];
  log.verbose('New licence categories: ', newLicenseCategories);
  try {
    let currentCategoryList = await getOperation(
      `ccof_facility_licenseses?$select=ccof_facility_licensesid,_ccof_licensecategory_value,_ccof_facility_value&$filter=_ccof_facility_value eq '${facilityId}'`,
    );
    currentCategoryList = currentCategoryList.value;
    if (currentCategoryList?.length) {
      currentCategoryList.forEach((currentItem) => {
        const index = newLicenseCategories.indexOf(currentItem._ccof_licensecategory_value);
        if (index > -1) {
          // item found, so no need to add it, remove for list
          log.verbose(`Found category for ${currentItem._ccof_licensecategory_value}, removing it from newLicenseCategories`);
          newLicenseCategories.splice(index, 1);
        } else {
          // item not in new list, so delete from current
          log.verbose(`Did not find category for ${currentItem._ccof_licensecategory_value}, adding it toDelete list`);
          toDelete.push(currentItem.ccof_facility_licensesid);
        }
      });
    }
    // delete old unneeded categories
    log.verbose(`Number of items to delete: [${toDelete.length}]`);
    toDelete.forEach(async (itemId) => {
      await deleteOperationWithObjectId('ccof_facility_licenseses', itemId);
    });
    // add new reccords
    log.verbose(`Number of items to add: [${newLicenseCategories.length}]`);
    newLicenseCategories.forEach(async (item) => {
      await postOperation('ccof_facility_licenseses', {
        'ccof_LicenseCategory@odata.bind': `/ccof_license_categories(${item})`,
        'ccof_Facility@odata.bind': `/accounts(${facilityId})`,
      });
    });
  } catch (e) {
    log.error('Error while trying to get list of FacilityLicences.', e);
    throw e;
  }
}

async function createFacility(req, res) {
  const facility = buildNewFacilityPayload(req);
  try {
    const facilityGuid = await postOperation('accounts', facility);
    //After the base ccof application is created, get the application guid
    const operation = 'accounts(' + facilityGuid + ')?$select=accountid&$expand=ccof_application_basefunding_Facility($select=ccof_application_basefundingid,statuscode)';
    const ccofApplicationPayload = await getOperation(operation);
    let ccofBaseFundingId = undefined;
    let ccofBaseFundingStatus = undefined;
    if (ccofApplicationPayload?.ccof_application_basefunding_Facility?.length > 0) {
      ccofBaseFundingId = ccofApplicationPayload.ccof_application_basefunding_Facility[0].ccof_application_basefundingid;
      ccofBaseFundingStatus = getLabelFromValue(ccofApplicationPayload.ccof_application_basefunding_Facility[0].statuscode, CCOF_STATUS_CODES);
    }
    return res.status(HttpStatus.CREATED).json({ facilityId: facilityGuid, ccofBaseFundingId: ccofBaseFundingId, ccofBaseFundingStatus: ccofBaseFundingStatus });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateFacility(req, res) {
  const facility = mapFacilityObjectForBack(req.body);
  try {
    log.verbose('updateFacility: Payload is: ', minify(facility));
    let response = await patchOperationWithObjectId('accounts', req.params.facilityId, facility);
    response = mapFacilityObjectForFront(response);
    log.verbose('updateFacility: Response is: ', minify(response));
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteFacility(req, res) {
  const { facilityId } = req.params;
  const { changeRequestNewFacilityId, ccfriId, eceweId, ccofBaseFundingId, applicationId } = req.body;

  if (ccfriId) {
    log.verbose('deleting facilitys CCFRI application', facilityId);
    await deleteOperationWithObjectId('ccof_applicationccfris', ccfriId);
  }

  if (eceweId) {
    log.verbose('deleting facilitys eceweId application', eceweId);
    await deleteOperationWithObjectId('ccof_applicationecewes', eceweId);
  }

  if (ccofBaseFundingId) {
    log.verbose('deleting facilitys ccofBaseFundingId application', ccofBaseFundingId);
    await deleteOperationWithObjectId('ccof_application_basefundings', ccofBaseFundingId);
  }

  //delete any associated documents to the facility.
  let organizationUploadedDocuments = await getApplicationDocument(applicationId);
  organizationUploadedDocuments = organizationUploadedDocuments.value;

  const document = organizationUploadedDocuments.find((document) => document['ApplicationFacilityDocument.ccof_facility'] == facilityId);

  //if at least 1 document exists for the facility, get the parent 'folder' GUID. Deleteing the parent entity removes all documents associated with the facility.
  if (document) {
    log.verbose('deleting all documents associated with ' + document['ApplicationFacilityDocument.ccof_facility@OData.Community.Display.V1.FormattedValue']);
    await deleteOperationWithObjectId('ccof_application_facility_documents', document['ApplicationFacilityDocument.ccof_application_facility_documentid']);
  }

  await deleteOperationWithObjectId('accounts', facilityId);

  if (changeRequestNewFacilityId) {
    log.verbose('deleting change request facility', changeRequestNewFacilityId);
    await deleteOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId);
  }
  return res.status(HttpStatus.OK).end();
}

async function getApprovedParentFees(req, res) {
  const facilityId = req.params.facilityId;
  const programYearId = req.params.programYearId;
  const operation = `accounts(${facilityId})?$select=accountid,address1_city,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,_ccof_facility_value,_ccof_programyear_value,_ccof_childcarecategory_value,ccof_frequency,ccof_availability,ccof_apr,ccof_may,ccof_jun,ccof_jul,ccof_aug,ccof_sep,ccof_oct,ccof_nov,ccof_dec,ccof_jan,ccof_feb,ccof_mar;$filter=(statuscode eq 1 and _ccof_programyear_value eq ${programYearId} and Microsoft.Dynamics.CRM.In(PropertyName='ccof_availability',PropertyValues=['100000000','100000002']) and Microsoft.Dynamics.CRM.In(PropertyName='ccof_frequency',PropertyValues=['100000000','100000002']));$orderby= _ccof_programyear_value desc)`;
  const response = await getOperation(operation);

  try {
    const childCareTypes = [];
    response.ccof_account_ccof_parent_fees_Facility.forEach((item) => {
      childCareTypes.push({
        parentFeeGUID: item.ccof_application_ccfri_childcarecategoryid,
        childCareCategory: CHILD_AGE_CATEGORY_TYPES.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
        childCareCategoryId: item._ccof_childcarecategory_value,
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
        feeFrequency: getFeeFrequency(item.ccof_frequency),
        orderNumber: CHILD_AGE_CATEGORY_ORDER.get(item['_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue']),
      });
    }); //end for each

    const retVal = {
      facilityId: facilityId,
      childCareTypes: childCareTypes,
    };
    return res.status(200).json(retVal);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getFacility,
  getFacilityChildCareTypes,
  createFacility,
  updateFacility,
  deleteFacility,
  getLicenseCategories,
  updateFacilityLicenseType,
  mapFacilityObjectForBack,
  getApprovedParentFees,
  getLicenseCategoriesByFacilityId,
  getFacilityChildCareTypesByCcfriId,
  getFacilityByFacilityId,
};
