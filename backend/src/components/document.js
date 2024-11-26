'use strict';
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { ApplicationDocumentsMappings } = require('../util/mapping/Mappings');
const { postApplicationDocument, getApplicationDocument, deleteDocument } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

const { getFileExtension, convertHeicDocumentToJpg } = require('../util/uploadFileUtils');

async function createApplicationDocuments(req, res) {
  try {
    const documents = req.body;
    for (let document of documents) {
      let payload = new MappableObjectForBack(document, ApplicationDocumentsMappings).toJSON();
      payload.ccof_applicationid = document.ccof_applicationid;
      payload.ccof_facility = document.ccof_facility;
      if (getFileExtension(payload.filename) === 'heic') {
        log.verbose(`createApplicationDocuments :: heic detected for file name ${payload?.filename} starting conversion`);
        payload = await convertHeicDocumentToJpg(payload);
      }
      await postApplicationDocument(payload);
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getApplicationDocuments(req, res) {
  try {
    const documents = [];
    const response = await getApplicationDocument(req.params.applicationId);
    response?.value?.forEach((document) => documents.push(new MappableObjectForFront(document, ApplicationDocumentsMappings).toJSON()));
    return res.status(HttpStatus.OK).json(documents);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteUploadedDocuments(req, res) {
  try {
    const deletedDocuments = req.body;
    await Promise.all(
      deletedDocuments.map(async (annotationId) => {
        await deleteDocument(annotationId);
      }),
    );
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  createApplicationDocuments,
  getApplicationDocuments,
  deleteUploadedDocuments,
};
