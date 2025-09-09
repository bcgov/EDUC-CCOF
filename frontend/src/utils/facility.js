import { isEmpty } from 'lodash';
import { ORGANIZATION_FACILITY_STATUS_CODES, FUNDING_AGREEMENTS_STATUS } from './constants.js';

export function isFacilityActive(facility, application) {
  const orgHasFundingAgreementThisYear = !!(
    application?.fundingAgreementNumber && application?.internalStatus === FUNDING_AGREEMENTS_STATUS.ACTIVE
  );

  return (
    orgHasFundingAgreementThisYear &&
    !isEmpty(facility.facilityAccountNumber) &&
    facility.statusCode === ORGANIZATION_FACILITY_STATUS_CODES.ACTIVE
  );
}
