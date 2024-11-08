'use strict';
const { isEmpty } = require('lodash');
const { getOperation, patchOperationWithObjectId } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
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

function sortByPropertyDesc(property) {
  return function (a, b) {
    if (a[property] < b[property]) return 1;
    else if (a[property] > b[property]) return -1;
    return 0;
  };
}

async function getAllMessages(req, res) {
  try {
    let operation =
      'emails?$select=activityid,createdon,description,lastopenedtime,ccof_program_year,_regardingobjectid_value,subject&$expand=regardingobjectid_account_email($select=accountid,accountnumber,name)&$filter=(regardingobjectid_account_email/accountid eq ' +
      req.params.organizationId +
      ' and statecode eq 1)';
    log.info('operation: ', operation);
    let operationResponse = await getOperation(operation);
    operationResponse.value.sort(sortByPropertyDesc('createdon'));
    let allMessages = [];
    operationResponse.value.forEach((item) => {
      let message = mapMessageObjectForFront(item);
      message.isRead = !isEmpty(message.lastOpenedTime);
      allMessages.push(message);
    });
    return res.status(HttpStatus.OK).json(allMessages);
  } catch (e) {
    log.error('failed with error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateMessageLastOpenedTime(req, res) {
  try {
    let response = await patchOperationWithObjectId('emails', req.params.messageId, req.body);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getAllMessages,
  updateMessageLastOpenedTime,
};
