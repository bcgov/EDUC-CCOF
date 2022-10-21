'use strict';
const {getOperation} = require('./utils');
const HttpStatus = require('http-status-codes');
const _ = require ('lodash');
const cache = require('memory-cache');

const lookupCache = new cache.Cache();

async function getLookupInfo(req, res) {
  /**
   * Look ups from Dynamics365. 
   * status code values are:
   * 1 - Current
   * 2 - Inactive
   * 3 - Future
   * 4 - Historica
   */
  let resData = lookupCache.get('lookups');
  if (resData == undefined) {
    let programYear = await getOperation('ccof_program_years');
    // function without filter 
    // programYear = programYear.map(item => { return _(item).pick(['ccof_name', 'ccof_program_yearid', 'statuscode']); });
    programYear = programYear.filter(item => item.statuscode ==1).map(item => { return _.pick(item, ['ccof_name', 'ccof_program_yearid']); });

    let childCareCategory = await getOperation('ccof_childcare_categories'); 
    childCareCategory = childCareCategory.filter(item => item.statuscode ==1).map(item => { return _.pick(item, ['ccof_childcarecategorynumber', 'ccof_name', 'ccof_description', 'ccof_childcare_categoryid','statuscode']); });
  
    resData = {
      'programYear': programYear,
      'childCareCategory': childCareCategory
    };
    lookupCache.put('lookups', resData, 60 * 60 * 1000);
  }
  return res.status(HttpStatus.OK).json(resData);
}
module.exports = {
  getLookupInfo
};
