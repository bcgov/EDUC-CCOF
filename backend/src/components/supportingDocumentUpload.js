'use strict';
const { postApplicationDocument, getApplicationDocument, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { getFileExtension, convertHeicDocumentToJpg } = require('../util/uploadFileUtils');

async function saveDocument(req, res) {
  try {
    let documents = req.body;
    for (let document of documents) {
      let documentClone = document;
      let changeRequestNewFacilityId = documentClone.changeRequestNewFacilityId ?? null;
      delete documentClone.changeRequestNewFacilityId;
      if (getFileExtension(documentClone.filename) === 'heic') {
        log.verbose(`saveDocument :: heic detected for file name ${documentClone.filename} starting conversion`);
        documentClone = await convertHeicDocumentToJpg(documentClone);
      }
      let response = await postApplicationDocument(documentClone);
      //if this is a new facility change request, link supporting documents to the New Facility Change Action
      if (changeRequestNewFacilityId) {
        await patchOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId, {
          'ccof_Attachments@odata.bind': `/ccof_application_facility_documents(${response?.applicationFacilityDocumentId})`,
        });
      }
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function mapDocument(fileInfo) {
  const document = {};
  document.filename = fileInfo.filename;
  document.annotationid = fileInfo.annotationid;
  document.documentType = fileInfo.subject;
  document.ccof_facility = fileInfo['ApplicationFacilityDocument.ccof_facility'];
  document.ccof_facility_name = fileInfo['ApplicationFacilityDocument.ccof_facility@OData.Community.Display.V1.FormattedValue'];
  document.ccof_application_facility_documentId = fileInfo['ApplicationFacilityDocument.ccof_application_facility_documentid'];
  document.description = fileInfo.notetext;
  return document;
}

async function getUploadedDocuments(req, res) {
  try {
    let response = await getApplicationDocument(req.params.applicationId);
    const getAllFiles = req.query.allFiles || false;
    let documentFiles = [];
    if (response?.value?.length > 0) {
      for (let fileInfo of response?.value) {
        if (getAllFiles) {
          documentFiles.push(mapDocument(fileInfo));
        } else {
          if (fileInfo.subject !== 'Facility License') {
            documentFiles.push(mapDocument(fileInfo));
          }
        }
      }
    }
    return res.status(HttpStatus.OK).json(documentFiles);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  saveDocument,
  getUploadedDocuments,
};
