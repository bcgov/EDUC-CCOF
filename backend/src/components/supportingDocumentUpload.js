'use strict';
const {postApplicationDocument, getApplicationDocument, deleteDocument} = require('./utils');
const HttpStatus = require('http-status-codes');


async function saveDocument(req, res) {
  try {
    let documents = req.body;
    for (let document of documents) {
      await postApplicationDocument(document);
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getUploadedDocuments(req, res) {
  try {
    let response = await getApplicationDocument(req.params.applicationId);
    let documentFiles = [];
    if (response?.value?.length > 0) {
      for (let fileInfo of response?.value) {
        if (fileInfo.subject !== 'Facility License') {
          const document = {};
          document.filename = fileInfo.filename;
          document.annotationid = fileInfo.annotationid;
          document.documentType = fileInfo.subject;
          document.ccof_facility = fileInfo['ApplicationFacilityDocument.ccof_facility'];
          document.ccof_facility_name = fileInfo['ApplicationFacilityDocument.ccof_facility@OData.Community.Display.V1.FormattedValue'];
          document.ccof_application_facility_documentId = fileInfo['ApplicationFacilityDocument.ccof_application_facility_documentid'];
          documentFiles.push(document);
        }
      }
    }
    return res.status(HttpStatus.OK).json(documentFiles);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteUploadedDocuments(req, res) {
  try {
    let deletedDocuments = req.body;
    for (let annotationid of deletedDocuments) {
      await deleteDocument(annotationid);
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }

}

module.exports = {
  saveDocument,
  getUploadedDocuments,
  deleteUploadedDocuments
};
