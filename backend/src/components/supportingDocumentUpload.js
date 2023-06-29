'use strict';
const {postApplicationDocument, getApplicationDocument, deleteDocument, postOperationWithObjectId} = require('./utils');
const HttpStatus = require('http-status-codes');


async function saveDocument(req, res) {
  try {
    let documents = req.body;
    for (let document of documents) {
      
      let changeRequestNewFacilityId = document.changeRequestNewFacilityId;
      delete document.changeRequestNewFacilityId;
      let response = await postApplicationDocument(document);
      //if this is a new facility change request, link supporting documents to the New Facility Change Action
      if (changeRequestNewFacilityId) {
        await postOperationWithObjectId('ccof_change_request_new_facilities', changeRequestNewFacilityId, {
          "ccof_Attachments@odata.bind": `/ccof_application_facility_documents(${response?.applicationFacilityDocumentId})`
        });
      }
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
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
        if(getAllFiles){
          documentFiles.push(mapDocument(fileInfo));
        }
        else{
          if(fileInfo.subject !== 'Facility License') {
            documentFiles.push(mapDocument(fileInfo));
          }
        }

      }
    }
    return res.status(HttpStatus.OK).json(documentFiles);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getAllUploadedDocuments(req, res) {
  try {
    let response = await getApplicationDocument(req.params.applicationId);
    let documentFiles = [];
    if (response?.value?.length > 0) {
      for (let fileInfo of response?.value) {
        const document = {};
        document.filename = fileInfo.filename;
        document.annotationid = fileInfo.annotationid;
        document.documentType = fileInfo.subject;
        document.ccof_facility = fileInfo['ApplicationFacilityDocument.ccof_facility'];
        document.ccof_facility_name = fileInfo['ApplicationFacilityDocument.ccof_facility@OData.Community.Display.V1.FormattedValue'];
        document.ccof_application_facility_documentId = fileInfo['ApplicationFacilityDocument.ccof_application_facility_documentid'];
        document.description=fileInfo.notetext;
        documentFiles.push(document);
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
