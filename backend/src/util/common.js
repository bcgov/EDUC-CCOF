'use strict';
function getFileExtension(fileName) {
  if (fileName)
    return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase();
  return '';
}

module.exports = {
  getFileExtension
};

