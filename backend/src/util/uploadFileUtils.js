'use strict';
const log = require('../components/logger');
const {Worker} = require('node:worker_threads');

function getFileExtension(fileName) {
  if (fileName)
    return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return '';
}

async function convertHeicDocumentToJpg(document) {

  for (let expectedProperty of ['documentbody', 'filesize', 'filename']) {
    if (!(expectedProperty in document)) {
      console.warn(`convertHeicDocumentToJpg :: key: ${expectedProperty} was not found. Please check the document parameter`);
    }
  }

  const heicBuffer = Buffer.from(document.documentbody, 'base64');

  log.verbose('convertHeicDocumentToJpg :: coverting from heic', {...document, documentbody: 'OMITTED'});

  const jpgBuffer = await _convertHeicDocumentToJpgWithWorker(heicBuffer);

  document.documentbody = jpgBuffer.toString('base64');
  document.filesize = jpgBuffer.byteLength;
  const regex = /\.heic(?![\s\S]*\.heic)/i; //looks for last occurrence of .heic case-insensitive
  document.filename = document.filename.replace(regex,'.jpg');

  log.verbose('convertHeicDocumentToJpg :: converted to jpg', {...document, documentbody: 'OMITTED'});

  return document;
}

async function _convertHeicDocumentToJpgWithWorker(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/workerThreadFunctions/convertHeicWorker.js`, {workerData: workerData});

    worker.on('message', result => {
      //messages sent on worker threads are converted to Int8Arrays. So we need to covert this back to a buffer for processing.
      const parsedResult = Buffer.from(result);
      resolve(parsedResult);
    });
    worker.on('error', error => reject(error));
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

module.exports = {
  convertHeicDocumentToJpg,
  getFileExtension
};

