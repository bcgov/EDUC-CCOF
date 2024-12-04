import { FILE_EXTENSIONS_ACCEPT, MAX_FILE_SIZE } from '@/utils/constants.js';

/**
 * Converting bytes to human readable values (KB, MB, GB, TB, PB, EB, ZB, YB)
 * @param {*} bytes
 * @param {*} decimals
 */

export function humanFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileExtension(fileName) {
  if (fileName) return fileName.slice(fileName.lastIndexOf('.') + 1);
  return '';
}

export function getFileExtensionWithDot(fileName) {
  const extension = getFileExtension(fileName);
  return extension.length > 0 ? '.' + extension : '';
}

export function getFileNameWithMaxNameLength(fileName, nameLength = 30, extensionLength = 10) {
  const nameIndex = fileName.lastIndexOf('.') >>> 0;
  const name = fileName.slice(0, nameIndex > nameLength ? nameLength : nameIndex);
  const extension = getFileExtensionWithDot(fileName).substring(0, extensionLength);

  return name + extension;
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const binaryString = new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      const base64String = window.btoa(binaryString); // Convert to Base64
      const doc = {
        filename: getFileNameWithMaxNameLength(file.name),
        filesize: file.size,
        documentbody: base64String,
      };
      resolve(doc);
    };
    reader.onabort = () => {
      reject(new Error(`Error reading file: ${reader.error?.message || 'Unknown error'}`));
    };
    reader.onerror = () => {
      reject(new Error(`Error reading file: ${reader.error?.message || 'Unknown error'}`));
    };
  });
}

export function isValidFile(file) {
  const isLessThanMaxSize = file?.size < MAX_FILE_SIZE;
  const isFileExtensionAccepted = FILE_EXTENSIONS_ACCEPT.includes(getFileExtension(file?.name)?.toLowerCase());
  return isLessThanMaxSize && isFileExtensionAccepted;
}
