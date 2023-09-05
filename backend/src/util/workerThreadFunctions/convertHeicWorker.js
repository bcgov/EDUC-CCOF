const workerpool = require('workerpool');
const convert = require('heic-convert');
const log = require('../../components/logger');

async function convertHeicWithWorkerPool(heicInt8Array){
  const heicBuffer = Buffer.from(heicInt8Array); //messages sent on worker threads are converted to Int8Arrays. So we need to covert this back to a buffer for processing.
  log.verbose('convertHeicWithWorkerPool :: converting HEIC');
  const jpgBuffer = await convert({
    buffer: heicBuffer,
    format: 'JPEG',
    quality: 0.5
  });
  log.verbose('convertHeicWithWorkerPool :: converted to JPG');

  return jpgBuffer; //this is sent via worker thread messaging which will be converted to an Int8Array.
}

workerpool.worker({
  convertHeicWithWorkerPool: convertHeicWithWorkerPool
});




