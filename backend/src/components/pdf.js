'use strict';
const { getSubmissionPDFHistory, getDocument } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { PdfDocumentMappings } = require('../util/mapping/Mappings');

async function getPdf(req, res) {
  try {
    const response = await getDocument(req.params.annotationId);

    if (!response.value[0]) {
      return res.status(HttpStatus.NOT_FOUND).json('Document not found');
    }

    res.setHeader('Content-disposition', 'inline; filename=' + response.value[0].filename);
    res.setHeader('Content-type', 'application/pdf');
    return res.status(HttpStatus.OK).send(Buffer.from(response.value[0].documentbody, 'base64'));
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

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
  getPdf,
  getPdfs,
};
