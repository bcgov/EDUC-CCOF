'use strict';
const { getSubmissionPDFHistory } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { PdfDocumentMappings } = require('../util/mapping/Mappings');

async function getPdfs(req, res) {
  try {
    const response = await getSubmissionPDFHistory(req.params.organizationId);
    log.info('getSubmissionPDFHistory for organization: ' + req.params.organizationId);
    log.info(response);
    let documentList = [];
    response?.forEach((document) => documentList.push(new MappableObjectForFront(document, PdfDocumentMappings)));
    return res.status(HttpStatus.OK).json(documentList);
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getPdfs,
};
