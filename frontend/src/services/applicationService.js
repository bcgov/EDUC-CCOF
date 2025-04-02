import { isEmpty } from 'lodash';

import { hasEmptyFields } from '@/utils/common.js';
import { APPLICATION_TEMPLATE_VERSIONS, DOCUMENT_TYPES, OPT_STATUSES, ORGANIZATION_TYPES } from '@/utils/constants.js';

export default {
  isOrganizationComplete(organization, isGroup) {
    if (isEmpty(organization)) return false;
    const requiredFields = [
      'organizationType',
      'legalName',
      'address1',
      'city1',
      'province1',
      'postalCode1',
      'address2',
      'city2',
      'province2',
      'postalCode2',
      'position',
      'phone',
      'email',
    ];
    if (
      [ORGANIZATION_TYPES.NON_PROFIT_SOCIETY, ORGANIZATION_TYPES.REGISTERED_COMPANY].includes(
        organization?.organizationType,
      )
    ) {
      requiredFields.push['incNumber'];
    }
    if (organization?.organizationType !== ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP && isGroup) {
      requiredFields.push[('contactName', 'position')];
    }
    return !hasEmptyFields(organization, requiredFields);
  },

  isFacilityComplete(facility) {
    if (isEmpty(facility)) return false;
    console.log(facility);
    console.log('this.isCCOFComplete = ' + this.isCCOFCompleteGroupV2(facility.funding));
    console.log('this.isCCFRIComplete = ' + this.isCCFRIComplete(facility.ccfri));
    console.log('this.isECEWEComplete = ' + this.isECEWEComplete(facility.ecewe));
    return (
      this.isFacilityInformationComplete(facility.facilityInfo) &&
      this.isCCOFCompleteGroupV2(facility.funding) &&
      this.isLicenceUploadComplete(facility.uploadedDocuments) &&
      this.isCCFRIComplete(facility.ccfri) &&
      this.isECEWEComplete(facility.ecewe)
      //   (!this.facility?.hasRfi || this.facility?.isRFIComplete) &&
      //   (!this.facility?.hasNmf || this.facility?.isNMFComplete)
      //   (this.isAFSComplete)
    );
  },

  isFacilityInformationComplete(facilityInfo) {
    if (isEmpty(facilityInfo)) return false;
    const requiredFields = [
      'facilityName',
      'yearBeganOperation',
      'facilityAddress',
      'city',
      'province',
      'postalCode',
      'position',
      'email',
      'contactName',
      'phone',
      'licenseNumber',
      'licenseEffectiveDate',
      'hasReceivedFunding',
      'healthAuthority',
    ];
    if (facilityInfo.hasReceivedFunding) {
      requiredFields.push['fundingFacility'];
    }
    return !hasEmptyFields(facilityInfo, requiredFields);
  },

  /*
   **** Licence and Service Details Validations
   */
  // Application Template version 2

  // Group Provider - Application Template Version 2
  isCCOFCompleteGroupV2(funding) {
    if (isEmpty(funding)) return false;
    const requiredFields = [
      'maxDaysPerWeek',
      'maxWeeksPerYear',
      'hoursFrom',
      'hoursTo',
      'isSchoolProperty',
      'isExtendedHours',
    ];
    return (
      !hasEmptyFields(funding, requiredFields) &&
      this.hasValidLicenceCategory(funding) &&
      (!funding?.hasSchoolAgeCareOnSchoolGrounds || this.hasSchoolAgeCareServices(funding)) &&
      (funding?.isExtendedHours === 0 ||
        (this.hasLicenceCategoryWithExtendedChildCare(funding) &&
          this.isUnder36ExtendedChildCareValid(funding) &&
          this.is30MonthToSchoolAgeExtendedChildCareValid(funding) &&
          this.isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid(funding) &&
          this.isMultiAgeExtendedChildCareValid(funding)))
    );
  },

  hasLicenceCategory(funding) {
    return (
      funding?.hasUnder36Months ||
      funding?.has30MonthToSchoolAge ||
      funding?.hasSchoolAgeCareOnSchoolGrounds ||
      funding?.hasPreschool ||
      funding?.hasMultiAge
    );
  },
  hasValidLicenceCategory(funding) {
    return (
      funding?.maxLicensesCapacity > 0 &&
      ((funding?.hasUnder36Months && funding?.maxGroupChildCareUnder36 > 0) ||
        (funding?.has30MonthToSchoolAge && funding?.maxGroupChildCare36 > 0) ||
        (funding?.hasSchoolAgeCareOnSchoolGrounds && funding?.maxGroupChildCareSchool > 0) ||
        (funding?.hasPreschool && funding?.maxPreschool > 0) ||
        (funding?.hasMultiAge && funding?.maxGroupChildCareMultiAge > 0))
    );
  },
  hasSchoolAgeCareServices(funding) {
    return funding?.beforeSchool || funding?.afterSchool || funding?.beforeKindergarten || funding?.afterKindergarten;
  },
  hasLicenceCategoryWithExtendedChildCare(funding) {
    return (
      funding?.hasUnder36MonthsExtendedCC ||
      funding?.has30MonthToSchoolAgeExtendedCC ||
      funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
      funding?.hasMultiAgeExtendedCC
    );
  },
  isUnder36ExtendedChildCareValid(funding) {
    return (
      !funding?.hasUnder36MonthsExtendedCC ||
      funding?.extendedChildCareUnder36Months4OrLess + funding?.extendedChildCareUnder36Months4OrMore > 0
    );
  },
  is30MonthToSchoolAgeExtendedChildCareValid(funding) {
    return (
      !funding?.has30MonthToSchoolAgeExtendedCC ||
      funding?.extendedChildCare36MonthsToSchoolAge4OrLess + funding?.extendedChildCare36MonthsToSchoolAge4OrMore > 0
    );
  },
  isSchoolAgeCareOnSchoolGroundsExtendedChildCareValid(funding) {
    return (
      !funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
      funding?.extendedChildCareSchoolAge4OrLess + funding?.extendedChildCareSchoolAge4OrMore > 0
    );
  },
  isMultiAgeExtendedChildCareValid(funding) {
    return !funding?.hasMultiAgeExtendedCC || funding?.multiAgeCare4OrLess + funding?.multiAgeCare4more > 0;
  },
  /*
   **** END OF Licence and Service Details Validations
   */

  isLicenceUploadComplete(uploadedDocuments) {
    const uploadedLicenceDocuments = uploadedDocuments?.filter(
      (doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_LICENCE,
    );
    return uploadedLicenceDocuments?.length > 0;
  },

  isCCFRIComplete(ccfri) {
    if (ccfri?.ccfriOptInStatus == null) return false;
    if (ccfri?.ccfriOptInStatus === OPT_STATUSES.OPT_OUT) return true;
    const requiredFields = [];
    return !hasEmptyFields(ccfri, requiredFields);
  },

  isECEWEComplete(ecewe) {
    console.log(ecewe);
    if (ecewe?.optInOrOut == null) return false;
    if (ecewe?.optInOrOut === OPT_STATUSES.OPT_OUT) return true;
    const requiredFields = [];
    return !hasEmptyFields(ecewe, requiredFields);
  },

  getActiveApplicationTemplate() {
    const activeApplicationTemplate = APPLICATION_TEMPLATE_VERSIONS.find((template) => template.isActive);
    return activeApplicationTemplate?.id;
  },
};
