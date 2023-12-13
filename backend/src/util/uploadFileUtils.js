'use strict';
const log = require('../components/logger');
const config = require('../config/index');
const workerpool = require('workerpool');
const HttpStatus = require('http-status-codes');
const {createScanner} = require('clamdjs');
const pool = workerpool.pool(`${__dirname}/workerThreadFunctions/convertHeicWorker.js`, {
  minWorkers: 2,
  maxWorkers: 4
});

function getFileExtension(fileName) {
  if (fileName)
    return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return '';
}

async function convertHeicDocumentToJpg(document) {

  for (let expectedProperty of ['documentbody', 'filesize', 'filename']) {
    if (!(expectedProperty in document)) {
      log.warn(`convertHeicDocumentToJpg :: key: ${expectedProperty} was not found. Please check the document parameter`);
    }
  }

  const heicBuffer = Buffer.from(document.documentbody, 'base64');

  log.verbose('convertHeicDocumentToJpg :: coverting from heic', {...document, documentbody: 'OMITTED'});
  log.verbose('convertHeicDocumentToJpg :: worker pool statistics', pool.stats());
  const jpgBuffer = Buffer.from(await pool.exec('convertHeicWithWorkerPool', [heicBuffer]));

  document.documentbody = jpgBuffer.toString('base64');
  document.filesize = jpgBuffer.byteLength;
  const regex = /\.heic(?![\s\S]*\.heic)/i; //looks for last occurrence of .heic case-insensitive
  document.filename = document.filename.replace(regex,'.jpg');

  log.verbose('convertHeicDocumentToJpg :: converted to jpg', {...document, documentbody: 'OMITTED'});

  return document;
}

async function scanFile(base64File){
  if (config.get('clamav:enabled')) {
    try{
      const ClamAVScanner = createScanner(config.get('clamav:host'), Number(config.get('clamav:port')));
      const clamAVScanResult = await ClamAVScanner.scanBuffer(Buffer.from(base64File, 'base64'), 3000, 1024 * 1024);
      if (clamAVScanResult.includes('FOUND')) {
        log.info('ClamAV scan found possible virus');
        return false;
      }
    } catch (e) {
      // if virus scan is not to be performed/cannot be performed
      log.warn('ClamAV Scanner was not found: ' + e);
      return (config.get('clamav:passOnError'));
    }
    log.verbose('ClamAV scan found no virus in file, allowing upload...');
    return true;
  } else {
    return true;
  }
}

module.exports = {
  convertHeicDocumentToJpg,
  getFileExtension,
  scanFile
};

