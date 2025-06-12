'use strict';
const log = require('../components/logger');
const workerpool = require('workerpool');
const pool = workerpool.pool(`${__dirname}/workerThreadFunctions/convertHeicWorker.js`, {
  minWorkers: 2,
  maxWorkers: 4,
});

function getFileExtension(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return '';
}

async function convertHeicDocumentToJpg(document) {
  for (let expectedProperty of ['documentbody', 'filesize', 'filename']) {
    if (!(expectedProperty in document)) {
      console.warn(`convertHeicDocumentToJpg :: key: ${expectedProperty} was not found. Please check the document parameter`);
    }
  }

  const heicBuffer = Buffer.from(document.documentbody, 'base64');

  log.verbose('convertHeicDocumentToJpg :: coverting from heic', { ...document, documentbody: 'OMITTED' });
  log.verbose('convertHeicDocumentToJpg :: worker pool statistics', pool.stats());
  const jpgBuffer = Buffer.from(await pool.exec('convertHeicWithWorkerPool', [heicBuffer]));

  document.documentbody = jpgBuffer.toString('base64');
  document.filesize = jpgBuffer.byteLength;
  const regex = /\.heic(?![\s\S]*\.heic)/i; //looks for last occurrence of .heic case-insensitive
  document.filename = document.filename.replace(regex, '.jpg');

  log.verbose('convertHeicDocumentToJpg :: converted to jpg', { ...document, documentbody: 'OMITTED' });

  return document;
}

module.exports = {
  convertHeicDocumentToJpg,
  getFileExtension,
};
