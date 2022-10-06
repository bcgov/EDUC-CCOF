'use strict';
const { logApiError, errorResponse} = require('./utils');

async function getFacilityByName(req, res) {
  try {
    if (!req.query.mincode) {
      let allActiveSchools = [];
      return res.status(200).json(allActiveSchools ? allActiveSchools : []);
    }
    let schoolName = 'schoolname'; //cacheService.getSchoolNameJSONByMincode(req.query.mincode);
    if (!schoolName) {
      return res.status(200).json();
    }
    return res.status(200).json(schoolName);
  } catch (e) {
    logApiError(e, 'getFacilityByName', 'Error occurred while attempting to GET Facility.');
    return errorResponse(res);
  }
}

module.exports = {
  getFacilityByName
};
