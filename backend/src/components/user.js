'use strict';
const {getSessionUser, getHttpHeader, minify, getUserGuid, getUserName, getLabelFromValue, postOperation, isIdirUser, getOperation} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES, CCOF_STATUS_CODES, OPTIN_STATUS_CODES, ORGANIZATION_PROVIDER_TYPES} = require('../util/constants');
const { UserProfileFacilityMappings, UserProfileOrganizationMappings, UserProfileCCFRIMappings, UserProfileECEWEMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const _ = require ('lodash');



async function getUserInfo(req, res) {

  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }
  let isIdir = isIdirUser(req);
  let userName = req.params?.userName;

  // if is idir user (ministry user), make sure they are a user in dynamics
  if (isIdir) {
    let response = await getDynamicsUserByEmail(req.session.passport.user._json.email);
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
    displayName: (userName)? req.session.passport.user._json.display_name + '-' + userName : req.session.passport.user._json.display_name,
    userName: getUserName(req),
    email: req.session.passport.user._json.email,
    isMinistryUser: isIdir,
    organizationName: null,
    organizationId:  null,
    applicationId: null,
    applicationStatus: null,
    //TODO: unreadMessages is hardcoded. Remove this with API values when built out!
    unreadMessages: false, 
    facilityList: [],
  };
  let userGuid = undefined;
  if (isIdir) {
    if (userName) {
      try {
        let profileData = await getOperation(`contacts?$select=ccof_userid,firstname,lastname&$filter=ccof_username eq '${userName}'`);
        if (profileData.value?.length > 0) {
          //found something.
          userGuid = profileData.value[0].ccof_userid;
          if (!userGuid) {
            //found the account but no user guid associated
            return res.status(HttpStatus.CONFLICT).json({
              message: 'User found but no User Guid associated'
            });
          }
        } else {
          //didn't find that user
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'No user found with that BCeID UserName'
          });
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
    userGuid = getUserGuid(req);
  }
  log.verbose('User Guid is: ', userGuid);
  const userResponse = await getUserProfile(userGuid);

  if (log.isVerboseEnabled) {
    log.verbose('getUserProfile response:',minify(userResponse));
  }

  if (userResponse === null) { 
    // creatUser(req); TODO: create the user
    return res.status(HttpStatus.OK).json(resData);
  }
  if (userResponse[0] === undefined){
    // If no data back, then no associated Organization/Facilities, return empty orgination data
    return res.status(HttpStatus.OK).json(resData);
  }

  //Organization is not normalized, grab organization info from the first element
  let organization = new MappableObjectForFront(userResponse[0], UserProfileOrganizationMappings).data;
  
  organization.applicationStatus = getLabelFromValue(organization.applicationStatus, APPLICATION_STATUS_CODES, 'NEW');
  organization.organizationProviderType = getLabelFromValue(organization.organizationProviderType, ORGANIZATION_PROVIDER_TYPES);
  resData.facilityList = parseFacilityData(userResponse);
  let results = {
    ...resData,
    ...organization
  };
  return res.status(HttpStatus.OK).json(results);
}

async function getUserProfile(businessGuid) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + `/api/UserProfile?userId=${businessGuid}`;
    log.verbose('UserProfile Url is', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    if (e.response?.status == '404') {
      console.log('response ', e.response.data);
      if (e.response?.data?.startsWith('User not found')) {
        return null;
      }
      return [];
    }
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

function parseFacilityData(userResponse) {
  const facilityMap  = new Map(userResponse.map((m) => [m['CCOF.ccof_facility'], new MappableObjectForFront(m, UserProfileFacilityMappings).data]));
  facilityMap.forEach((value,key, map) => {
    map[key] = new MappableObjectForFront(value, UserProfileFacilityMappings).data;
  });

  facilityMap.forEach((value, key, map) => {
    userResponse.forEach(facility => {
      let ccfriInfo = undefined;
      let eceweInfo = undefined;
      if (facility['CCFRI.ccof_facility'] === key) {
        ccfriInfo = new MappableObjectForFront(facility, UserProfileCCFRIMappings).data;
      }
      if (facility['ECEWE.ccof_facility'] === key) {
        eceweInfo = new MappableObjectForFront(facility, UserProfileECEWEMappings).data;
      }
      if (ccfriInfo || eceweInfo) {
        map.set(key, {
          ...value,
          ...ccfriInfo,
          ...eceweInfo});        
      }     
    });
  });

  let facilityList = [];
  facilityMap.forEach((facility) => {
    if (!_.isEmpty(facility)) {
      facility.ccofBaseFundingStatus = getLabelFromValue(facility.ccofBaseFundingStatus, CCOF_STATUS_CODES);
      facility.ccfriStatus = getLabelFromValue(facility.ccfriStatus, CCFRI_STATUS_CODES);
      facility.ccfriOptInStatus = getLabelFromValue(facility.ccfriOptInStatus, OPTIN_STATUS_CODES);
      facility.eceweStatus = getLabelFromValue(facility.eceweStatus, ECEWE_STATUS_CODES);
      facility.eceweOptInStatus = getLabelFromValue(facility.eceweOptInStatus, OPTIN_STATUS_CODES);
      facilityList.push(facility);
    }
  });
  return facilityList;
}

async function getDynamicsUserByEmail(email) {
  try {
    let response = await getOperation(`systemusers?$select=firstname,domainname,lastname&$filter=internalemailaddress eq '${email}'`);
    return response;
  } catch (e) {
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function creatUser(req) {
  try {
    let payload = {
      ccof_userid: getUserGuid,
      firstname: req.session.passport.user._json.given_name,
      lastname: req.session.passport.user._json.family_name,
      emailaddress1: req.session.passport.user._json.email,
      ccof_username: getUserName(req)
    };
    postOperation('contacts', payload);
  } catch (e) {
    log.error('Error when creating user: ', e);
    throw e;
  }
}



module.exports = {
  getUserInfo,
};
