'use strict';

const { getOperation } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ProgramsVacanciesMappings } = require('../util/mapping/Mappings');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getprogramsVacancies(req, res) {
  try {
    const response = await getOperation(`ccof_programandvacancieses?$filter=_ccof_facility_value eq ${req.query.facilityId}`);
    const programVacancies = response?.value?.map((record) => new MappableObjectForFront(record, ProgramsVacanciesMappings).toJSON());
    return res.status(HttpStatus.OK).json(programVacancies);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { getprogramsVacancies };
