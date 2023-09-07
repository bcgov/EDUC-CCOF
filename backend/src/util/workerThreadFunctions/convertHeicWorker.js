const workerpool = require('workerpool');
const convert = require('heic-convert');
const log = require('../../components/logger');

async function convertHeicWithWorkerPool(heicInt8Array){
  log.verbose('convertHeicWithWorkerPool :: converting HEIC');
  const jpgBuffer = await convert({
    buffer: heicInt8Array,
    format: 'JPEG',
    quality: 0.5
  });
  log.verbose('convertHeicWithWorkerPool :: converted to JPG');

  return jpgBuffer; //this is sent via worker thread messaging which will be converted to an Int8Array.
}

workerpool.worker({
  convertHeicWithWorkerPool: convertHeicWithWorkerPool
});




