'use strict';
const { getOperation, getLabelFromValue } = require('./utils');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const cache = require('memory-cache');
const { PROGRAM_YEAR_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES, CHANGE_REQUEST_TYPES } = require('../util/constants');
const { ProgramYearMappings, SystemMessagesMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const log = require('./logger');

const lookupCache = new cache.Cache();
const ONE_HOUR_MS = 60 * 60 * 1000; // Cache timeout set for one hour

const organizationType = [
  {
    name: 'Non-Profit Society',
    id: 100000000,
  },
  {
    name: 'Public Institution (college/university)',
    id: 100000001,
  },
  {
    name: 'Registered Company',
    id: 100000002,
  },
  {
    name: 'Local Government',
    id: 100000003,
  },
  {
    name: 'First Nations Government',
    id: 100000004,
  },
  {
    name: 'Sole Proprietorship',
    id: 100000005,
  },
  {
    name: 'Partnership',
    id: 100000006,
  },
];

const fundingModelType = [
  {
    id: 100000000,
    description: 'All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding.',
  },
  {
    id: 100000001,
    description: 'All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.',
  },
  {
    id: 100000002,
    description: 'Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding.',
  },
  {
    id: 100000003,
    description: 'Our facilities have both provincially funded ECEs receiving Low -Wage Redress Funding and non -provincially funded ECEs that do not receive Low - Wage Redress Funding.',
  },
];

async function getLicenseCategory() {
  let resData = lookupCache.get('licenseCategory');
  if (!resData) {
    resData = {};
    let licenseCategory = await getOperation('ccof_license_categories');
    licenseCategory = licenseCategory.value
      .filter((item) => item.statuscode == 1)
      .map((item) => {
        return _.pick(item, ['ccof_license_categoryid', 'ccof_providertype', 'ccof_name', 'ccof_categorynumber']);
      });
    resData.groupLicenseCategory = licenseCategory
      .filter((item) => item.ccof_providertype == ORGANIZATION_PROVIDER_TYPES.GROUP)
      .sort((a, b) => {
        return a.ccof_categorynumber - b.ccof_categorynumber;
      });
    resData.familyLicenseCategory = licenseCategory
      .filter((item) => item.ccof_providertype == ORGANIZATION_PROVIDER_TYPES.FAMILY)
      .sort((a, b) => {
        return a.ccof_categorynumber - b.ccof_categorynumber;
      });
    lookupCache.put('licenseCategory', resData, ONE_HOUR_MS);
  }
  return resData;
}

async function getProgramYear() {
  const programYearList = (await getOperation('ccof_program_years')).value;

  const programYears = {
    renewal: undefined,
    newApp: undefined,
    list: [],
  };

  //parse the list of program years from Dynamics. Renewal and NewApp will be used to create their respective applications
  programYearList.forEach((item) => {
    const year = new MappableObjectForFront(item, ProgramYearMappings).data;
    const currentStatus = year.status;

    year.status = getLabelFromValue(currentStatus, PROGRAM_YEAR_STATUS_CODES);
    if (currentStatus === PROGRAM_YEAR_STATUS_CODES.CURRENT) {
      programYears.newApp = year;
    } else if (currentStatus === PROGRAM_YEAR_STATUS_CODES.FUTURE) {
      programYears.renewal = year;
    }
    programYears.list.push(year);
  });

  programYears.list.sort((a, b) => {
    return b.order - a.order;
  });

  //this shouldn't happen - but if year not found, default it to the first year?
  if (!programYears.renewal) programYears.renewal = programYears.list[0];

  // Set the program year for a new application
  if (programYears.newApp?.intakeEnd) {
    const intakeDate = new Date(programYears.newApp?.intakeEnd);
    programYears.newApp = new Date() > intakeDate ? programYears.renewal : programYears.newApp;
  }
  return programYears;
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
    const programYears = await getProgramYear();

    const childCareCategory = (await getOperation('ccof_childcare_categories')).value
      .filter((item) => item.statuscode === 1)
      .map((item) => {
        return _.pick(item, ['ccof_childcarecategorynumber', 'ccof_name', 'ccof_description', 'ccof_childcare_categoryid']);
      });

    const [licenseCategory, healthAuthorities] = await Promise.all([getLicenseCategory(), getGlobalOptionsData('ccof_healthauthority')]);
    resData = {
      programYear: programYears,
      childCareCategory: childCareCategory,
      organizationType: organizationType,
      fundingModelType: fundingModelType,
      groupLicenseCategory: licenseCategory.groupLicenseCategory,
      familyLicenseCategory: licenseCategory.familyLicenseCategory,
      'changeRequestTypes:': CHANGE_REQUEST_TYPES,
      healthAuthorities: healthAuthorities,
    };
    lookupCache.put('lookups', resData, ONE_HOUR_MS);
  }
  return res.status(HttpStatus.OK).json(resData);
}

async function getSystemMessages(req, res) {
  let systemMessages = lookupCache.get('systemMessages');
  if (!systemMessages) {
    const currentTime = new Date().toISOString();
    systemMessages = [];
    const resData = await getOperation(`ccof_systemmessages?$filter=(ccof_startdate le ${currentTime} and ccof_enddate ge ${currentTime})`);
    resData?.value.forEach((message) => systemMessages.push(new MappableObjectForFront(message, SystemMessagesMappings).data));
    lookupCache.put('systemMessages', systemMessages, ONE_HOUR_MS);
  }
  return res.status(HttpStatus.OK).json(systemMessages);
}

async function getGlobalOptionsData(operationName) {
  try {
    const response = await getOperation(`GlobalOptionSetDefinitions(Name='${operationName}')`);
    const data =
      response?.Options?.map((item) => ({
        id: Number(item.Value),
        description: item.Label?.LocalizedLabels?.[0]?.Label ?? null,
      })) || [];
    return data;
  } catch (error) {
    log.error(`Error getting global options data for ${operationName}:`, error);
  }
}

module.exports = {
  getLookupInfo,
  getLicenseCategory,
  getSystemMessages,
};
