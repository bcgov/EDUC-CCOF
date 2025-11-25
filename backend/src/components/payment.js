'use strict';
const { getOperation } = require('./utils');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { PaymentMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getPayments(req, res) {
  try {
    const { organizationId, programYearId } = req.query;
    const operation =
      'ofm_payments?$select=ofm_amount,_ofm_facility_value,ccof_facilityid,ofm_invoice_received_date,ofm_invoice_date,ofm_payment_type,statuscode,ofm_invoice_number,ccof_base_or_adjustment' +
      '&$expand=ccof_monthly_enrollment_report($select=ccof_month,ccof_year),' +
      'ofm_facility($select=ccof_facilitylicencenumber)' +
      `&$filter=(_ofm_organization_value eq ${organizationId} and _ccof_program_year_value eq ${programYearId})`;
    const response = await getOperation(operation);

    return res.status(HttpStatus.OK).json(
      response.value.map((payment) =>
        new MappableObjectForFront(
          {
            ...payment,
            ccof_month: payment.ccof_monthly_enrollment_report?.ccof_month,
            ccof_year: payment.ccof_monthly_enrollment_report?.ccof_year,
            ccof_facilitylicencenumber: payment.ofm_facility?.ccof_facilitylicencenumber,
          },
          PaymentMappings,
        ).toJSON(),
      ),
    );
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getPayments,
};
