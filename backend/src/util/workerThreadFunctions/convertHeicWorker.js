const {
  workerData, parentPort, isMainThread
} = require('node:worker_threads');

const convert = require('heic-convert');
const log = require('../../components/logger');

async function convertHeicWithWorkerThread() {

  log.verbose(`convertHeicWithWorkerThread :: on main thread = ${isMainThread}`);

  const heicBuffer = workerData;
  log.verbose('convertHeic :: converting HEIC on worker thread');
  const jpgBuffer = await convert({
    buffer: heicBuffer,
    format: 'JPEG',
    quality: 0.5
  });
  log.verbose('convertHeic :: converted to JPG on worker thread');

  parentPort.postMessage(jpgBuffer);
}

(convertHeicWithWorkerThread)();

