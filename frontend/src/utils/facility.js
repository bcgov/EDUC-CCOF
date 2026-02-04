import { isEmpty } from 'lodash';

import { FUNDING_AGREEMENTS_STATUS, ORGANIZATION_FACILITY_STATUS_CODES } from './constants.js';

export function isFacilityActive(facility, applicationMap) {
  const orgHasFundingAgreementThisYear = [...(applicationMap?.values() ?? [])].some(
    (app) => app?.fundingAgreementNumber && app?.internalStatus === FUNDING_AGREEMENTS_STATUS.ACTIVE,
  );

  return (
    orgHasFundingAgreementThisYear &&
    !isEmpty(facility.facilityAccountNumber) &&
    facility.statusCode === ORGANIZATION_FACILITY_STATUS_CODES.ACTIVE
  );
}
