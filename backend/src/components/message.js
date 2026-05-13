'use strict';
const { isEmpty } = require('lodash');
const { getOperation, patchOperationWithObjectId } = require('./utils');
const { isProgramYear2024OrLater } = require('../util/common');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { MessageMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const log = require('./logger');

function mapMessageObjectForFront(data) {
  if (data.createdon) {
    data.createdon = new moment(data.createdon).format('YYYY/MM/DD');
  }
  let mappedMessage = new MappableObjectForFront(data, MessageMappings).toJSON();
  mappedMessage.isRead = !isEmpty(mappedMessage.lastOpenedTime);
  return mappedMessage;
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
    const operation = `emails?$select=activityid,createdon,description,lastopenedtime,ccof_program_year,_regardingobjectid_value,subject&$expand=regardingobjectid_account_email($select=accountid,accountnumber,name)&$filter=(regardingobjectid_account_email/accountid eq
      ${req.params.organizationId}
       and statecode eq 1)`;
    log.verbose('operation: ', operation);
    const response = await getOperation(operation);
    const messages = response.value
      .filter((message) => isProgramYear2024OrLater(message.ccof_program_year))
      .sort(sortByPropertyDesc('createdon'))
      .map((item) => mapMessageObjectForFront(item));
    return res.status(HttpStatus.OK).json(messages);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateMessageLastOpenedTime(req, res) {
  try {
    await patchOperationWithObjectId('emails', req.params.messageId, req.body);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getAllMessages,
  updateMessageLastOpenedTime,
};
