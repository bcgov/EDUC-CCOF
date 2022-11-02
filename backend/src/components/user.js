'use strict';
const {getSessionUser, getHttpHeader} = require('./utils');
const config = require('../config/index');
const ApiError = require('./error');
const axios = require('axios');
const HttpStatus = require('http-status-codes');
const log = require('../components/logger');
const { APPLICATION_STATUS_CODES, CCFRI_STATUS_CODES, ECEWE_STATUS_CODES } = require('../util/constants');
const _ = require ('lodash');

async function getUserInfo(req, res) {

  let resData = {
    displayName: null,
    businessGuid: null,
    userName: null,
    organizationName: null,
    organizationId:  null,
    applicationStatus: null,
    //TODO: ApplicatioStatus and unreadMessages are hardcoded. Remove this with API values when built out!
    unreadMessages: true, 
    facilityList: [],
  };


  const userInfo = getSessionUser(req);
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No session data'
    });
  }

  //TODO: Rob to clean this up.
  let displayName = req.session.passport.user.displayName;
  if (!displayName) {
    displayName = req.session.passport.user._json.display_name;
  }
  let userName = req.session?.passport?.user?._json?.bceid_username;
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username;
  }
  let businessGuid = req.session?.passport?.user?._json?.bceid_business_guid;
  if (!businessGuid) {
    businessGuid = req.session?.passport?.user?._json?.idir_user_guid;
  }

  resData.displayName = displayName;
  resData.businessGuid = businessGuid;
  resData.userName = userName;

  //TODO: Use local variable businessGuid when users have been set up.
  //const userResponse = await getUserProfile('bb1defdf-7f9a-429f-be84-7668bd9e00ad');

  //take this out- this is just so I don't get Vue warnings anymore 
  const userResponse = [
    {
      "_ccof_organization_value": "e15067fb-6935-ed11-9db1-002248d53d53",
      "_ccof_businessbceid_value": "85b5ac01-8e51-ed11-bba3-000d3af4f630",
      "ECEWE.statuscode": 1,
      "Application.ccof_applicationtype": 100000002,
      "CCFRI.Facility.accountnumber": "G-02430-13470",
      "Organization.name": "NORTH OKANAGAN CHILD CARE SOCIETY",
      "ECEWE.ccof_name": "ID-22000027",
      "CCFRI.Facility.name": "MAVEN LANE - ARMSTRONG",
      "CCOF.ccof_name": "ID-22000037",
      "ProgramYear.statuscode": 1,
      "Application.ccof_name": "APP-22000060",
      "ECEWE.Facility.accountnumber": "G-02430-13470",
      "BCeID.ccof_userid": "bb1defdf-7f9a-429f-be84-7668bd9e00ad",
      "CCOF.ccof_facility": "730e2f0b-6c35-ed11-9db2-000d3af4f2d7",
      "CCFRI.ccof_facility": "730e2f0b-6c35-ed11-9db2-000d3af4f2d7",
      "ProgramYear.ccof_program_yearid": "2ad4c331-9434-ed11-9db1-002248d53d53",
      "Application.ccof_providertype": 100000000,
      "Application.ccof_programyear": "2ad4c331-9434-ed11-9db1-002248d53d53",
      "CCFRI.ccof_ccfrioptin": 1,
      "CCOF.statuscode": 1,
      "Organization.accountnumber": "G-02430",
      "CCFRI.ccof_applicationccfriid": "d35fe675-334b-ed11-bba2-000d3af4f80b",
      "ProgramYear.ccof_name": "2022/23 FY",
      "ECEWE.ccof_facility": "730e2f0b-6c35-ed11-9db2-000d3af4f2d7",
      "CCOF.Facility.name": "MAVEN LANE - ARMSTRONG",
      "CCOF.Facility.accountnumber": "G-02430-13470",
      "BCeID.ccof_username": "ccoftest05",
      "CCFRI.statuscode": 1,
      "Organization.accountid": "e15067fb-6935-ed11-9db1-002248d53d53",
      "Application.ccof_organization": "e15067fb-6935-ed11-9db1-002248d53d53",
      "ECEWE.ccof_optintoecewe": 1,
      "Application.ccof_applicationid": "cf5fe675-334b-ed11-bba2-000d3af4f80b",
      "Organization.ccof_accounttype": 100000000,
      "ECEWE.ccof_applicationeceweid": "dd5fe675-334b-ed11-bba2-000d3af4f80b",
      "Application.statuscode": 100000001,
      "ECEWE.Facility.name": "MAVEN LANE - ARMSTRONG",
      "CCOF.ccof_application_basefundingid": "d05fe675-334b-ed11-bba2-000d3af4f80b",
      "CCFRI.ccof_name": "ID-22000034"
    },
    {
      "_ccof_organization_value": "e15067fb-6935-ed11-9db1-002248d53d53",
      "_ccof_businessbceid_value": "85b5ac01-8e51-ed11-bba3-000d3af4f630",
      "ECEWE.statuscode": 1,
      "Application.ccof_applicationtype": 100000002,
      "CCFRI.Facility.accountnumber": "G-02430-99754",
      "Organization.name": "NORTH OKANAGAN CHILD CARE SOCIETY",
      "ECEWE.ccof_name": "ID-22000028",
      "CCFRI.Facility.name": "MAVEN LANE COLDSTREAM",
      "CCOF.ccof_name": "ID-22000038",
      "ProgramYear.statuscode": 1,
      "Application.ccof_name": "APP-22000060",
      "ECEWE.Facility.accountnumber": "G-02430-99754",
      "BCeID.ccof_userid": "bb1defdf-7f9a-429f-be84-7668bd9e00ad",
      "CCOF.ccof_facility": "6f5ade09-6c35-ed11-9db1-002248d53d53",
      "CCFRI.ccof_facility": "6f5ade09-6c35-ed11-9db1-002248d53d53",
      "ProgramYear.ccof_program_yearid": "2ad4c331-9434-ed11-9db1-002248d53d53",
      "Application.ccof_providertype": 100000000,
      "Application.ccof_programyear": "2ad4c331-9434-ed11-9db1-002248d53d53",
      "CCFRI.ccof_ccfrioptin": 1,
      "CCOF.statuscode": 1,
      "Organization.accountnumber": "G-02430",
      "CCFRI.ccof_applicationccfriid": "d65fe675-334b-ed11-bba2-000d3af4f80b",
      "ProgramYear.ccof_name": "2022/23 FY",
      "ECEWE.ccof_facility": "6f5ade09-6c35-ed11-9db1-002248d53d53",
      "CCOF.Facility.name": "MAVEN LANE COLDSTREAM",
      "CCOF.Facility.accountnumber": "G-02430-99754",
      "BCeID.ccof_username": "ccoftest05",
      "CCFRI.statuscode": 1,
      "Organization.accountid": "e15067fb-6935-ed11-9db1-002248d53d53",
      "Application.ccof_organization": "e15067fb-6935-ed11-9db1-002248d53d53",
      "ECEWE.ccof_optintoecewe": 1,
      "Application.ccof_applicationid": "cf5fe675-334b-ed11-bba2-000d3af4f80b",
      "Organization.ccof_accounttype": 100000000,
      "ECEWE.ccof_applicationeceweid": "de5fe675-334b-ed11-bba2-000d3af4f80b",
      "Application.statuscode": 100000001,
      "ECEWE.Facility.name": "MAVEN LANE COLDSTREAM",
      "CCOF.ccof_application_basefundingid": "d15fe675-334b-ed11-bba2-000d3af4f80b",
      "CCFRI.ccof_name": "ID-22000035"
    },

  ];  



  // If no data back, then no associated Organization/Facilities, return empty orgination data
  if (userResponse[0] === undefined){
    return res.status(HttpStatus.OK).json(resData);
  }

  //Organization is not normalized, grab organization info from the first element
  resData.organizationName  = userResponse[0]['Organization.name'];
  resData.organizationId  = userResponse[0]['BCeID.ccof_userid'];
  resData.applicationStatus  = APPLICATION_STATUS_CODES[userResponse[0]['Application.statuscode']];

  let facilityArr = userResponse.map(item => {
    return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]).value();
  });
  facilityArr.map( item => {
    item.ccfriStatus = CCFRI_STATUS_CODES[item.ccfriStatus];
    item.eceweStatus = ECEWE_STATUS_CODES[item.eceweStatus];
    return item;
  });
  resData.facilityList = facilityArr;
  
  return res.status(HttpStatus.OK).json(resData);
}

const GetUserProfileKeyMap = {
  'CCOF.ccof_facility' : 'facilityId',
  'CCOF.Facility.name' : 'facilityName',
  'CCFRI.statuscode' : 'ccfriStatus',
  'ECEWE.statuscode' : 'eceweStatus',
};


async function getUserProfile(businessGuid) {
  
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + `/api/UserProfile?userId=${businessGuid}`;
    log.verbose('UserProfile Url is', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error('getUserProfile Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

module.exports = {
  getUserInfo,
};
