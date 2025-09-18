'use strict';
const { createScanner } = require('clamdjs');
const config = require('../config');
const HttpStatus = require('http-status-codes');
const { SCAN_RESULTS } = require('./constants');
const log = require('../components/logger');

async function scanFilePayload(req, res, next) {
  let documents = [];
  if (Array.isArray(req.body)) {
    documents = [...req.body];
  } else if (Array.isArray(req.body?.fileList)) {
    documents = [...req.body.fileList];
  } else if (Array.isArray(req.body?.documents)) {
    documents = [...req.body.documents];
  }

  let scanResults = await Promise.all(
    documents.map((file) => {
      const buffer = Buffer.from(file.documentbody, 'base64');
      log.info(`scanning file ${file.filename}`);
      return scanFile(buffer);
    }),
  );

  const isAllFilesClean = scanResults.every((result) => result === true);

  if (!isAllFilesClean) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'File(s) have failed the virus scan',
    });
  }

  // no virus found in file
  next();
}

async function scanFile(buffer) {
  try {
    const ClamAVScanner = createScanner(config.get('clamav:host'), Number(config.get('clamav:port')));
    const clamAVScanResult = await ClamAVScanner.scanBuffer(buffer, 3000, 1024 * 1024);
    if (clamAVScanResult.includes(SCAN_RESULTS.VIRUS_FOUND)) {
      log.error('ClamAV scan found possible virus');
      return false;
    }
    log.info('ClamAV scan found no virus in file, allowing upload');
  } catch (e) {
    // if virus scan is not to be performed/cannot be performed
    log.error('ClamAV Scanner was not found: ' + e);
    //assumption if scanner is not available we allow files to be uploaded.
  }
  return true;
}

module.exports = { scanFilePayload };
