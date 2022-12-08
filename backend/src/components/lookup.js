'use strict';
const {getOperation, getLabelFromValue, minify} = require('./utils');
const HttpStatus = require('http-status-codes');
const _ = require ('lodash');
const cache = require('memory-cache');
const { PROGRAM_YEAR_STATUS_CODES } = require('../util/constants');
const { ProgramYearMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

const lookupCache = new cache.Cache();

const organizationType = [
  {
    name: 'Non-Profit Society',
    id: 100000000
  },
  {
    name: 'Public Institution (college/university)',
    id: 100000001
  },
  {
    name: 'Registered Company',
    id: 100000002
  },
  {
    name: 'Local Government',
    id: 100000003
  },
  {
    name: 'First Nations Government',
    id: 100000004
  },
  {
    name: 'Sole Proprietorship or Partnership',
    id: 100000005
  }
];

function parseProgramYear(value) {
  let programYears = {
    current: undefined,
    future: undefined,
    list: []
  };
  value.forEach(item => {
    let p = new MappableObjectForFront(item, ProgramYearMappings).data;
    let currentStatus = p.status;
    p.status = getLabelFromValue(p.status, PROGRAM_YEAR_STATUS_CODES);
    if (currentStatus == PROGRAM_YEAR_STATUS_CODES.CURRENT) {
      programYears.current = p;
    } else if (currentStatus == PROGRAM_YEAR_STATUS_CODES.FUTURE) {
      programYears.future = p;
    }
    programYears.list.push(p);
  });
  programYears.list.sort((a,b) => { return b.order - a.order; } );
  return programYears;
}

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
    programYear = programYear.value;
    // function without filter 
    programYear = programYear.map(item => { return _(item).pick(['ccof_name', 'ccof_program_yearid', 'statuscode']); });
    //programYear = programYear.filter(item => item.statuscode ==1 || item.statuscode ==4).map(item => { return _.pick(item, ['ccof_name', 'ccof_program_yearid']); });

    let childCareCategory = await getOperation('ccof_childcare_categories');
    childCareCategory = childCareCategory.value;
    childCareCategory = childCareCategory.filter(item => item.statuscode ==1).map(item => { return _.pick(item, ['ccof_childcarecategorynumber', 'ccof_name', 'ccof_description', 'ccof_childcare_categoryid']); });
  
    resData = {
      'programYear': programYear,
      'childCareCategory': childCareCategory,
      'organizationType': organizationType
    };
    lookupCache.put('lookups', resData, 60 * 60 * 1000);
  }
  console.log('lookupData is: ', minify(resData));
  return res.status(HttpStatus.OK).json(resData);
}
module.exports = {
  getLookupInfo
};
