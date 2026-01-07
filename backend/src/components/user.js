'use strict';
const { getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getLabelFromValue, postOperation, isIdirUser, getOperation } = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { isEmpty } = require('lodash');
const {
  APPLICATION_STATUS_CODES,
  CCFRI_STATUS_CODES,
  ECEWE_STATUS_CODES,
  CCOF_STATUS_CODES,
  CCOF_APPLICATION_TYPES,
  ORGANIZATION_PROVIDER_TYPES,
  CHANGE_REQUEST_TYPES,
  PROGRAM_YEAR_STATUS_CODES,
  ROLES,
} = require('../util/constants');
const {
  UserProfileMappings,
  UserProfileFacilityMappings,
  UserProfileOrganizationMappings,
  UserProfileBaseFundingMappings,
  UserProfileApplicationMappings,
  UserProfileCCFRIMappings,
  UserProfileECEWEMappings,
  FundingAgreementMappings,
  RoleMappings,
} = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { getRoles } = require('../components/lookup');
const { getRawContactFacilities } = require('./contact');
const { isFacilityAdmin } = require('../util/common');

async function getUserInfo(req, res) {
  const userInfo = getSessionUser(req);
  if (!userInfo?.jwt || !userInfo?._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data',
    });
  }
  const isIdir = isIdirUser(req);
  const queryUserName = req.params?.queryUserName;
  const userName = getUserName(req);

  // if is idir user (ministry user), make sure they are a user in dynamics
  if (isIdir) {
    let response = await getDynamicsUserByEmail(req);
    if (response.value?.length > 0 && response.value[0].systemuserid) {
      log.verbose(`Ministry user: [${req.session.passport.user._json.idir_username}] logged in.`);
    } else {
      log.info(`Ministry user: [${req.session.passport.user._json.idir_username}] attempted to log in but is not part of Dynamics.`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Not Authorized',
      });
    }
  }
  let resData = {
    displayName: queryUserName ? userName + '-' + queryUserName : userName,
    userName: userName,
    email: req.session.passport.user._json.email,
    isMinistryUser: isIdir,
    serverTime: new Date(),
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: false,
  };
  let userResponse = undefined;
  if (isIdir) {
    if (queryUserName) {
      try {
        log.info(`Ministry user [${userName}] is impersonating with username: [${queryUserName}].`);
        // dynamics api requires a userID. if userID not found then it wil use the query name
        // put a random userID so that we only search by queryname
        userResponse = await getUserProfile(null, queryUserName);
        if (userResponse === null) {
          return res.status(HttpStatus.NOT_FOUND).json({ message: 'No user found with that BCeID UserName' });
        }
      } catch (e) {
        log.error('getUserProfile Error', e.response ? e.response.status : e.message);
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
      }
    } else {
      //If not looking for a username, return from here since ministry staff should not have an account
      return res.status(HttpStatus.OK).json(resData);
    }
  } else {
    //Not an idir user, so just get the guid from the header
    const userGuid = getUserGuid(req);
    log.verbose('User Guid is: ', userGuid);
    userResponse = await getUserProfile(userGuid, userName);

    // Block requests from deactivated BCeID users
    if (userResponse?.statecode === 1) {
      return res.status(HttpStatus.UNAUTHORIZED).json();
    }
  }

  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:', minify(userResponse));
  }

  log.info('getUserProfile response:', minify(userResponse));

  // There are two scenarios under which the userResponse is empty
  // 1. A null response means no user found, so create a new BCeID user with a default Organization Admin role
  // 2. An empty ({}) userResponse means no Organization and/or Applications
  if (isEmpty(userResponse)) {
    const roles = await getRoles();
    const orgAdminRole = roles.find((role) => role.data.roleNumber === ROLES.ORG_ADMIN);
    const {
      data: { roleId, roleNumber },
    } = orgAdminRole;

    if (userResponse === null) {
      createUser(req, roleId);
    }

    // Add the default role to the response so the user can create Organization and Applications
    const role = { roleId, roleNumber };
    const result = {
      ...resData,
      role,
    };

    return res.status(HttpStatus.OK).json(result);
  }

  // 3. Non-empty response means the user has an Organization and Applications
  const user = new MappableObjectForFront(userResponse, UserProfileMappings).data;
  if (userResponse.portalRole) {
    user.role = new MappableObjectForFront(userResponse.portalRole, RoleMappings).data;
    req.session.passport.user.role = user.role;
  }

  // Get facilities for Facility Admin users
  if (isFacilityAdmin(user)) {
    const facilities = await getRawContactFacilities(user.contactId);
    user.facilities = facilities;
    if (isIdir) {
      req.session.passport.user.facilities = facilities;
    }
  }

  const organization = new MappableObjectForFront(userResponse, UserProfileOrganizationMappings).data;
  const applicationList = [];

  if (userResponse.application && userResponse.application.length > 0) {
    //call the funding agreement table and load that to the application
    let operation = `ccof_funding_agreements?$filter=_ccof_organization_value eq '${organization.organizationId}'`;
    let fundingAgreementDetails = (await getOperation(operation)).value;

    userResponse.application.forEach((ap) => {
      let application = new MappableObjectForFront(ap, UserProfileApplicationMappings).data;
      application.organizationProviderType = getLabelFromValue(application.organizationProviderType, ORGANIZATION_PROVIDER_TYPES);
      application.applicationStatus = getLabelFromValue(application.applicationStatus, APPLICATION_STATUS_CODES, 'NEW');
      application.applicationType = getLabelFromValue(application.applicationType, CCOF_APPLICATION_TYPES);
      application.ccofProgramYearId = ap.ccof_ProgramYear?.ccof_program_yearid;
      application.ccofProgramYearName = ap.ccof_ProgramYear?.ccof_name;
      application.ccofProgramYearStatus = getLabelFromValue(ap.ccof_ProgramYear?.statuscode, PROGRAM_YEAR_STATUS_CODES);
      application.ccofApplicationStatus = getLabelFromValue(application.ccofStatus, CCOF_STATUS_CODES, 'NEW');
      application.facilityList = parseFacilityData(ap, userResponse.facilities);

      //add in funding agreement details based on the fiscal year
      let activeFundingAgreement = fundingAgreementDetails.find((fa) => fa._ccof_programyear_value === application.ccofProgramYearId && fa.statuscode === 1);
      if (activeFundingAgreement) {
        let fundingAgreementForFront = new MappableObjectForFront(activeFundingAgreement, FundingAgreementMappings).data;
        application = { ...application, ...fundingAgreementForFront };
      }
      applicationList.push(application);
    });
  }
  const results = {
    ...resData,
    ...user,
    ...organization,
    applications: applicationList,
  };
  return res.status(HttpStatus.OK).json(results);
}

async function getUserProfile(userGuid, userName) {
  try {
    let url = undefined;
    if (userGuid) {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderFiscalProfile?userId=${userGuid}&userName=${userName}`;
    } else {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderFiscalProfile?userName=${userName}`;
    }

    log.verbose('UserProfile Url is', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    if (e.response?.status == '404') {
      log.verbose('response ', e.response.data);
      if (e.response?.data?.startsWith('User not found')) {
        return null;
      }
      return {};
    }
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    throw e;
  }
}

// eslint-disable-next-line no-unused-vars
function updateFacilityWithChangeRequestDetails(changeRequestList, returnValue, facilityId) {
  for (const changeRequest of changeRequestList) {
    let changeActionNewFacilityList = changeRequest?.ccof_change_action_change_request?.filter((item) => item.ccof_changetype === CHANGE_REQUEST_TYPES.NEW_FACILITY);
    for (const changeActionNewFacility of changeActionNewFacilityList) {
      let result = changeActionNewFacility?.ccof_change_request_new_facility_change_act.find((item) => item['_ccof_facility_value'] === facilityId);
      //RLO - if facilityAccountNumber exists, then then don't update the facility statuses, since this is now part of the PCF
      if (result && !returnValue.facilityAccountNumber) {
        returnValue.changeRequestId = changeRequest?.ccof_change_requestid;
        returnValue.unlockCcfri = result?.ccof_unlock_ccfri;
        returnValue.unlockNmf = result?.ccof_unlock_nmf_rfi;
        returnValue.unlockRfi = result?.ccof_unlock_rfi;
      }
    }
  }
}

function parseFacilityData(application, facilities) {
  //all the facilites
  let facilityMap = new Map(facilities?.map((m) => [m['accountid'], new MappableObjectForFront(m, UserProfileFacilityMappings).data]));

  if (application) {
    facilityMap.forEach((value, key, map) => {
      let ccfriInfo = application.ccof_applicationccfri_Application_ccof_ap?.find((item) => item['_ccof_facility_value'] === key);
      ccfriInfo = new MappableObjectForFront(ccfriInfo, UserProfileCCFRIMappings).data;
      let eceweInfo = application.ccof_ccof_application_ccof_applicationecewe_application?.find((item) => item['_ccof_facility_value'] === key);
      eceweInfo = new MappableObjectForFront(eceweInfo, UserProfileECEWEMappings).data;
      let baseFunding = application.ccof_application_basefunding_Application?.find((item) => item['_ccof_facility_value'] === key);
      baseFunding = new MappableObjectForFront(baseFunding, UserProfileBaseFundingMappings).data;
      // let changeRequestList = userResponse.application.ccof_ccof_change_request_Application_ccof_appl;
      let returnValue = {
        ...value,
        ...ccfriInfo,
        ...eceweInfo,
        ...baseFunding,
      };
      // updateFacilityWithChangeRequestDetails(changeRequestList, returnValue, key);
      map.set(key, returnValue);
    });
  }
  let facilityList = [];
  facilityMap.forEach((facility) => {
    // //only add a facility to the application Facility List if they have an application id shown below.
    // //otherwise that facility does not exist in this application year.
    //if application status is incomplete, show all available facilties so CR fac's will also appear for the draft application
    if (facility.ccofBaseFundingId || facility.ccfriApplicationId || facility.eceweApplicationId || application.statuscode_formatted == 'Incomplete') {
      facility.ccofBaseFundingStatus = getLabelFromValue(facility.ccofBaseFundingStatus, CCOF_STATUS_CODES);
      facility.ccfriStatus = getLabelFromValue(facility.ccfriStatus, CCFRI_STATUS_CODES, 'NOT STARTED');
      facility.eceweStatus = getLabelFromValue(facility.eceweStatus, ECEWE_STATUS_CODES, 'NOT STARTED');
      facilityList.push(facility);
    }
  });
  return facilityList;
}

async function getDynamicsUserByEmail(req) {
  let email = req.session.passport.user._json.email;
  if (!email) {
    //If for some reason, an email is not associated with the IDIR, just use IDR@gov.bc.ca
    email = `${req.session.passport.user._json.idir_username}@gov.bc.ca`;
  }

  email.includes("'") ? (email = email.replace("'", "''")) : email;
  try {
    let response = await getOperation(`systemusers?$select=firstname,domainname,lastname&$filter=internalemailaddress eq '${email}'`);
    return response;
  } catch (e) {
    log.error('getDynamicsUserByEmail Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'API Get error' }, e);
  }
}

async function createUser(req, roleId) {
  log.info('No user found, creating BCeID User: ', getUserName(req));
  let given_name = req.session.passport.user._json.given_name;
  let family_name = req.session.passport.user._json.family_name;
  let firstname;
  let lastname;
  try {
    if (!family_name && given_name && given_name.split(' ').length > 1) {
      //If for some reason we don't have a last name from SSO, see if firstname has 2 words
      firstname = given_name.split(' ').slice(0, -1).join(' ');
      lastname = given_name.split(' ').slice(-1).join(' ');
    } else if (!given_name && family_name && family_name.split(' ').length > 1) {
      //If for some reason we don't have a firstname name from SSO, see if lastname has 2 words
      firstname = family_name.split(' ').slice(0, -1).join(' ');
      lastname = family_name.split(' ').slice(-1).join(' ');
    } else {
      firstname = given_name;
      lastname = family_name;
    }

    let payload = {
      ccof_userid: getUserGuid(req),
      firstname: firstname,
      lastname: lastname,
      emailaddress1: req.session.passport.user._json.email,
      ccof_username: getUserName(req),
      // Add a role for new users
      'ofm_portal_role_id@odata.bind': `/ofm_portal_roles(${roleId})`,
    };
    postOperation('contacts', payload);
  } catch (e) {
    log.error('Error when creating user: ', e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, { message: 'Error while creating a new BCeID User' }, e);
  }
}

module.exports = {
  getUserInfo,
  getUserProfile,
};
