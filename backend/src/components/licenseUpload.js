'use strict';
const {postApplicationDocument, getApplicationDocument, deleteDocument, patchOperationWithObjectId,updateChangeRequestNewFacility} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');


async function saveLicenses(req, res) {
  try {

    let licenses = req.body.fileList;
    for (let license of licenses) {
      log.info('curr DOC is: ', license);
      let response = await postApplicationDocument(license);
      log.info('the response from license upload' , response);

      //bind the license to the change Request Action object so the Ministry can easily see all files related to the change Action.
      if (license.changeRequestNewFacilityId){
        let resp = await updateChangeRequestNewFacility(license.changeRequestNewFacilityId,
          {"ccof_Attachments@odata.bind": `/ccof_application_facility_documents(${response.applicationFacilityDocumentId})`}
        );
      }
    }
    const application ={};
    application.ccof_licensecomplete = req.body.isLicenseUploadComplete;
    await patchOperationWithObjectId('ccof_applications',req.body.applicationId, application);
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getLicenseFiles(req, res) {
  try {
    let response = await getApplicationDocument(req.params.applicationId);
    let licenseFiles = [];
    if (response?.value?.length > 0) {
      for (let fileInfo of response?.value) {
        if (fileInfo.subject === 'Facility License') {
          const licenseFile = {};
          licenseFile.filename = fileInfo.filename;
          licenseFile.annotationid = fileInfo.annotationid;
          licenseFile.ccof_facility = fileInfo['ApplicationFacilityDocument.ccof_facility'];
          licenseFile.ccof_application_facility_documentId = fileInfo['ApplicationFacilityDocument.ccof_application_facility_documentid'];
          licenseFiles.push(licenseFile);
        }
      }
    }
    return res.status(HttpStatus.OK).json(licenseFiles);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteLicenseFiles(req, res) {
  try {
    let deletedLicenses = req.body.deletedFiles;
    for (let license of deletedLicenses) {
      await deleteDocument(license.annotationid);
    }
    const application ={};
    application.ccof_licensecomplete = req.body.isLicenseUploadComplete;
    await patchOperationWithObjectId('ccof_applications',req.body.applicationId, application);
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }

}

module.exports = {
  saveLicenses,
  getLicenseFiles,
  deleteLicenseFiles
};
