'use strict';

const axios = require('axios');
const config = require('../config/index');
const log = require('./logger');
const HttpStatus = require('http-status-codes');
const lodash = require('lodash');
const {ApiError} = require('./error');
const jsonwebtoken = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const {LocalDateTime, DateTimeFormatter} = require('@js-joda/core');
const {Locale} = require('@js-joda/locale_en');
let discovery = null;
const cache = require('memory-cache');

function getConstKey(constants, value) {
  if (value) {
    for (let key in constants) {
      if (constants[key] === value) {
        return key;
      }
    }
    log.error(`getConstKey: Unable to find key for value: [${value}] for const: [${constants.constructor?.name}]`);
  }
  return undefined;

}

function getLabelFromValue(value, constants, defaultValue) {
  if (!value && defaultValue) {
    return defaultValue;
  }
  if (value) {
    let retVal = getConstKey(constants,value);
    if (retVal) {
      return retVal;
    } else {
      return `UNKNOWN - [${value}]`;
    }
  }
  return value;
}

//const {getUserInfo} = require('./user.js');
let memCache = new cache.Cache();


axios.interceptors.request.use((axiosRequestConfig) => {
  axiosRequestConfig.headers['X-Client-Name'] = 'EDUC-CCOF';
  return axiosRequestConfig;
});
// Returns OIDC Discovery values
async function getOidcDiscovery() {
  if (!discovery) {
    try {
      const response = await axios.get(config.get('oidc:discovery'));
      discovery = response.data;
    } catch (error) {
      log.error('getOidcDiscovery', `OIDC Discovery failed - ${error.message}`);
    }
  }
  return discovery;
}

function minify(obj, keys = ['documentData']) {
  return lodash.transform(obj, (result, value, key) =>
    result[key] = keys.includes(key) && lodash.isString(value) ? value.substring(0, 1) + ' ...' : value);
}

function getSessionUser(req) {
  log.verbose('getSessionUser', req.session);
  const session = req.session;
  return session && session.passport && session.passport.user;
}

function getUserGuid(req) {
  const userInfo = req.session?.passport?.user;
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, {message: 'API Get error'});
  }
  let guid = req.session?.passport?.user?._json?.bceid_user_guid;
  if (!guid) {
    guid = req.session?.passport?.user?._json?.idir_user_guid;
  }
  return guid;
}
function isIdirUser(req) {
  const userInfo = req.session?.passport?.user;
  if (!userInfo || !userInfo.jwt || !userInfo._json) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, {message: 'API Get error'});
  }
  let isIdir = (req.session?.passport?.user?._json?.idir_user_guid) ? true : false;

  //For local development only.
  //generally set isIdirUser to false, so that developers can log in using their
  //IDIRS as a normal, non-ministry user.
  if ('local' === config.get('environment') && !config.get('server:useImpersonate')) {
    return false;
  }
  return isIdir;
}
function getUserName(req) {
  let userName = req.session?.passport?.user?._json?.bceid_username;
  if (!userName) {
    userName = req.session?.passport?.user?._json?.idir_username;
  }
  return userName;
}
function getAccessToken(req) {
  const user = getSessionUser(req);
  return user && user.jwt;
}

function logResponse(methodName, response) {
  if (log.isSillyEnabled) {
    log.info(`Status for ${methodName} :: is :: `, response.status);
    log.info(`StatusText for ${methodName}  :: is :: `, response.statusText);
    log.verbose(`Response for ${methodName}  :: is :: `, minify(response.data));
  }
}


async function forwardGetReq(req, res, url) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No access token'
      });
    }

    const params = {
      params: req.query
    };

    log.info('forwardGetReq Url', url);
    const data = await getDataWithParams(accessToken, url, params, req.session?.correlationID);
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    log.error('forwardGetReq Error', e.stack);
    return res.status(e.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Get error'
    });
  }
}

async function getData(token, url, correlationID) {
  try {
    const getDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4()
      }
    };

    log.info('get Data Url', url);
    const response = await axios.get(url, getDataConfig);
    log.info(`get Data Status for url ${url} :: is :: `, response.status);
    log.info(`get Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`get Data Response for url ${url}  :: is :: `, minify(response.data));

    return response.data;
  } catch (e) {
    log.error('getData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, {message: 'API Get error'}, e);
  }
}

async function deleteOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`;
  //log.info('del OPERATION:' , operationWithObject);
  return await deleteOperation(operationWithObject);
}

async function deleteOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
    log.info('delete Data Url', url);
    const response = await axios.delete(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error('deleteOperation Error', e.response ? e.response.status : e.message);
    log.info(e);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function getOperation(operation) {
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    //logResponse('getOperation', response);
    return response.data;
  } catch (e) {
    log.info(e);
    log.error('getOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function getOperationWithObjectId(operation, objectId) {
  const operationWithObject = `${operation}(${objectId})`;
  return await getOperation(operationWithObject);
}

async function postOperation(operation, payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operation;
  log.info('postOperation Url', url);

  if (log.isInfoEnabled) {
    log.verbose(`postOperation post data for ${url}  :: is :: `, minify(payload));
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    logResponse('postOperation', response);
    return response.data;
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Post error'}, e);
  }
}

async function postApplicationDocument(payload) {
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/ApplicationDocument';
  log.info('postApplicationDocument Url', url);
  if (log.isDebugEnabled()) {
    log.debug(`postApplicationDocument post data for ${url}  :: is :: `, minify(payload,['documentbody']));
  }
  try {
    const response = await axios.post(url, payload, getHttpHeader());
    logResponse('postApplicationDocument', response);
    return response.data;
  } catch (e) {
    log.error('postOperation Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Post error'}, e);
  }
}
async function getApplicationDocument(applicationID){
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/ApplicationDocument?applicationId=' + applicationID;
    log.info('get Data Url', url);
    const response = await axios.get(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' getApplicationDocument Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function deleteDocument(annotationid){
  try {
    const url = config.get('dynamicsApi:apiEndpoint') + '/api/Document?annotationid=' + annotationid;
    log.info('delete Data Url', url);
    const response = await axios.delete(url, getHttpHeader());
    return response.data;
  } catch (e) {
    log.error(' deleteDocument Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Get error'}, e);
  }
}

async function patchOperationWithObjectId(operation, objectId, payload) {
  const operationWithObject = `${operation}(${objectId})`;
  const url = config.get('dynamicsApi:apiEndpoint') + '/api/Operations?statement=' + operationWithObject;
  log.info('patchOperationWithObjectId Url', url);

  if (log.isInfoEnabled) {
    log.verbose(`patchOperationWithObjectId post data for ${url}  :: is :: `, minify(payload));
  }
  try {
    const response = await axios.patch(url, payload, getHttpHeader());
    logResponse('patchOperationWithObjectId', response);
    return response.data;
  } catch (e) {
    log.error(e);
    log.error('patchOperationWithObjectId Error', e.response ? e.response.status : e.message);
    throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, {message: 'API Patch error'}, e);
  }
}

function getHttpHeader() {
  let headers = null;
  if ('local' === config.get('environment')) {
    headers = {
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
      'auth': {
        'username': config.get('dynamicsApi:devBasicAuthUser'),
        'password': config.get('dynamicsApi:devBasicAuthPass')
      }
    };
  } else {
    headers = {
      'Accept': 'text/plain',
      'Content-Type': 'application/json',
    };
  }
  return headers;
}

async function getDataWithParams(token, url, params, correlationID) {
  try {
    params.headers = {
      Authorization: `Bearer ${token}`,
      correlationID: correlationID || uuidv4()
    };

    //log.info('get Data Url', url);
    const response = await axios.get(url, params);
    log.info(`get Data Status for url ${url} :: is :: `, response.status);
    log.info(`get Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`get Data Response for url ${url}  :: is :: `, minify(response.data));

    return response.data;
  } catch (e) {
    log.error('getDataWithParams Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, {message: 'API Get error'}, e);
  }
}

async function forwardPostReq(req, res, url) {
  try {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No session data'
      });
    }

    const data = await postData(accessToken, req.body, url, req.session?.correlationID);
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    log.error('forwardPostReq Error', e.stack);
    return res.status(e.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Forward Post error'
    });
  }
}

async function postData(token, data, url, correlationID) {
  try {
    const postDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4()
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    };

    log.info('post Data Url', url);
    log.verbose('post Data Req', minify(data));
    data.createUser = 'EDX';
    data.updateUser = 'EDX';
    const response = await axios.post(url, data, postDataConfig);

    log.info(`post Data Status for url ${url} :: is :: `, response.status);
    log.info(`post Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`post Data Response for url ${url}  :: is :: `, typeof response.data === 'string' ? response.data : minify(response.data));

    return response.data;
  } catch (e) {
    log.error('postData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    let responseData;
    if (e?.response?.data) {
      responseData = e.response.data;
    } else {
      responseData = {message: `API POST error, on ${url}`};
    }
    throw new ApiError(status, responseData, e);

  }
}

async function putData(token, data, url, correlationID) {
  try {
    const putDataConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
        correlationID: correlationID || uuidv4()
      }
    };

    log.info('put Data Url', url);
    log.verbose('put Data Req', data);
    data.updateUser = 'EDX';
    const response = await axios.put(url, data, putDataConfig);

    log.info(`put Data Status for url ${url} :: is :: `, response.status);
    log.info(`put Data StatusText for url ${url}  :: is :: `, response.statusText);
    log.verbose(`put Data Response for url ${url}  :: is :: `, minify(response.data));

    return response.data;
  } catch (e) {
    log.error('putData Error', e.response ? e.response.status : e.message);
    const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
    throw new ApiError(status, {message: 'API Put error'}, e);
  }
}

const SecureExchangeStatuses = Object.freeze({
  NEW: 'NEW',
  INPROG: 'INPROG',
  CLOSED: 'CLOSED'
});

function generateJWTToken(jwtid, subject, issuer, algorithm, payload) {

  const tokenTTL = config.get('email:tokenTTL'); // this should be in minutes
  const jwtSecretKey = config.get('email:secretKey');
  let sign_options_schema = {
    expiresIn: tokenTTL * 60,
    algorithm: algorithm,
    issuer: issuer,
    jwtid: jwtid,
    subject: subject
  };

  return jsonwebtoken.sign(payload, jwtSecretKey, sign_options_schema);
}

function formatCommentTimestamp(time) {
  const timestamp = LocalDateTime.parse(time);
  return timestamp.format(DateTimeFormatter.ofPattern('yyyy-MM-dd h:mma').withLocale(Locale.CANADA));
}

function errorResponse(res, msg, code) {
  return res.status(code || HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: msg || 'INTERNAL SERVER ERROR',
    code: code || HttpStatus.INTERNAL_SERVER_ERROR
  });
}
function getCodeTable(token, key, url, useCache = true) {
  try {
    let cacheContent = useCache && memCache.get(key);
    if (cacheContent) {
      return cacheContent;
    } else {
      const getDataConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      log.info('get Data Url', url);

      return axios.get(url, getDataConfig)
        .then(response => {
          useCache && memCache.put(key, response.data);
          return response.data;
        })
        .catch(e => {
          log.error(e, 'getCodeTable', 'Error during get on ' + url);
          const status = e.response ? e.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
          throw new ApiError(status, {message: 'API get error'}, e);
        });
    }
  } catch (e) {
    throw new Error(`getCodeTable error, ${e}`);
  }
}
function getCodes(urlKey, cacheKey, extraPath, useCache = true) {
  return async function getCodesHandler(req, res) {
    try {
      const token = getBackendToken(req);
      if (!token) {
        return unauthorizedError(res);
      }
      const url = config.get(urlKey);
      const codes = await getCodeTable(token, cacheKey, extraPath ? `${url}${extraPath}` : url, useCache);

      return res.status(HttpStatus.OK).json(codes);

    } catch (e) {
      log.error(e, 'getCodes', `Error occurred while attempting to GET ${cacheKey}.`);
      return errorResponse(res);
    }
  };
}

function getBackendToken(req) {
  const thisSession = req.session;
  return thisSession && thisSession['passport'] && thisSession['passport'].user && thisSession['passport'].user.jwt;
}
function unauthorizedError(res) {
  return res.status(HttpStatus.UNAUTHORIZED).json({
    message: 'No access token'
  });
}

const utils = {
  getOidcDiscovery,
  prettyStringify: (obj, indent = 2) => JSON.stringify(obj, null, indent),
  getSessionUser,
  getAccessToken,
  getUserGuid,
  isIdirUser,
  getUserName,
  forwardGetReq,
  getDataWithParams,
  getOperationWithObjectId,
  getOperation,
  postOperation,
  patchOperationWithObjectId,
  getData,
  forwardPostReq,
  postData,
  putData,
  SecureExchangeStatuses,
  generateJWTToken,
  formatCommentTimestamp,
  errorResponse,
  getCodes,
  getCodeTable,
  minify,
  getHttpHeader,
  getConstKey,
  getLabelFromValue,
  deleteOperationWithObjectId,
  deleteOperation,
  postApplicationDocument,
  getApplicationDocument,
  deleteDocument,
};

module.exports = utils;
