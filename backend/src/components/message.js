'use strict';
const { getOperation, getOperationWithObjectId, patchOperationWithObjectId, minify} = require('./utils');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { MessageMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const log = require('./logger');

function mapMessageObjectForFront(data) {
  if (data.createdon) {
    data.createdon = new moment(data.createdon).format('YYYY/MM/DD');
  }
  return new MappableObjectForFront(data, MessageMappings).toJSON();
}

async function getAllMessages(req, res) {
  try {
    let operation = 'emails?$select=activityid,createdon,description,lastopenedtime ,_regardingobjectid_value,subject&$expand=regardingobjectid_account_email($select=accountid,accountnumber,name)&$filter=(regardingobjectid_account_email/accountid eq ' + req.params.organizationId + ' and statecode eq 1)';
    log.info('operation: ', operation);
    let operationResponse = await getOperation(operation);
    let allMessages = [];
    operationResponse.value.forEach(item => {
      let message = mapMessageObjectForFront(item);
      allMessages.push(message);
    });
    return res.status(HttpStatus.OK).json(allMessages);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function getMessage(req, res) {
  try {
    let response = await getOperationWithObjectId('emails', req.params.messageId);
    let message = mapMessageObjectForFront(response.value);
    return res.status(HttpStatus.OK).json(message);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateMessageLastOpenedTime(req, res) {
  try {
    //let response = await patchOperationWithObjectId('emails', req.params.messageId, req.body);
    log.info('updateMessage: Response is: ', minify(response));
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

module.exports = {
  getMessage,
  getAllMessages,
  updateMessageLastOpenedTime
};

