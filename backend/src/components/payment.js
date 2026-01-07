'use strict';
const { getOperation } = require('./utils');
const { restrictFacilities } = require('../util/common');
const { MappableObjectForFront } = require('../util/mapping/MappableObject');
const { buildFilterQuery } = require('./utils');
const { PaymentMappings } = require('../util/mapping/Mappings');
const HttpStatus = require('http-status-codes');
const log = require('./logger');

async function getPayments(req, res) {
  try {
    const operation =
      'ofm_payments?$select=ofm_amount,_ofm_facility_value,ccof_facilityid,ofm_invoice_received_date,ofm_invoice_date,ofm_payment_type,statuscode,ofm_invoice_number,ccof_base_or_adjustment' +
      '&$expand=ccof_monthly_enrollment_report($select=ccof_month,ccof_year),' +
      'ofm_facility($select=ccof_facilitylicencenumber)' +
      `&${buildFilterQuery(req.query, PaymentMappings)}`;
    const response = await getOperation(operation);

    const mappedPayments = response.value.map((payment) =>
      new MappableObjectForFront(
        {
          ...payment,
          ccof_month: payment.ccof_monthly_enrollment_report?.ccof_month,
          ccof_year: payment.ccof_monthly_enrollment_report?.ccof_year,
          ccof_facilitylicencenumber: payment.ofm_facility?.ccof_facilitylicencenumber,
        },
        PaymentMappings,
      ).toJSON(),
    );
    const restrictedPayments = restrictFacilities(req, mappedPayments);
    return res.status(HttpStatus.OK).json(restrictedPayments);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getPayments,
};
