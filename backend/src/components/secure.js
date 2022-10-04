'use strict';
const {
  getSessionUser,
  getAccessToken,
  deleteData,
  getData,
  postData,
  SecureExchangeStatuses,
  errorResponse,
} = require('./utils');
const config = require('../config/index');
const log = require('./logger');

const HttpStatus = require('http-status-codes');
const {ServiceError} = require('./error');

function verifyRequest(req, res, next) {
  const userInfo = getSessionUser(req);
  if (!userInfo) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      status: HttpStatus.UNAUTHORIZED,
      message: 'you are not authorized to access this page'
    });
  }

  const secureExchangeID = req.params.id;
  if (!req || !req.session || !req.session['secureExchange'] || req.session['secureExchange']['secureExchangeID'] !== secureExchangeID) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: 'Wrong secureExchangeID'
    });
  }

  next();
}

function validateAccessToken(token, res){
  if (!token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No access token'
    });
  }
}

async function uploadFile(req, res) {
  try {
    const token = getAccessToken(req);
    validateAccessToken(token, res);

    if (!req.session['secureExchange'] || req.session['secureExchange']['secureExchangeStatusCode'] === SecureExchangeStatuses.CLOSED) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Upload secureExchange file not allowed'
      });
    }

    const endpoint = config.get('edx:exchangeURL');
    const url = `${endpoint}/${req.params.id}/documents`;

    const edxUserInfo = req.session.edxUserData;
    if (!edxUserInfo) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No EDX User Info token'
      });
    }

    req.body.edxUserID = edxUserInfo.edxUserID;

    const data = await postData(token, req.body, url, req.session?.correlationID);
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    log.error('uploadFile Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Upload secureExchange file error'
    });
  }
}

async function getDocument(token, secureExchangeID, documentID, correlationID) {
  try {
    const endpoint = config.get('edx:exchangeURL');
    return await getData(token, `${endpoint}/${secureExchangeID}/documents/${documentID}`, correlationID);
  } catch (e) {
    throw new ServiceError('getDocument error', e);
  }
}

async function deleteDocument(req, res) {
  try {
    const token = getAccessToken(req);
    validateAccessToken(token, res);

    let resData = await getDocument(token, req.params.id, req.params.documentId, req.session?.correlationID);
    let secureExchangeData = await getData(token, config.get('edx:exchangeURL') + `/${req.params.id}`, req.session?.correlationID);
    if ( ! resData ||  secureExchangeData['secureExchangeStatusCode'] === 'CLOSED') {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Delete secureExchange file not allowed'
      });
    }

    const endpoint = config.get('edx:exchangeURL');
    const url = `${endpoint}/${req.params.id}/documents/${req.params.documentId}`;
    await deleteData(token, url, req.session?.correlationID);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error('deleteDocument Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Delete secureExchange document error',
      errorSource: e.errorSource
    });
  }
}

async function downloadFile(req, res) {
  try {
    const token = getAccessToken(req);
    validateAccessToken(token, res);

    let resData = await getDocument(token, req.params.id, req.params.documentId, req.session?.correlationID);

    res.setHeader('Content-disposition', 'attachment; filename=' + resData.fileName?.replace(/ /g, '_').replace(/,/g, '_').trim());
    res.setHeader('Content-type', resData.fileExtension);

    return res.status(HttpStatus.OK).send(Buffer.from(resData.documentData, 'base64'));
  } catch (e) {
    log.error('downloadFile Error', e.stack);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Download secureExchange file error',
      errorSource: e.errorSource
    });
  }
}

async function clearActiveSession(req) {
  req.session.activeInstituteIdentifier = '';
  req.session.activeInstituteType = '';
  req.session.activeInstitutePermissions = '';
  req.session.activeInstituteTitle = '';
}

async function removeUserSchoolAccess(req, res) {
  try {
    const token = getAccessToken(req);
    validateAccessToken(token, res);
    let permission = req.session.activeInstitutePermissions.includes('EDX_USER_SCHOOL_ADMIN');
    if (req.session.activeInstituteIdentifier !== req.body.params.mincode || !permission) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: HttpStatus.UNAUTHORIZED,
        message: 'You are not authorized to access this page'
      });
    }

    await deleteData(token, config.get('edx:edxUsersURL') + `/${req.body.params.userToRemove}` + '/school' + `/${req.body.params.userSchoolID}`, req.session.correlationID);

    return res.status(HttpStatus.OK).json('');
  } catch (e) {
    log.error(e, 'removeUserSchoolAccess', 'Error occurred while attempting to remove user school access.');
    return errorResponse(res);
  }
}

async function findPrimaryEdxActivationCode(req, res) {
  const token = getAccessToken(req);
  if (!token && req.session.userMinCodes) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'No access token'
    });
  }
  let permission = req.session.activeInstitutePermissions.includes('EDX_USER_SCHOOL_ADMIN');
  if (req.session.activeInstituteIdentifier !== req.params.mincode || !permission) {
    return res.status(HttpStatus.FORBIDDEN).json({
      status: HttpStatus.FORBIDDEN,
      message: 'You do not have permission to access this information'
    });
  }

  try {
    const data = await getData(token, config.get('edx:activationCodeUrl') + `/primary/${req.params.mincode}`, req.session?.correlationID);
    return res.status(HttpStatus.OK).json(data);
  } catch (e) {
    if (e.status === 404) {
      return res.status(HttpStatus.NOT_FOUND).json();
    }
    log.error(e, 'findPrimaryEdxActivationCode', 'Error getting findPrimaryEdxActivationCode.');
    return errorResponse(res);
  }
}



module.exports = {
  verifyRequest,
  downloadFile,
  uploadFile,
  deleteDocument,
  removeUserSchoolAccess,
  findPrimaryEdxActivationCode,
  clearActiveSession
};
