/* eslint-disable quotes */
'use strict';
const {
  getOperation,
  getDocument
} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const {MappableObjectForFront} = require('../util/mapping/MappableObject');
const {
  PdfDocumentMappings
} = require('../util/mapping/Mappings');

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
    const operationParentApplication = `ccof_applications?$filter=ccof_applicationid eq ${req.params.applicationId}`;
    const parentApplicationResponse = await getOperation(operationParentApplication);
    const type = parentApplicationResponse.value[0]['ccof_applicationtype@OData.Community.Display.V1.FormattedValue'];
    const fiscalYear = parentApplicationResponse.value[0]['_ccof_programyear_value@OData.Community.Display.V1.FormattedValue'];

    const operationSummaryDeclaration = `ccof_applicationsummaries?$filter=_ccof_application_value eq ${req.params.applicationId}&$expand=ccof_applicationsummary_Annotations($select=annotationid,filename,subject,filesize, createdon)`;
    const summaryDeclarationResponse = await getOperation(operationSummaryDeclaration);

    const operationRequestChange = `ccof_change_request_summaries?$select=ccof_name&$expand=ccof_change_request_summary_Annotations($select=filename,annotationid,subject,filesize,createdon),ccof_changerequest($select=ccof_change_requestid, ccof_name,_ccof_application_value,ccof_changetypes)&$filter=(ccof_changerequest/_ccof_application_value eq ${req.params.applicationId})`;
    const requestChangeResponse = await getOperation(operationRequestChange);

    let documentList = []
    
    for (let document of summaryDeclarationResponse.value) {
      let documentForFront = new MappableObjectForFront(document.ccof_applicationsummary_Annotations[0], PdfDocumentMappings);
      documentForFront.data.appId = document['_ccof_application_value@OData.Community.Display.V1.FormattedValue'];
      documentForFront.data.subject = type;
      documentForFront.data.fiscalYear = fiscalYear;
      documentList.push(documentForFront);
    }
    
    for (let document of requestChangeResponse.value) {
      if(document?.ccof_change_request_summary_Annotations?.length>0){
        let documentForFront = new MappableObjectForFront(document.ccof_change_request_summary_Annotations[0], PdfDocumentMappings);
        documentForFront.data.appId = document.ccof_changerequest.ccof_name;
        documentForFront.data.subject = document.ccof_changerequest['ccof_changetypes@OData.Community.Display.V1.FormattedValue'];
        documentForFront.data.fiscalYear = fiscalYear;
        documentList.push(documentForFront);
      }
    }
    return res.status(HttpStatus.CREATED).json(documentList);
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getPdf,
  getPdfs
};
