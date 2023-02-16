'use strict';
const {getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getLabelFromValue, postOperation, isIdirUser, getOperation} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES, CCOF_STATUS_CODES, CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES} = require('../util/constants');
const { UserProfileFacilityMappings, UserProfileOrganizationMappings, UserProfileBaseFundingMappings, UserProfileApplicationMappings, UserProfileCCFRIMappings, UserProfileECEWEMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const _ = require ('lodash');


async function getUserInfo(req, res) {

  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  const isIdir = isIdirUser(req);
  const queryUserName = req.params?.queryUserName;
  const userName = getUserName(req);

  // if is idir user (ministry user), make sure they are a user in dynamics
  if (isIdir) {
    let response = await getDynamicsUserByEmail(req);
    if (response.value?.length > 0 && response.value[0].systemuserid) {
      log.verbose(`Ministry user: [${req.session.passport.user._json.display_name}] logged in.`);
    } else {
      log.info(`Ministry user: [${req.session.passport.user._json.display_name}] attempted to log in but is not part of Dynamics.`);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Not Authorized'
      });
    }
  }
  
  let resData = {
    displayName: (queryUserName)? userName + '-' + queryUserName : userName,
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
          return res.status(HttpStatus.NOT_FOUND).json({message: 'No user found with that BCeID UserName'});
        }
      } catch (e) {
        log.error('getUserProfile Error', e.response ? e.response.status : e.message);
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
      }      
    } else {
      //If not looking for a username, return from here since ministry staff should not have an account
      return res.status(HttpStatus.OK).json(resData);
    }
  } else {
    //Not an idir user, so just get the guid from the header
    const userGuid = getUserGuid(req);
    log.verbose('User Guid is: ', userGuid);
    userResponse = await getUserProfile(userGuid, userName );
  }
  
  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:',minify(userResponse));
  }

  if (userResponse === null) { 
    creatUser(req);
    return res.status(HttpStatus.OK).json(resData);
  }
  if (userResponse === {}){
    // If no data back, then no associated Organization/Facilities, return empty orgination data
    return res.status(HttpStatus.OK).json(resData);
  }

  let organization = new MappableObjectForFront(userResponse, UserProfileOrganizationMappings).data;

  organization.fundingAgreementNumber = '1234-4567-6789'; //JB ! Hardcoded as it doesn't exist yet in dynamics. Update the UserProfileORgMappings when implemented :)

  let application = new MappableObjectForFront(userResponse.application, UserProfileApplicationMappings).data;
  application.organizationProviderType = getLabelFromValue(application.organizationProviderType, ORGANIZATION_PROVIDER_TYPES);
  application.applicationStatus = getLabelFromValue(application.applicationStatus, APPLICATION_STATUS_CODES, 'NEW');
  application.applicationType = getLabelFromValue(application.applicationType, CCOF_APPLICATION_TYPES);
  application.ccofProgramYearId = userResponse.application?.ccof_ProgramYear?.ccof_program_yearid;
  application.ccofProgramYearName = userResponse.application?.ccof_ProgramYear?.ccof_name;
  application.ccofApplicationStatus = getLabelFromValue(application.ccofStatus, CCOF_STATUS_CODES, 'NEW');

  resData.facilityList = parseFacilityData(userResponse);
  let results = {
    ...resData,
    ...organization,
    ...application
  };
  return res.status(HttpStatus.OK).json(results);
}

async function getUserProfile(userGuid, userName) {
  try {
    let url = undefined;
    if (userGuid) {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderProfile?userId=${userGuid}&userName=${userName}`;
    } else {
      url = config.get('dynamicsApi:apiEndpoint') + `/api/ProviderProfile?userName=${userName}`;
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

function parseFacilityData(userResponse) {
  let facilityMap  = new Map(userResponse.facilities?.map((m) => [m['accountid'], new MappableObjectForFront(m, UserProfileFacilityMappings).data]));

  if (userResponse.application) {
    facilityMap.forEach((value, key, map) => {
      let ccfriInfo = userResponse.application.ccof_applicationccfri_Application_ccof_ap?.find(item => item['_ccof_facility_value'] === key);
      ccfriInfo = new MappableObjectForFront(ccfriInfo, UserProfileCCFRIMappings).data;
      let eceweInfo = userResponse.application.ccof_ccof_application_ccof_applicationecewe_application?.find(item => item['_ccof_facility_value'] === key);
      eceweInfo = new MappableObjectForFront(eceweInfo, UserProfileECEWEMappings).data;
      let baseFunding = userResponse.application.ccof_application_basefunding_Application?.find(item => item['_ccof_facility_value'] === key);
      baseFunding = new MappableObjectForFront(baseFunding, UserProfileBaseFundingMappings).data;
      map.set(key, {
        ...value,
        ...ccfriInfo,
        ...eceweInfo,
        ...baseFunding});        
    });
  }
  let facilityList = [];
  facilityMap.forEach((facility) => {
    if (!_.isEmpty(facility)) {
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
  // eslint-disable-next-line quotes, 
  email.includes("'") ? email = email.replace("'", "''") : email;
  try {
    let response = await getOperation(`systemusers?$select=firstname,domainname,lastname&$filter=internalemailaddress eq '${email}'`);
    return response;
  } catch (e) {
    log.error('getDynamicsUserByEmail Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function creatUser(req) {
  log.info('No user found, creating BCeID User: ', getUserName(req));
  let given_name = req.session.passport.user._json.given_name; 
  let family_name = req.session.passport.user._json.family_name;
  let firstname = undefined;
  let lastname = undefined;
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
      ccof_username: getUserName(req)
    };
    postOperation('contacts', payload);
  } catch (e) {
    log.error('Error when creating user: ', e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'Error while creating a new BCeID User'}, e);
  }
}

module.exports = {
  getUserInfo,
};
