import { isEmpty } from 'lodash';
import { ORGANIZATION_FACILITY_STATUS_CODES, FUNDING_AGREEMENTS_STATUS } from './constants.js';
import { useApplicationStore } from '../store/application.js';

/**
 * Tests a facility to see if it is active.
 *
 * @see '../services/organizationService.js - loadFacilities'
 *
 * @param {Object} facility - A facility object
 * @param {String} facility.facilityId
 * @param {String} facility.facilityName
 * @param {Number} facility.statusCode
 * @param {String} facility.facilityAccountNumber
 * @param {String} facility.licenseNumber
 * @param {String} facility.addressLineOne
 * @param {String} facility.city
 */
export function isFacilityActive(facility) {
  const applicationStore = useApplicationStore();
  const application = applicationStore.applicationMap?.get(applicationStore.programYearId);
  const orgHasFundingAgreementThisYear = !!(
    application?.fundingAgreementNumber && application?.internalStatus === FUNDING_AGREEMENTS_STATUS.ACTIVE
  );

  return (
    orgHasFundingAgreementThisYear &&
    !isEmpty(facility.facilityAccountNumber) &&
    facility.statusCode === ORGANIZATION_FACILITY_STATUS_CODES.ACTIVE
  );
}
