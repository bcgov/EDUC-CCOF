'use strict';
const convert = require('heic-convert');
const log = require('../components/logger');

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
  const jpgBuffer = await convert({
    buffer: heicBuffer,
    format: 'JPEG',
    quality: 0.5
  });

  log.verbose('convertHeicDocumentToJpg :: coverting from heic', {...document, documentbody: 'OMITTED'});

  document.documentbody = jpgBuffer.toString('base64');
  document.filesize = jpgBuffer.byteLength;
  const regex = /\.heic(?![\s\S]*\.heic)/i; //looks for last occurrence of .heic case-insensitive
  document.filename = document.filename.replace(regex,'.jpg');

  log.verbose('convertHeicDocumentToJpg :: converted to jpg', {...document, documentbody: 'OMITTED'});

  return document;
}

module.exports = {
  convertHeicDocumentToJpg,
  getFileExtension
};

