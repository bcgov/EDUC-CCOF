'use strict';
const {getOperation, getLabelFromValue, minify} = require('./utils');
const HttpStatus = require('http-status-codes');
const _ = require ('lodash');
const cache = require('memory-cache');
const { PROGRAM_YEAR_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES } = require('../util/constants');
const { ProgramYearMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const log = require('./logger');


const lookupCache = new cache.Cache();

const organizationType = [
  {
    name: 'Non-Profit Society',
    id: 100000000
  },
  {
    name: 'Public Institution (college/university)',
    id: 100000001
  },
  {
    name: 'Registered Company',
    id: 100000002
  },
  {
    name: 'Local Government',
    id: 100000003
  },
  {
    name: 'First Nations Government',
    id: 100000004
  },
  {
    name: 'Sole Proprietorship or Partnership',
    id: 100000005
  }
];

const fundingModelType = [
  {
    id: 100000000,
    description: 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.',
  },
  {
    id: 100000001,
    description: 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.',
  },
  {
    id: 100000002,
    description: 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding.',
  },
];

function parseProgramYear(value) {
  let programYears = {
    current: undefined,
    future: undefined,
    previous: undefined,
    list: []
  };
  value.forEach(item => {
    let p = new MappableObjectForFront(item, ProgramYearMappings).data;
    let currentStatus = p.status;
    p.status = getLabelFromValue(p.status, PROGRAM_YEAR_STATUS_CODES);
    if (currentStatus == PROGRAM_YEAR_STATUS_CODES.CURRENT) {
      programYears.current = p;
    } else if (currentStatus == PROGRAM_YEAR_STATUS_CODES.FUTURE) {
      programYears.future = p;
    }
    programYears.list.push(p);
  });
  programYears.previous = programYears.list.find(p => p.programYearId == programYears.current.previousYearId);
  programYears.list.sort((a,b) => { return b.order - a.order; } );
  return programYears;
}

async function getLicenseCategory() {
  let resData = lookupCache.get('licenseCategory');
  if (!resData) {
    resData = {};
    let licenseCategory = await getOperation('ccof_license_categories');
    licenseCategory = licenseCategory.value.filter(item => item.statuscode ==1).map(item => { return _.pick(item, ['ccof_license_categoryid', 'ccof_providertype', 'ccof_name', 'ccof_categorynumber']); });
    resData.groupLicenseCategory = licenseCategory.filter( item => item.ccof_providertype == ORGANIZATION_PROVIDER_TYPES.GROUP).sort((a,b) => { return a.ccof_categorynumber - b.ccof_categorynumber; } );
    resData.familiyLicenseCategory = licenseCategory.filter( item => item.ccof_providertype == ORGANIZATION_PROVIDER_TYPES.FAMILY).sort((a,b) => { return a.ccof_categorynumber - b.ccof_categorynumber; } );
    lookupCache.put('licenseCategory', resData, 60 * 60 * 1000);
  }
  return resData;
}

async function getLookupInfo(req, res) {
  /**
   * Look ups from Dynamics365. 
   * status code values are:
   * 1 - Current
   * 2 - Inactive
   * 3 - Future
   * 4 - Historica
   */
  let resData = lookupCache.get('lookups');
  if (!resData) {
    let programYear = await getOperation('ccof_program_years');
    programYear = parseProgramYear(programYear.value);

    let childCareCategory = await getOperation('ccof_childcare_categories');
    childCareCategory = childCareCategory.value.filter(item => item.statuscode ==1).map(item => { return _.pick(item, ['ccof_childcarecategorynumber', 'ccof_name', 'ccof_description', 'ccof_childcare_categoryid']); });

    let licenseCategory = await getLicenseCategory();
    resData = {
      'programYear': programYear,
      'childCareCategory': childCareCategory,
      'organizationType': organizationType,
      'fundingModelType': fundingModelType,
      'groupLicenseCategory': licenseCategory.groupLicenseCategory,
      'familiyLicenseCategory': licenseCategory.familiyLicenseCategory
    };
    lookupCache.put('lookups', resData, 60 * 60 * 1000);
  }
  //log.info('lookupData is: ', minify(resData));
  return res.status(HttpStatus.OK).json(resData);
}
module.exports = {
  getLookupInfo,
  getLicenseCategory
};
