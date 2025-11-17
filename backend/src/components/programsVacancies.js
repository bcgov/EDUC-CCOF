'use strict';

const { getOperation, patchOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { ProgramsVacanciesMappings } = require('../util/mapping/Mappings');
const { MappableObjectForBack, MappableObjectForFront } = require('../util/mapping/MappableObject');

async function getProgramsVacancies(req, res) {
  try {
    const response = await getOperation(`ccof_programandvacancieses?$filter=_ccof_facility_value eq ${req.query.facilityId}`);
    const programVacancies = response?.value?.map((record) => new MappableObjectForFront(record, ProgramsVacanciesMappings).toJSON());
    return res.status(HttpStatus.OK).json(programVacancies);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateProgramsVacancies(req, res) {
  try {
    const programVacanciesPayload = new MappableObjectForBack(req.body, ProgramsVacanciesMappings).toJSON();
    const response = await patchOperationWithObjectId('ccof_programandvacancieses', req.params.programsVacanciesId, programVacanciesPayload);
    res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = { getProgramsVacancies, updateProgramsVacancies };
