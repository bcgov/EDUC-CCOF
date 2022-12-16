'use strict';
const {postApplicationDocument, getApplicationDocument, deleteDocument} = require('./utils');
const HttpStatus = require('http-status-codes');


async function saveLicenses(req, res) {
  try {
    let licenses = req.body;
    for (let license of licenses) {
      await postApplicationDocument(license);
    }
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
    let deletedLicenses = req.body;
    for (let license of deletedLicenses) {
      await deleteDocument(license.annotationid);
    }
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
