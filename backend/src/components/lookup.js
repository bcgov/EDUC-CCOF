'use strict';
const { getOperation, getLabelFromValue } = require('./utils');
const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { PROGRAM_YEAR_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES, CHANGE_REQUEST_TYPES } = require('../util/constants');
const { PermissionMappings, ProgramYearMappings, RoleMappings, SystemMessagesMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const log = require('./logger');

const Redis = require('../util/redis/redis-client');
const REDIS_EXPIRE_ARGS = [3600, 'NX'];

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
  let resData;
  try {
    resData = await Redis.jsonGet('licenseCategories');
  } catch (e) {
    log.error('Unable to retrieve the licenseCategories from Redis', e);
  }

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
    Redis.jsonSet('licenseCategories', '$', resData)
      .then(() => Redis.expire('licenseCategories', ...REDIS_EXPIRE_ARGS))
      .catch((error) => log.error('Could not set licenseCategories with Redis', error));
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

async function getLookupInfo(_req, res) {
  /**
   * Look ups from Dynamics365.
   * status code values are:
   * 1 - Current
   * 2 - Inactive
   * 3 - Future
   * 4 - Historical
   */
  let resData;
  try {
    resData = await Redis.jsonGet('lookups');
  } catch (e) {
    log.error('Could not get the lookup data from Redis', e);
  }

  if (!resData) {
    const programYears = await getProgramYear();

    const childCareCategory = (await getOperation('ccof_childcare_categories')).value
      .filter((item) => item.statuscode === 1)
      .map((item) => {
        return _.pick(item, ['ccof_childcarecategorynumber', 'ccof_name', 'ccof_description', 'ccof_childcare_categoryid']);
      });

    const [licenseCategory, healthAuthorities, roles] = await Promise.all([getLicenseCategory(), getGlobalOptionsData('ccof_healthauthority'), getRoles()]);
    resData = {
      programYear: programYears,
      childCareCategory: childCareCategory,
      organizationType: organizationType,
      fundingModelType: fundingModelType,
      groupLicenseCategory: licenseCategory.groupLicenseCategory,
      familyLicenseCategory: licenseCategory.familyLicenseCategory,
      'changeRequestTypes:': CHANGE_REQUEST_TYPES,
      healthAuthorities: healthAuthorities,
      roles: roles,
    };
    Redis.jsonSet('lookups', '$', resData)
      .then(() => Redis.expire('lookups', ...REDIS_EXPIRE_ARGS))
      .catch((error) => log.error('Could not set lookups with Redis', error));
  }
  return res.status(HttpStatus.OK).json(resData);
}

async function getSystemMessages(_req, res) {
  let systemMessages;
  try {
    systemMessages = await Redis.jsonGet('systemMessages');
  } catch (e) {
    log.error('Could not retrieve the systemMessages from Redis', e);
  }

  if (!systemMessages) {
    const currentTime = new Date().toISOString();
    systemMessages = [];
    const resData = await getOperation(`ccof_systemmessages?$filter=(ccof_startdate le ${currentTime} and ccof_enddate ge ${currentTime})`);
    resData?.value.forEach((message) => systemMessages.push(new MappableObjectForFront(message, SystemMessagesMappings).data));
    Redis.jsonSet('systemMessages', '$', systemMessages)
      .then(() => Redis.expire('systemMessages', 900, 'NX'))
      .catch((error) => log.error('Could not set systemMessages with Redis', error));
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

async function getRoles() {
  let roles;
  try {
    roles = await Redis.jsonGet('roles');
  } catch (e) {
    log.error('Could not retrieve roles data from Redis', e);
  }

  if (!roles) {
    roles = [];
    const response = await getOperation(
      "ofm_portal_roles?$select=ofm_name,ofm_portal_role_number&$expand=owningbusinessunit($select=name),ofm_portal_role_permission($select=ofm_portal_permissionid,_ofm_portal_privilege_value;$expand=ofm_portal_privilege($select=ofm_category,ofm_name,ofm_portal_privilege_number);$filter=(statecode eq 0))&$filter=(statecode eq 0) and (owningbusinessunit/name eq 'CCOF')",
    );
    response?.value?.forEach((item) => {
      const role = new MappableObjectForFront(item, RoleMappings).toJSON();
      role.permissions = item.ofm_portal_role_permission.map((p) => new MappableObjectForFront(p.ofm_portal_privilege, PermissionMappings).toJSON());
      roles.push(role);
    });
    roles.sort((a, b) => a.roleName?.localeCompare(b.roleName));
    Redis.jsonSet('roles', '$', roles)
      .then(() => Redis.expire('roles', ...REDIS_EXPIRE_ARGS))
      .catch((error) => log.error('Could not set roles with Redis', error));
  }

  return roles;
}

module.exports = {
  getLookupInfo,
  getLicenseCategory,
  getRoles,
  getSystemMessages,
};
