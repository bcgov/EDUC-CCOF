'use strict';

const axios = require('axios');
const log = require('./logger');
const config = require('../config/index');
const { errorResponse, minify, HttpStatus, getHttpHeader, getOperation } = require('./utils');
const {ApiError} = require('./error');
const { CHILD_AGE_CATEGORY_TYPES } = require('../util/constants');

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
    
    let operation = 'accounts('+req.params.facilityId+')?$select=accountid,address1_city,accountnumber,name&$expand=ccof_account_ccof_parent_fees_Facility($select=ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep),ccof_facility_licenses_Facility_account($select=ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value)';
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
        approvedFeeSep: approvedFeesByChildAgeCategory[y].ccof_sep
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


// TODO: remove once endpoint is ready.
const simulatedPayloadFacilities = 
[
  {
    "@search.score": 20.676246643066406,
    "@search.highlights": {
      "address1_city": [
        "{crmhit}Vernon{/crmhit}"
      ],
      "name": [
        "{crmhit}MAVEN{/crmhit} {crmhit}LANE{/crmhit} - ARMSTRONG"
      ]
    },
    "accountNumber": "F-1234-5678",
    "@search.entityname": "account",
    "@search.objectid": "730e2f0b-6c35-ed11-9db2-000d3af4f2d7",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "MAVEN LANE - ARMSTRONG",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:02 AM",
    "modifiedon": "10/3/2022 3:34 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": "Vernon",
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": 15.438217163085938,
    "@search.highlights": {
      "address1_city": [
        "{crmhit}Vernon{/crmhit}"
      ],
      "name": [
        "{crmhit}MAVEN{/crmhit} {crmhit}LANE{/crmhit} LAVINGTON"
      ]
    },
    "accountNumber": "G-1334-5676",
    "@search.entityname": "account",
    "@search.objectid": "870e2f0b-6c35-ed11-9db2-000d3af4f2d7",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "MAVEN LANE LAVINGTON",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:02 AM",
    "modifiedon": "9/22/2022 1:26 AM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": "Vernon",
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": 13.82897663116455,
    "@search.highlights": {
      "address1_city": [
        "{crmhit}Vernon{/crmhit}"
      ],
      "name": [
        "{crmhit}MAVEN{/crmhit} {crmhit}LANE{/crmhit} COLDSTREAM"
      ]
    },
    "accountNumber": "G-6232-5676",
    "@search.entityname": "account",
    "@search.objectid": "6f5ade09-6c35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "MAVEN LANE COLDSTREAM",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:02 AM",
    "modifiedon": "9/22/2022 1:26 AM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": "Vernon",
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -31.910951614379883,
    "@search.highlights": {
      "address1_city": [
        "{crmhit}Vernon{/crmhit}"
      ]
    },
    "accountNumber": "F-6276-1845",
    "@search.entityname": "account",
    "@search.objectid": "52b31c35-6c35-ed11-9db2-000d3af4f2d7",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "A & Z DAYCARE LTD.",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:04 AM",
    "modifiedon": "9/21/2022 9:27 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": "Vernon",
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "BLACKBERRY {crmhit}LANE{/crmhit} CHILDREN'S CENTRE"
      ]
    },
    "accountNumber": "G-3233-1445",
    "@search.entityname": "account",
    "@search.objectid": "02ace303-6c35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "BLACKBERRY LANE CHILDREN'S CENTRE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:02 AM",
    "modifiedon": "9/18/2022 2:23 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "PEBBLE {crmhit}LANE{/crmhit} EARLY LEARNING"
      ]
    },
    "accountNumber": "G-9953-3662",
    "@search.entityname": "account",
    "@search.objectid": "047c1c70-6c35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "PEBBLE LANE EARLY LEARNING",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:05 AM",
    "modifiedon": "9/18/2022 2:28 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "COUNTRY {crmhit}LANE{/crmhit} LEARNING CENTRE"
      ]
    },
    "accountNumber": "F-1845-7211",
    "@search.entityname": "account",
    "@search.objectid": "7e71fcdf-6b35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "COUNTRY LANE LEARNING CENTRE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:01 AM",
    "modifiedon": "9/18/2022 2:22 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "HAPPY {crmhit}LANE{/crmhit} CHILDCARE"
      ]
    },
    "accountNumber": "G-2475-3374",
    "@search.entityname": "account",
    "@search.objectid": "a161a0bb-6b35-ed11-9db2-000d3af4f2d7",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "HAPPY LANE CHILDCARE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:00 AM",
    "modifiedon": "9/18/2022 2:21 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "DRAGONFLY {crmhit}LANE{/crmhit} FAMILY DAYCARE"
      ]
    },
    "accountNumber": "G-2731-6822",
    "@search.entityname": "account",
    "@search.objectid": "c141e4af-6b35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "DRAGONFLY LANE FAMILY DAYCARE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:00 AM",
    "modifiedon": "9/18/2022 2:21 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.58241653442383,
    "@search.highlights": {
      "name": [
        "{crmhit}VERNON{/crmhit} CHRISTIAN PRESCHOOL"
      ]
    },
    "accountNumber": "G-4117-85254",
    "@search.entityname": "account",
    "@search.objectid": "eeee3858-6c35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "VERNON CHRISTIAN PRESCHOOL",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:05 AM",
    "modifiedon": "9/18/2022 2:27 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.64948654174805,
    "@search.highlights": {
      "name": [
        "PARK {crmhit}LANE{/crmhit} LICENSED CHILD CARE"
      ]
    },
    "accountNumber": "F-6845-7221",
    "@search.entityname": "account",
    "@search.objectid": "4572fcdf-6b35-ed11-9db1-002248d53d53",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "PARK LANE LICENSED CHILD CARE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:01 AM",
    "modifiedon": "9/18/2022 2:22 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  },
  {
    "@search.score": -34.776710510253906,
    "@search.highlights": {
      "name": [
        "APPLE BERRY {crmhit}LANE{/crmhit} FAMILY CHILD CARE"
      ]
    },
    "accountNumber": "G-1845-7211",
    "@search.entityname": "account",
    "@search.objectid": "97bb30e0-6b35-ed11-9db2-000d3af4f2d7",
    "ownerid": "085d3c22-8928-ed11-9db1-000d3af4f2d7",
    "owneridname": "MYCCS Application Service",
    "@search.ownerid.logicalname": "systemuser",
    "@search.objecttypecode": 1,
    "name": "APPLE BERRY LANE FAMILY CHILD CARE",
    "entityimage_url": null,
    "createdon": "9/16/2022 3:01 AM",
    "modifiedon": "9/18/2022 2:22 PM",
    "address1_line1": null,
    "telephone1": null,
    "address1_stateorprovince": null,
    "address1_line2": null,
    "ccof_facilitystatus": [
      "Approved"
    ],
    "address1_city": null,
    "ccof_businesstype": true,
    "ccof_businesstype@OData.Community.Display.V1.FormattedValue": "Facility"
  }
];

// TODO: remove once endpoint is ready.
const simulatedPayloadFacility = 
[
  {
    "@odata.context": "https://mychildcareservicesdev.api.crm3.dynamics.com/api/data/v9.2/$metadata#accounts(accountid,address1_city,accountnumber,name,ccof_account_ccof_parent_fees_Facility(ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep),ccof_facility_licenses_Facility_account(ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value))/$entity",
    "@odata.etag": "W/\"7448935\"",
    "accountid": "730e2f0b-6c35-ed11-9db2-000d3af4f2d7",
    "address1_city": "Vernon",
    "accountnumber": "G-02430-99754",
    "name": "MAVEN LANE - ARMSTRONG",
    "address1_composite": "Vernon",
    "ccof_account_ccof_parent_fees_Facility": [
        {
            "@odata.etag": "W/\"7133132\"",
            "ccof_parent_feesid": "80ac1928-0341-ed11-bba2-000d3af4f277",
            "ccof_apr": null,
            "ccof_aug": null,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "18-36",
            "_ccof_childcarecategory_value": "eb4b202e-0436-ed11-9db2-000d3af4f2d7",
            "ccof_dec": null,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE - ARMSTRONG",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb": null,
            "ccof_jan": null,
            "ccof_jul": null,
            "ccof_jun": null,
            "ccof_mar": null,
            "ccof_may": null,
            "ccof_nov": null,
            "ccof_oct": null,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep": null
        },
        {
            "@odata.etag": "W/\"7159151\"",
            "ccof_parent_feesid": "f7f0b63b-0341-ed11-bba3-000d3af4f2d7",
            "ccof_apr": null,
            "ccof_aug": null,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "3Y-K",
            "_ccof_childcarecategory_value": "1babd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec": null,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE - ARMSTRONG",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb": null,
            "ccof_jan": null,
            "ccof_jul": null,
            "ccof_jun": null,
            "ccof_mar": null,
            "ccof_may": null,
            "ccof_nov": null,
            "ccof_oct": null,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep": null
        },
        {
            "@odata.etag": "W/\"7185538\"",
            "ccof_parent_feesid": "cdc91b50-0341-ed11-bba3-000d3af4f630",
            "ccof_apr@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_apr": 475.0000000000,
            "ccof_aug@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_aug": 475.0000000000,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "OOSC-K",
            "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_dec": 475.0000000000,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE - ARMSTRONG",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_feb": 475.0000000000,
            "ccof_jan@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_jan": 475.0000000000,
            "ccof_jul@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_jul": 475.0000000000,
            "ccof_jun@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_jun": 475.0000000000,
            "ccof_mar@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_mar": 475.0000000000,
            "ccof_may@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_may": 475.0000000000,
            "ccof_nov@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_nov": 475.0000000000,
            "ccof_oct@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_oct": 475.0000000000,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep@OData.Community.Display.V1.FormattedValue": "$475.00",
            "ccof_sep": 475.0000000000
        },
        {
            "@odata.etag": "W/\"7106818\"",
            "ccof_parent_feesid": "c3a89d19-0341-ed11-bba3-000d3af4f9b7",
            "ccof_apr@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_apr": 675.0000000000,
            "ccof_aug@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_aug": 675.0000000000,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "0-18",
            "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_dec": 675.0000000000,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE - ARMSTRONG",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_feb": 675.0000000000,
            "ccof_jan@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_jan": 675.0000000000,
            "ccof_jul@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_jul": 675.0000000000,
            "ccof_jun@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_jun": 675.0000000000,
            "ccof_mar@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_mar": 675.0000000000,
            "ccof_may@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_may": 675.0000000000,
            "ccof_nov@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_nov": 675.0000000000,
            "ccof_oct@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_oct": 675.0000000000,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep@OData.Community.Display.V1.FormattedValue": "$675.00",
            "ccof_sep": 675.0000000000
        }
    ],
    "ccof_facility_licenses_Facility_account": []
  },
  {
    "@odata.context": "https://mychildcareservicesdev.api.crm3.dynamics.com/api/data/v9.2/$metadata#accounts(accountid,address1_city,accountnumber,name,ccof_account_ccof_parent_fees_Facility(ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep),ccof_facility_licenses_Facility_account(ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value))/$entity",
    "@odata.etag": "W/\"7448935\"",
    "accountid": "6f5ade09-6c35-ed11-9db1-002248d53d53",
    "address1_city": "Vernon",
    "accountnumber": "G-02430-99754",
    "name": "MAVEN LANE COLDSTREAM",
    "address1_composite": "Vernon",
    "ccof_account_ccof_parent_fees_Facility": [
        {
            "@odata.etag": "W/\"7133132\"",
            "ccof_parent_feesid": "80ac1928-0341-ed11-bba2-000d3af4f277",
            "ccof_apr": null,
            "ccof_aug": null,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "18-36",
            "_ccof_childcarecategory_value": "eb4b202e-0436-ed11-9db2-000d3af4f2d7",
            "ccof_dec": null,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE COLDSTREAM",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb": null,
            "ccof_jan": null,
            "ccof_jul": null,
            "ccof_jun": null,
            "ccof_mar": null,
            "ccof_may": null,
            "ccof_nov": null,
            "ccof_oct": null,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep": null
        },
        {
            "@odata.etag": "W/\"7159151\"",
            "ccof_parent_feesid": "f7f0b63b-0341-ed11-bba3-000d3af4f2d7",
            "ccof_apr": null,
            "ccof_aug": null,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "3Y-K",
            "_ccof_childcarecategory_value": "1babd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec": null,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE COLDSTREAM",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb": null,
            "ccof_jan": null,
            "ccof_jul": null,
            "ccof_jun": null,
            "ccof_mar": null,
            "ccof_may": null,
            "ccof_nov": null,
            "ccof_oct": null,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep": null
        },
        {
            "@odata.etag": "W/\"7185538\"",
            "ccof_parent_feesid": "cdc91b50-0341-ed11-bba3-000d3af4f630",
            "ccof_apr@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_apr": 535.0000000000,
            "ccof_aug@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_aug": 535.0000000000,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "OOSC-K",
            "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_dec": 535.0000000000,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE COLDSTREAM",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_feb": 535.0000000000,
            "ccof_jan@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_jan": 535.0000000000,
            "ccof_jul@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_jul": 535.0000000000,
            "ccof_jun@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_jun": 535.0000000000,
            "ccof_mar@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_mar": 535.0000000000,
            "ccof_may@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_may": 535.0000000000,
            "ccof_nov@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_nov": 535.0000000000,
            "ccof_oct@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_oct": 535.0000000000,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep@OData.Community.Display.V1.FormattedValue": "$535.00",
            "ccof_sep": 535.0000000000
        },
        {
            "@odata.etag": "W/\"7106818\"",
            "ccof_parent_feesid": "c3a89d19-0341-ed11-bba3-000d3af4f9b7",
            "ccof_apr": null,
            "ccof_aug": null,
            "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "0-18",
            "_ccof_childcarecategory_value": "19abd92c-0436-ed11-9db1-002248d53d53",
            "ccof_dec": null,
            "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "MAVEN LANE COLDSTREAM",
            "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
            "ccof_feb": null,
            "ccof_jan": null,
            "ccof_jul": null,
            "ccof_jun": null,
            "ccof_mar": null,
            "ccof_may": null,
            "ccof_nov": null,
            "ccof_oct": null,
            "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
            "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
            "ccof_sep": null
        }
    ],
    "ccof_facility_licenses_Facility_account": []
},
{
  "@odata.context": "https://mychildcareservicesdev.api.crm3.dynamics.com/api/data/v9.2/$metadata#accounts(accountid,address1_city,accountnumber,name,ccof_account_ccof_parent_fees_Facility(ccof_parent_feesid,ccof_apr,ccof_aug,_ccof_childcarecategory_value,ccof_dec,_ccof_facility_value,ccof_feb,ccof_jan,ccof_jul,ccof_jun,ccof_mar,ccof_may,ccof_nov,ccof_oct,_ccof_programyear_value,ccof_sep),ccof_facility_licenses_Facility_account(ccof_facility_licensesid,_ccof_facility_value,_ccof_licensecategory_value))/$entity",
  "@odata.etag": "W/\"7448935\"",
  "accountid": "02ace303-6c35-ed11-9db1-002248d53d53",
  "address1_city": "Vernon",
  "accountnumber": "G-02430-99754",
  "name": "BLACKBERRY LANE CHILDREN'S CENTRE",
  "address1_composite": "Vernon",
  "ccof_account_ccof_parent_fees_Facility": [
      {
          "@odata.etag": "W/\"7133132\"",
          "ccof_parent_feesid": "80ac1928-0341-ed11-bba2-000d3af4f277",
          "ccof_apr@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_apr": 600.0000000000,
          "ccof_aug@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_aug": 600.0000000000,
          "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "18-36",
          "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
          "ccof_dec@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_dec": 600.0000000000,
          "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "BLACKBERRY LANE CHILDREN'S CENTRE",
          "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
          "ccof_feb@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_feb": 600.0000000000,
          "ccof_jan@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jan": 600.0000000000,
          "ccof_jul@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jul": 600.0000000000,
          "ccof_jun@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jun": 600.0000000000,
          "ccof_mar@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_mar": 600.0000000000,
          "ccof_may@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_may": 600.0000000000,
          "ccof_nov@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_nov": 600.0000000000,
          "ccof_oct@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_oct": 600.0000000000,
          "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
          "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
          "ccof_sep@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_sep": 600.0000000000
      },
      {
          "@odata.etag": "W/\"7159151\"",
          "ccof_parent_feesid": "f7f0b63b-0341-ed11-bba3-000d3af4f2d7",
          "ccof_apr@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_apr": 600.0000000000,
          "ccof_aug@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_aug": 600.0000000000,
          "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "3Y-K",
          "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
          "ccof_dec@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_dec": 600.0000000000,
          "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "BLACKBERRY LANE CHILDREN'S CENTRE",
          "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
          "ccof_feb@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_feb": 600.0000000000,
          "ccof_jan@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jan": 600.0000000000,
          "ccof_jul@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jul": 600.0000000000,
          "ccof_jun@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_jun": 600.0000000000,
          "ccof_mar@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_mar": 600.0000000000,
          "ccof_may@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_may": 600.0000000000,
          "ccof_nov@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_nov": 600.0000000000,
          "ccof_oct@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_oct": 600.0000000000,
          "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
          "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
          "ccof_sep@OData.Community.Display.V1.FormattedValue": "$600.00",
          "ccof_sep": 600.0000000000
      },
      {
          "@odata.etag": "W/\"7185538\"",
          "ccof_parent_feesid": "cdc91b50-0341-ed11-bba3-000d3af4f630",
          "ccof_apr@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_apr": 575.0000000000,
          "ccof_aug@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_aug": 575.0000000000,
          "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "OOSC-K",
          "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
          "ccof_dec@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_dec": 575.0000000000,
          "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "BLACKBERRY LANE CHILDREN'S CENTRE",
          "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
          "ccof_feb@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_feb": 575.0000000000,
          "ccof_jan@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_jan": 575.0000000000,
          "ccof_jul@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_jul": 575.0000000000,
          "ccof_jun@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_jun": 575.0000000000,
          "ccof_mar@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_mar": 575.0000000000,
          "ccof_may@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_may": 575.0000000000,
          "ccof_nov@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_nov": 575.0000000000,
          "ccof_oct@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_oct": 575.0000000000,
          "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
          "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
          "ccof_sep@OData.Community.Display.V1.FormattedValue": "$575.00",
          "ccof_sep": 575.0000000000
      },
      {
          "@odata.etag": "W/\"7106818\"",
          "ccof_parent_feesid": "c3a89d19-0341-ed11-bba3-000d3af4f9b7",
          "ccof_apr@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_apr": 525.0000000000,
          "ccof_aug@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_aug": 525.0000000000,
          "_ccof_childcarecategory_value@OData.Community.Display.V1.FormattedValue": "0-18",
          "_ccof_childcarecategory_value": "1cabd92c-0436-ed11-9db1-002248d53d53",
          "ccof_dec@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_dec": 525.0000000000,
          "_ccof_facility_value@OData.Community.Display.V1.FormattedValue": "BLACKBERRY LANE CHILDREN'S CENTRE",
          "_ccof_facility_value": "6f5ade09-6c35-ed11-9db1-002248d53d53",
          "ccof_feb@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_feb": 525.0000000000,
          "ccof_jan@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_jan": 525.0000000000,
          "ccof_jul@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_jul": 525.0000000000,
          "ccof_jun@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_jun": 525.0000000000,
          "ccof_mar@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_mar": 525.0000000000,
          "ccof_may@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_may": 525.0000000000,
          "ccof_nov@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_nov": 525.0000000000,
          "ccof_oct@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_oct": 525.0000000000,
          "_ccof_programyear_value@OData.Community.Display.V1.FormattedValue": "2022/23 FY",
          "_ccof_programyear_value": "2ad4c331-9434-ed11-9db1-002248d53d53",
          "ccof_sep@OData.Community.Display.V1.FormattedValue": "$525.00",
          "ccof_sep": 525.0000000000
      }
  ],
  "ccof_facility_licenses_Facility_account": []
  }
];

module.exports = {getFacilities,
                  getFacility};
