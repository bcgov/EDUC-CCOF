import { isEmpty } from 'lodash';

import { hasEmptyFields } from '@/utils/common.js';
import {
  APPLICATION_TEMPLATE_VERSIONS,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  DOCUMENT_TYPES,
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_SECTOR_TYPES,
  FACILITY_HAS_RECEIVE_FUNDING_VALUES,
  OPT_STATUSES,
  ORGANIZATION_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
} from '@/utils/constants.js';

export default {
  /*
   **** Summary Declaration validations
   */
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
      requiredFields.push('incNumber');
    }
    if (organization?.organizationType !== ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP_PARTNERSHIP && isGroup) {
      requiredFields.push('contactName', 'position');
    }
    return !hasEmptyFields(organization, requiredFields);
  },

  isFacilityComplete(facility) {
    console.log(facility);
    if (isEmpty(facility)) return false;
    // console.log(this.isFacilityInformationComplete(facility.facilityInfo));
    // console.log(this.isCCOFCompleteGroupV2(facility.funding));
    return (
      this.isFacilityInformationComplete(facility.facilityInfo) &&
      this.isCCOFCompleteGroupV2(facility.funding) &&
      this.isLicenceUploadComplete(facility.uploadedDocuments) &&
      this.isCCFRIComplete(facility.ccfri) &&
      (!facility?.hasRfi || this.isRFIComplete(facility.rfiApp, facility.isProgramYearLanguageHistorical)) &&
      (!facility?.hasNmf || this.isNMFComplete(facility.nmfApp)) &&
      //   (this.isAFSComplete)
      this.isECEWEFacilityComplete(facility.ecewe)
    );
  },

  // FACILITY INFORMATION VALIDATIONS
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
    if (facilityInfo.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY) {
      requiredFields.push('fundingFacility');
    }
    return !hasEmptyFields(facilityInfo, requiredFields);
  },

  // CCOF/LICENCE & SERVICE DETAILS VALIDATIONS
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

  // LICENCE UPLOAD VALIDATIONS
  isLicenceUploadComplete(uploadedDocuments) {
    const uploadedLicenceDocuments = uploadedDocuments?.filter(
      (doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_LICENCE,
    );
    return uploadedLicenceDocuments?.length > 0;
  },

  // CCFRI VALIDATIONS
  isCCFRIComplete(ccfri) {
    if (ccfri?.ccfriOptInStatus == null) return false;
    if (ccfri?.ccfriOptInStatus === OPT_STATUSES.OPT_OUT) return true;
    const requiredFields = ['hasClosureFees'];
    const areAllChildCareTypesComplete = ccfri?.childCareTypes?.every((childCareType) =>
      this.isChildCareTypeComplete(childCareType),
    );
    return (
      !hasEmptyFields(ccfri, requiredFields) &&
      areAllChildCareTypesComplete &&
      (ccfri?.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.NO || this.areClosureDatesComplete(ccfri?.dates))
    );
  },

  isChildCareTypeComplete(childCareType) {
    const requiredFields = [
      'programYear',
      'childCareCategory',
      'feeFrequency',
      'approvedFeeApr',
      'approvedFeeMay',
      'approvedFeeJun',
      'approvedFeeJul',
      'approvedFeeAug',
      'approvedFeeSep',
      'approvedFeeOct',
      'approvedFeeNov',
      'approvedFeeDec',
      'approvedFeeJan',
      'approvedFeeFeb',
      'approvedFeeMar',
    ];
    return !hasEmptyFields(childCareType, requiredFields);
  },

  areClosureDatesComplete(closureDates) {
    return closureDates?.every((date) => {
      const requiredFields = ['formattedStartDate', 'formattedEndDate', 'closureReason', 'feesPaidWhileClosed'];
      return !hasEmptyFields(date, requiredFields);
    });
  },

  // RFI VALIDATIONS
  isRFIComplete(rfi, isProgramYearLanguageHistorical) {
    return (
      !isEmpty(rfi) &&
      this.isExceptionalCircumstancesComplete(rfi) &&
      this.isDirectCareStaffWagesIncreasesComplete(rfi, isProgramYearLanguageHistorical) &&
      this.isPSEIncreaseInHoursOfOperationComplete(rfi) &&
      this.isPSEIncreasingConnectionToIndigenousComplete(rfi) &&
      this.isAffordableCCForUnderservedPopulationsComplete(rfi)
    );
  },

  isExceptionalCircumstancesComplete(rfi) {
    if (!rfi.exceptionalCircumstances) return rfi.exceptionalCircumstances === 0;
    if (!rfi.circumstanceOccurWithin6Month) return rfi.circumstanceOccurWithin6Month === 0;
    const requiredFields = ['expenseInformationNote'];
    const isExpenseInformationComplete = rfi.expenseList?.every((expense) => {
      const requiredFields = ['description', 'date', 'frequency', 'expense'];
      return !hasEmptyFields(expense, requiredFields);
    });
    const isOtherSourcesOfMinistryFunding = rfi.fundingList?.every((fund) => {
      const requiredFields = ['fundingProgram', 'date', 'status', 'amount', 'expenses'];
      return !hasEmptyFields(fund, requiredFields);
    });
    return !hasEmptyFields(rfi, requiredFields) && isExpenseInformationComplete && isOtherSourcesOfMinistryFunding;
  },

  isDirectCareStaffWagesIncreasesComplete(rfi, isProgramYearLanguageHistorical) {
    if (!rfi.feeIncreaseDueToWage) return rfi.feeIncreaseDueToWage === 0;
    const requiredFields = [
      'isBargainingAgreement',
      'lossOfCareStaff',
      'healthAndSafetyConcerns',
      'textbox1',
      'textbox2',
      'textbox3',
      'textbox4',
      'textbox5',
      'textbox6',
    ];
    if (isProgramYearLanguageHistorical) {
      requiredFields.push('increaseInWriting');
    }
    const isWagesIncreasesTableComplete = rfi.wageList?.every((wage) => {
      const requiredFields = [
        'staffNumber',
        'staffRole',
        'wageBeforeIncrease',
        'wageAfterIncrease',
        'averageHours',
        'wageDate',
      ];
      return !hasEmptyFields(wage, requiredFields);
    });
    return !hasEmptyFields(rfi, requiredFields) && isWagesIncreasesTableComplete;
  },

  isPSEIncreaseInHoursOfOperationComplete(rfi) {
    if (!rfi.feeIncreaseExtendedHours) return rfi.feeIncreaseExtendedHours === 0;
    const requiredFields = ['serviceExpansionDetailsNote', 'notes2'];
    const isServiceExpansionDetailsComplete = rfi.expansionList?.every((expansion) => {
      const requiredFields = ['timefrom', 'timeto', 'newtimefrom', 'newtimeto', 'date', 'expense', 'frequency'];
      return !hasEmptyFields(expansion, requiredFields);
    });
    return !hasEmptyFields(rfi, requiredFields) && isServiceExpansionDetailsComplete;
  },

  isPSEIncreasingConnectionToIndigenousComplete(rfi) {
    if (!rfi.IndigenousConnection) return rfi.IndigenousConnection === 0;
    const requiredFields = ['iCEIDetailsNote'];
    const isExpenseInformationComplete = rfi.indigenousExpenseList?.every((expansion) => {
      const requiredFields = ['description', 'date', 'frequency', 'expense'];
      return !hasEmptyFields(expansion, requiredFields);
    });
    return !hasEmptyFields(rfi, requiredFields) && isExpenseInformationComplete;
  },

  isAffordableCCForUnderservedPopulationsComplete(rfi) {
    if (!rfi.underservedPop) return rfi.underservedPop === 0;
    const requiredFields = ['underservedChildCareTypes', 'orgsustainability', 'outOfPocketFees'];
    return !hasEmptyFields(rfi, requiredFields);
  },

  // NMF VALIDATIONS
  isNMFComplete(nmf) {
    const requiredFields = ['supportNeeds', 'lowIncomeFamilies', 'remoteCommunities'];
    if (nmf?.supportNeeds) {
      requiredFields.push('supportNeedsComments');
    }
    if (nmf?.lowIncomeFamilies) {
      requiredFields.push('lowIncomeFamiliesComments');
    }
    if (nmf?.remoteCommunities) {
      requiredFields.push('remoteCommunitiesComments');
    }
    return !hasEmptyFields(nmf, requiredFields);
  },

  // ECE-WE VALIDATIONS
  isECEWEOrganizationComplete(ecewe, isGroup, languageYearLabel) {
    if (isEmpty(ecewe)) return false;
    if (!isGroup || !ecewe.optInECEWE) return ecewe.optInECEWE != null;
    const requiredFields = [];
    if (languageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26) {
      requiredFields.push(...this.requiredFieldsForECEWEOrganization202526Template(ecewe));
    } else {
      requiredFields.push(...this.requiredFieldsForECEWEOrganizationPreviousYearsTemplate(ecewe, languageYearLabel));
    }
    return !hasEmptyFields(ecewe, requiredFields);
  },

  // 2025–26 FY and beyond (CCFRI-3819)
  requiredFieldsForECEWEOrganization202526Template(ecewe) {
    const requiredFields = ['publicSector', 'describeOrgCSSEA'];
    if (ecewe.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA) {
      requiredFields.push('applicableSector');
      if (ecewe.applicableSector === ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED) {
        requiredFields.push('isUnionAgreementReached');
      }
    }
    if (ecewe.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA) {
      requiredFields.push('fundingModel', 'isUnionAgreementReached');
    }
    return requiredFields;
  },

  // Before 2025-26 FY
  requiredFieldsForECEWEOrganizationPreviousYearsTemplate(ecewe, languageYearLabel) {
    const requiredFields = ['belongsToUnion'];
    if (languageYearLabel !== PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL) {
      requiredFields.push('publicSector');
    }
    if (!ecewe.belongsToUnion) return requiredFields;

    requiredFields.push('applicableSector');
    if (ecewe.applicableSector === ECEWE_SECTOR_TYPES.CSSEA) {
      requiredFields.push('fundingModel');
    }
    // 100000001 = All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.
    // 100000002 = Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding.
    if (
      ecewe.applicableSector === ECEWE_SECTOR_TYPES.OTHER_UNION ||
      [100000001, 100000002].includes(ecewe.fundingModel)
    ) {
      requiredFields.push('confirmation');
    }
    return requiredFields;
  },

  isECEWEFacilityComplete(ecewe) {
    return ecewe?.optInOrOut != null;
  },

  /*
   **** End of Summary Declaration validations
   */

  getActiveApplicationTemplate() {
    const activeApplicationTemplate = APPLICATION_TEMPLATE_VERSIONS.find((template) => template.isActive);
    return activeApplicationTemplate?.id;
  },
};
