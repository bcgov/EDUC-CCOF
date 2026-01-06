import { isEmpty } from 'lodash';

import ApiService from '@/common/apiService';
import { hasEmptyFields, validateHourDifference } from '@/utils/common.js';
import {
  AFS_STATUSES,
  ApiRoutes,
  CCFRI_HAS_CLOSURE_FEE_TYPES,
  CCFRI_MAX_FEE,
  CCFRI_MIN_FEE,
  DOCUMENT_TYPES,
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  ECEWE_SECTOR_TYPES,
  FACILITY_HAS_RECEIVE_FUNDING_VALUES,
  FAMILY_LICENCE_CATEGORIES,
  GROUP_LICENCE_CATEGORIES,
  MAX_NUMBER_OF_PARTNERS,
  OPT_STATUSES,
  ORGANIZATION_TYPES,
  PROGRAM_YEAR_LANGUAGE_TYPES,
  YES_NO_VALUES,
} from '@/utils/constants.js';
import {
  isEmailValid,
  isNumberOfDaysPerWeekValid,
  isNumberOfWeeksPerYearValid,
  isPhoneNumberValid,
  isPostalCodeValid,
  isYearValid,
} from '@/utils/validation';

const showApplicationTemplateV1 = (version) => !version || version === 1;

const GROUP_LICENCE_CATEGORY_FIELDS = [
  {
    id: GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_UNDER_36_MONTHS,
    flag: 'hasUnder36MonthsExtendedCC',
    maxNumber: 'maxGroupChildCareUnder36',
    maxSpaces4OrLess: 'extendedChildCareUnder36Months4OrLess',
    maxSpacesOver4: 'extendedChildCareUnder36Months4OrMore',
  },
  {
    id: GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_30_MONTHS_TO_SCHOOL_AGE,
    flag: 'has30MonthToSchoolAgeExtendedCC',
    maxNumber: 'maxGroupChildCare36',
    maxSpaces4OrLess: 'extendedChildCare36MonthsToSchoolAge4OrLess',
    maxSpacesOver4: 'extendedChildCare36MonthsToSchoolAge4OrMore',
  },
  {
    id: GROUP_LICENCE_CATEGORIES.GROUP_CHILD_CARE_SCHOOL_AGE,
    flag: 'hasSchoolAgeExtendedCC',
    maxNumber: 'maxGroupChildCareSchool',
    maxSpaces4OrLess: 'extendedChildCareSchoolAge4OrLess',
    maxSpacesOver4: 'extendedChildCareSchoolAge4OrMore',
  },
  {
    id: GROUP_LICENCE_CATEGORIES.SCHOOL_AGE_CARE_ON_SCHOOL_GROUNDS,
    flag: 'hasSchoolAgeCareOnSchoolGroundsExtendedCC',
    maxNumber: 'maxSchoolAgeCareOnSchoolGrounds',
    maxSpaces4OrLess: 'extendedSchoolAgeCareOnSchoolGrounds4OrLess',
    maxSpacesOver4: 'extendedSchoolAgeCareOnSchoolGrounds4OrMore',
  },
  {
    id: GROUP_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE,
    flag: 'hasMultiAgeExtendedCC',
    maxNumber: 'maxGroupChildCareMultiAge',
    maxSpaces4OrLess: 'multiAgeCare4OrLess',
    maxSpacesOver4: 'multiAgeCare4more',
  },
];

export default {
  /*
   **** Summary Declaration validations
   */
  isOrganizationComplete(organization, applicationTemplateVersion) {
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
    if (
      !showApplicationTemplateV1(applicationTemplateVersion) &&
      organization?.organizationType === ORGANIZATION_TYPES.PARTNERSHIP
    ) {
      requiredFields.push('doingBusinessAs');
      const numberOfPartners = this.getNumberOfPartners(organization);
      for (let i = 1; i <= numberOfPartners; i++) {
        requiredFields.push(`partner${i}FirstName`, `partner${i}LastName`);
      }
    }
    const areFieldsValid =
      isEmailValid(organization.email) &&
      isPhoneNumberValid(organization.phone) &&
      isPostalCodeValid(organization.postalCode1) &&
      isPostalCodeValid(organization.postalCode2);
    return !hasEmptyFields(organization, requiredFields) && areFieldsValid;
  },

  getNumberOfPartners(organization) {
    if (isEmpty(organization)) return 0;
    let maxIndexWithData = 0;
    for (let i = 1; i <= MAX_NUMBER_OF_PARTNERS; i++) {
      const hasData =
        !isEmpty(organization[`partner${i}FirstName`]?.trim()) ||
        !isEmpty(organization[`partner${i}MiddleName`]?.trim()) ||
        !isEmpty(organization[`partner${i}LastName`]?.trim());
      if (hasData) {
        maxIndexWithData = i;
      }
    }
    return maxIndexWithData;
  },

  isFacilityComplete(facility) {
    if (isEmpty(facility)) return false;
    const isFacilityInformationComplete = this.isFacilityInformationComplete(
      facility.facilityInfo,
      facility.isGroup,
      facility.applicationTemplateVersion,
    );
    const isCCOFComplete = this.isCCOFComplete(facility.funding, facility.isGroup, facility.applicationTemplateVersion);
    const areCCFRISectionsComplete =
      this.isCCFRIComplete(facility.ccfri, facility.applicationTemplateVersion) &&
      (facility?.ccfri?.ccfriOptInStatus === OPT_STATUSES.OPT_OUT ||
        ((!facility?.hasRfi || this.isRFIComplete(facility.rfiApp, facility.languageYearLabel)) &&
          (!facility?.hasNmf || this.isNMFComplete(facility.nmfApp)) &&
          this.isClosuresComplete(facility.ccfri, facility.applicationTemplateVersion) &&
          (!facility?.enableAfs || this.isAFSComplete(facility.afs, facility.uploadedDocuments))));
    return (
      (facility.isRenewal || (isFacilityInformationComplete && isCCOFComplete)) &&
      this.isLicenceUploadComplete(facility.uploadedDocuments) &&
      areCCFRISectionsComplete &&
      this.isECEWEFacilityComplete(facility.ecewe, facility.eceweOrg, facility.languageYearLabel)
    );
  },

  // FACILITY INFORMATION VALIDATIONS
  isFacilityInformationComplete(facilityInfo, isGroup, applicationTemplateVersion) {
    if (isEmpty(facilityInfo)) return false;
    // Family Application - Template Version 1
    if (!isGroup && showApplicationTemplateV1(applicationTemplateVersion)) {
      const requiredFields = ['facilityName', 'licenseNumber', 'licenseEffectiveDate', 'hasReceivedFunding'];
      if (facilityInfo.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY) {
        requiredFields.push('fundingFacility');
      }
      return !hasEmptyFields(facilityInfo, requiredFields);
    }
    const requiredFields = [
      'facilityName',
      'yearBeganOperation',
      'facilityAddress',
      'city',
      'province',
      'postalCode',
      'email',
      'phone',
      'licenseNumber',
      'licenseEffectiveDate',
      'hasReceivedFunding',
    ];
    if (!showApplicationTemplateV1(applicationTemplateVersion)) {
      requiredFields.push('healthAuthority');
    }
    if (facilityInfo.hasReceivedFunding === FACILITY_HAS_RECEIVE_FUNDING_VALUES.YES_FACILITY) {
      requiredFields.push('fundingFacility');
    }
    const isFacilityInBC = facilityInfo.province === 'BC';
    const areFieldsValid =
      isEmailValid(facilityInfo.email) &&
      isPhoneNumberValid(facilityInfo.phone) &&
      isPostalCodeValid(facilityInfo.postalCode) &&
      isYearValid(facilityInfo.yearBeganOperation);
    return !hasEmptyFields(facilityInfo, requiredFields) && areFieldsValid && isFacilityInBC;
  },

  // CCOF/LICENCE & SERVICE DETAILS VALIDATIONS
  isCCOFComplete(funding, isGroup, applicationTemplateVersion) {
    if (showApplicationTemplateV1(applicationTemplateVersion)) {
      return isGroup ? this.isCCOFCompleteGroupV1(funding) : this.isCCOFCompleteFamilyV1(funding);
    }
    return isGroup ? this.isCCOFCompleteGroupV2(funding) : this.isCCOFCompleteFamilyV2(funding);
  },
  isCCOFCompleteFamilyV1(funding) {
    if (isEmpty(funding)) return false;
    const requiredFields = [
      'licenceCategoryNumber',
      'maxDaysPerWeek',
      'maxWeeksPerYear',
      'hoursFrom',
      'hoursTo',
      'hasClosedMonth',
      'maxLicensesCapacity',
      'maxSpaces',
      'isExtendedHours',
    ];
    if (funding.isExtendedHours) {
      requiredFields.push('maxCapacityExtended', 'maxDaysPerWeekExtended', 'maxWeeksPerYearExtended');
    }
    const areFieldsValid =
      funding.maxSpaces <= funding.maxLicensesCapacity &&
      isNumberOfDaysPerWeekValid(funding.maxDaysPerWeek) &&
      isNumberOfWeeksPerYearValid(funding.maxWeeksPerYear) &&
      validateHourDifference(funding.hoursFrom, funding.hoursTo, 1);
    const isExtendedChildCareValid =
      funding.isExtendedHours === 0 ||
      (isNumberOfDaysPerWeekValid(funding.maxDaysPerWeekExtended) &&
        isNumberOfWeeksPerYearValid(funding.maxWeeksPerYearExtended));
    return !hasEmptyFields(funding, requiredFields) && areFieldsValid && isExtendedChildCareValid;
  },
  isCCOFCompleteFamilyV2(funding) {
    if (isEmpty(funding)) return false;
    const requiredFields = [
      'licenceCategoryNumber',
      'maxDaysPerWeek',
      'maxWeeksPerYear',
      'hoursFrom',
      'hoursTo',
      'hasClosedMonth',
      'maxLicensesCapacity',
      'maxSpaces',
      'isExtendedHours',
    ];
    const areFieldsValid =
      funding.maxLicensesCapacity > 0 &&
      funding.maxSpaces <= funding.maxLicensesCapacity &&
      isNumberOfDaysPerWeekValid(funding.maxDaysPerWeek) &&
      isNumberOfWeeksPerYearValid(funding.maxWeeksPerYear) &&
      validateHourDifference(funding.hoursFrom, funding.hoursTo, 1);
    const isExtendedCCMaximumSpacesValid = this.isFamilyExtendedCCMaximumSpacesValid(
      funding,
      funding.licenceCategoryNumber,
    );
    const isExtendedChildCareValid =
      funding.isExtendedHours === 0 ||
      (isNumberOfDaysPerWeekValid(funding.maxDaysPerWeekExtended) &&
        isNumberOfWeeksPerYearValid(funding.maxWeeksPerYearExtended) &&
        isExtendedCCMaximumSpacesValid);
    const isClosedMonthsValid =
      !funding.hasClosedMonth || (!this.hasAllMonthsClosed(funding) && !this.hasNoMonthClosed(funding));
    return (
      !hasEmptyFields(funding, requiredFields) && areFieldsValid && isClosedMonthsValid && isExtendedChildCareValid
    );
  },
  isCCOFCompleteGroupV1(funding) {
    if (isEmpty(funding)) return false;
    const requiredFields = [
      'maxDaysPerWeek',
      'maxWeeksPerYear',
      'hoursFrom',
      'hoursTo',
      'maxLicensesCapacity',
      'maxGroupChildCareUnder36',
      'maxGroupChildCare36',
      'maxPreschool',
      'maxGroupChildCareSchool',
      'maxGroupChildCareMultiAge',
      'isExtendedHours',
    ];
    if (funding.maxPreschool > 0) {
      requiredFields.push('monday', 'tusday', 'wednesday', 'thursday', 'friday');
    }
    if (funding.maxGroupChildCareSchool > 0) {
      requiredFields.push('isSchoolProperty');
    }
    const isSchoolPropertyComplete =
      !funding.maxGroupChildCareSchool || !funding.isSchoolProperty || this.hasSchoolAgeCareServices(funding);
    if (funding.isExtendedHours) {
      requiredFields.push('maxDaysPerWeekExtended', 'maxWeeksPerYearExtended');
    }
    const areFieldsValid =
      isNumberOfDaysPerWeekValid(funding.maxDaysPerWeek) &&
      isNumberOfWeeksPerYearValid(funding.maxWeeksPerYear) &&
      validateHourDifference(funding.hoursFrom, funding.hoursTo, 1);
    const isExtendedChildCareValid =
      funding.isExtendedHours === 0 ||
      (isNumberOfDaysPerWeekValid(funding.maxDaysPerWeekExtended) &&
        isNumberOfWeeksPerYearValid(funding.maxWeeksPerYearExtended));
    return (
      !hasEmptyFields(funding, requiredFields) && areFieldsValid && isExtendedChildCareValid && isSchoolPropertyComplete
    );
  },
  isCCOFCompleteGroupV2(funding) {
    if (isEmpty(funding)) return false;
    const requiredFields = [
      'maxDaysPerWeek',
      'maxWeeksPerYear',
      'hoursFrom',
      'hoursTo',
      'hasClosedMonth',
      'isSchoolProperty',
      'isExtendedHours',
    ];
    const areFieldsValid =
      isNumberOfDaysPerWeekValid(funding.maxDaysPerWeek) &&
      isNumberOfWeeksPerYearValid(funding.maxWeeksPerYear) &&
      validateHourDifference(funding.hoursFrom, funding.hoursTo, 1);
    const isSchoolAgeCareValid =
      !this.hasSchoolAgeCareLicenceCategory(funding) || this.hasSchoolAgeCareServices(funding);
    const isExtendedChildCareValid =
      funding.isExtendedHours === 0 ||
      (isNumberOfDaysPerWeekValid(funding.maxDaysPerWeekExtended) &&
        isNumberOfWeeksPerYearValid(funding.maxWeeksPerYearExtended) &&
        this.hasLicenceCategoryWithExtendedChildCare(funding) &&
        this.isGroupExtendedCCMaxSpacesValid(funding));
    const isClosedMonthsValid =
      !funding.hasClosedMonth || (!this.hasAllMonthsClosed(funding) && !this.hasNoMonthClosed(funding));
    return (
      !hasEmptyFields(funding, requiredFields) &&
      areFieldsValid &&
      isClosedMonthsValid &&
      this.hasValidLicenceCategory(funding) &&
      isSchoolAgeCareValid &&
      isExtendedChildCareValid
    );
  },
  hasAllMonthsClosed(funding) {
    for (let i = 1; i <= 12; i++) {
      if (!funding[`closedIn${i}`]) {
        return false;
      }
    }
    return true;
  },
  hasNoMonthClosed(funding) {
    for (let i = 1; i <= 12; i++) {
      if (funding[`closedIn${i}`]) {
        return false;
      }
    }
    return true;
  },
  hasLicenceCategory(funding) {
    return (
      funding?.hasUnder36Months ||
      funding?.has30MonthToSchoolAge ||
      funding?.hasSchoolAge ||
      funding?.hasSchoolAgeCareOnSchoolGrounds ||
      funding?.hasPreschool ||
      funding?.hasMultiAge
    );
  },
  hasValidLicenceCategory(funding) {
    const isValidCategory = (selected, count) => !selected || Number(count) > 0;
    return (
      funding?.maxLicensesCapacity > 0 &&
      this.hasLicenceCategory(funding) &&
      isValidCategory(funding?.hasUnder36Months, funding?.maxGroupChildCareUnder36) &&
      isValidCategory(funding?.has30MonthToSchoolAge, funding?.maxGroupChildCare36) &&
      isValidCategory(funding?.hasSchoolAge, funding?.maxGroupChildCareSchool) &&
      isValidCategory(funding?.hasSchoolAgeCareOnSchoolGrounds, funding?.maxSchoolAgeCareOnSchoolGrounds) &&
      isValidCategory(funding?.hasPreschool, funding?.maxPreschool) &&
      isValidCategory(funding?.hasMultiAge, funding?.maxGroupChildCareMultiAge)
    );
  },
  hasSchoolAgeCareLicenceCategory(funding) {
    return funding?.hasSchoolAge || funding?.hasSchoolAgeCareOnSchoolGrounds;
  },
  hasSchoolAgeCareServices(funding) {
    return funding?.beforeSchool || funding?.afterSchool || funding?.beforeKindergarten || funding?.afterKindergarten;
  },
  hasLicenceCategoryWithExtendedChildCare(funding) {
    return (
      funding?.hasUnder36MonthsExtendedCC ||
      funding?.has30MonthToSchoolAgeExtendedCC ||
      funding?.hasSchoolAgeExtendedCC ||
      funding?.hasSchoolAgeCareOnSchoolGroundsExtendedCC ||
      funding?.hasMultiAgeExtendedCC
    );
  },
  isGroupExtendedCCMaxSpacesEntered(funding, licenceCategoryId) {
    if (isEmpty(funding) || !licenceCategoryId) return false;
    const licenceCategory = GROUP_LICENCE_CATEGORY_FIELDS.find((category) => category.id === licenceCategoryId);
    if (!licenceCategory) return false;
    const maxSpaces4OrLess = funding[licenceCategory.maxSpaces4OrLess] || 0;
    const maxSpacesOver4 = funding[licenceCategory.maxSpacesOver4] || 0;
    return maxSpaces4OrLess + maxSpacesOver4 > 0;
  },
  isGroupExtendedCCMaxSpacesValid(funding) {
    if (isEmpty(funding)) return false;
    return GROUP_LICENCE_CATEGORY_FIELDS.every((licenceCategory) => {
      if (!funding[licenceCategory.flag]) return true;
      const isEntered = this.isGroupExtendedCCMaxSpacesEntered(funding, licenceCategory.id);
      const is4OrLessValid = funding[licenceCategory.maxSpaces4OrLess] <= funding[licenceCategory.maxNumber] * 2;
      const isOver4Valid = funding[licenceCategory.maxSpacesOver4] <= funding[licenceCategory.maxNumber];
      return isEntered && is4OrLessValid && isOver4Valid;
    });
  },
  isFamilyExtendedCCMaximumSpacesValid(funding, licenceCategoryNumber) {
    if (isEmpty(funding) || !licenceCategoryNumber) return false;
    const maxExtendedCC4OrLess = funding.maxLicensesCapacity * 2;
    switch (licenceCategoryNumber) {
      case FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE:
        return (
          funding.familyExtendedCC4OrLess <= maxExtendedCC4OrLess &&
          funding.familyExtendedCC4OrMore <= funding.maxLicensesCapacity &&
          funding.familyExtendedCC4OrLess + funding.familyExtendedCC4OrMore > 0
        );
      case FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE:
        return (
          funding.inHomeMultiAgeExtendedCC4OrLess <= maxExtendedCC4OrLess &&
          funding.inHomeMultiAgeExtendedCC4OrMore <= funding.maxLicensesCapacity &&
          funding.inHomeMultiAgeExtendedCC4OrLess + funding.inHomeMultiAgeExtendedCC4OrMore > 0
        );
      case FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE:
        return (
          funding.multiAgeCare4OrLess <= maxExtendedCC4OrLess &&
          funding.multiAgeCare4more <= funding.maxLicensesCapacity &&
          funding.multiAgeCare4OrLess + funding.multiAgeCare4more > 0
        );
      default:
        return false;
    }
  },
  getFieldNameOfMaxSpaces4OrLessExtendedCC(licenceCategoryNumber) {
    switch (licenceCategoryNumber) {
      case FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE:
        return 'familyExtendedCC4OrLess';
      case FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE:
        return 'inHomeMultiAgeExtendedCC4OrLess';
      case FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE:
        return 'multiAgeCare4OrLess';
      default:
        return null;
    }
  },
  getFieldNameOfMaxSpaces4OrMoreExtendedCC(licenceCategoryNumber) {
    switch (licenceCategoryNumber) {
      case FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE:
        return 'familyExtendedCC4OrMore';
      case FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE:
        return 'inHomeMultiAgeExtendedCC4OrMore';
      case FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE:
        return 'multiAgeCare4more';
      default:
        return null;
    }
  },
  getFamilyLicenceCategoryNameByNumber(licenceCategoryNumber) {
    switch (licenceCategoryNumber) {
      case FAMILY_LICENCE_CATEGORIES.FAMILY_CHILD_CARE:
        return 'Family Child Care';
      case FAMILY_LICENCE_CATEGORIES.IN_HOME_MULTI_AGE_CHILD_CARE:
        return 'In-Home Multi-Age Child Care';
      case FAMILY_LICENCE_CATEGORIES.MULTI_AGE_CHILD_CARE:
        return 'Multi-Age Child Care';
      default:
        return '';
    }
  },

  // LICENCE UPLOAD VALIDATIONS
  isLicenceUploadComplete(uploadedDocuments) {
    const uploadedLicenceDocuments = uploadedDocuments?.filter(
      (doc) => doc.documentType === DOCUMENT_TYPES.APPLICATION_LICENCE,
    );
    return uploadedLicenceDocuments?.length > 0;
  },

  // CCFRI VALIDATIONS
  isCCFRIComplete(ccfri, applicationTemplateVersion) {
    if (ccfri?.ccfriOptInStatus == null) return false;
    if (ccfri?.ccfriOptInStatus === OPT_STATUSES.OPT_OUT) return true;
    const areAllChildCareTypesComplete = ccfri?.childCareTypes?.every((childCareType) =>
      this.isChildCareTypeComplete(childCareType),
    );
    return (
      areAllChildCareTypesComplete &&
      // CCFRI-4636 - Closure-related questions were removed from the CCFRI (Parent Fees) section starting with Application Template Version 2.
      (!showApplicationTemplateV1(applicationTemplateVersion) ||
        this.isClosuresComplete(ccfri, applicationTemplateVersion))
    );
  },

  isChildCareTypeComplete(childCareType) {
    const feeFields = [
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
    const requiredFields = ['programYear', 'childCareCategory', 'feeFrequency', ...feeFields];
    const areFeesValid = feeFields.every(
      (month) =>
        !isNaN(parseFloat(childCareType[month])) &&
        childCareType[month] >= CCFRI_MIN_FEE &&
        childCareType[month] <= CCFRI_MAX_FEE,
    );
    return !hasEmptyFields(childCareType, requiredFields) && areFeesValid;
  },

  // CLOSURES VALIDATIONS
  isClosuresComplete(ccfri, applicationTemplateVersion) {
    if (isEmpty(ccfri)) return false;
    const closureRequiredFields = showApplicationTemplateV1(applicationTemplateVersion)
      ? ['startDate', 'endDate', 'closureReason', 'paidClosure']
      : ['startDate', 'endDate', 'closureReason', 'fullClosure'];
    const areAllClosureItemsComplete =
      !isEmpty(ccfri.closures) &&
      ccfri.closures?.every((closure) => {
        const isAgeGroupsComplete =
          showApplicationTemplateV1(applicationTemplateVersion) || closure.fullClosure || !isEmpty(closure.ageGroups);
        return !hasEmptyFields(closure, closureRequiredFields) && isAgeGroupsComplete;
      });
    return (
      ccfri.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.NO ||
      (ccfri.hasClosureFees === CCFRI_HAS_CLOSURE_FEE_TYPES.YES && areAllClosureItemsComplete)
    );
  },

  // RFI VALIDATIONS
  isRFIComplete(rfi, languageYearLabel) {
    const isProgramYearLanguageHistorical = languageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL;
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
    if (!rfi.exceptionalCircumstances) return rfi.exceptionalCircumstances === YES_NO_VALUES.NO;
    if (!rfi.circumstanceOccurWithin6Month) return rfi.circumstanceOccurWithin6Month === YES_NO_VALUES.NO;
    const requiredFields = ['expenseInformationNote'];

    const expenseRequiredFields = ['description', 'date', 'frequency', 'expense'];
    const isExpenseInformationComplete =
      !isEmpty(rfi.expenseList) && rfi.expenseList?.every((expense) => !hasEmptyFields(expense, expenseRequiredFields));

    const fundingRequiredFields = ['fundingProgram', 'date', 'status', 'amount', 'expenses'];
    const isOtherSourcesOfMinistryFundingComplete =
      rfi.q3 === YES_NO_VALUES.NO ||
      (!isEmpty(rfi.fundingList) && rfi.fundingList?.every((fund) => !hasEmptyFields(fund, fundingRequiredFields)));

    return (
      !hasEmptyFields(rfi, requiredFields) && isExpenseInformationComplete && isOtherSourcesOfMinistryFundingComplete
    );
  },

  isDirectCareStaffWagesIncreasesComplete(rfi, languageYearLabel) {
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
    if (languageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.HISTORICAL) {
      requiredFields.push('increaseInWriting');
    }
    const wageRequiredFields = [
      'staffNumber',
      'staffRole',
      'wageBeforeIncrease',
      'wageAfterIncrease',
      'averageHours',
      'wageDate',
    ];
    const isWagesIncreasesTableComplete =
      !isEmpty(rfi.wageList) && rfi.wageList?.every((wage) => !hasEmptyFields(wage, wageRequiredFields));
    return !hasEmptyFields(rfi, requiredFields) && isWagesIncreasesTableComplete;
  },

  isPSEIncreaseInHoursOfOperationComplete(rfi) {
    if (!rfi.feeIncreaseExtendedHours) return rfi.feeIncreaseExtendedHours === 0;
    const requiredFields = ['serviceExpansionDetailsNote', 'notes2'];
    const expansionRequiredFields = ['timefrom', 'timeto', 'newtimefrom', 'newtimeto', 'date', 'expense', 'frequency'];
    const isServiceExpansionDetailsComplete =
      !isEmpty(rfi.expansionList) &&
      rfi.expansionList?.every((expansion) => !hasEmptyFields(expansion, expansionRequiredFields));
    return !hasEmptyFields(rfi, requiredFields) && isServiceExpansionDetailsComplete;
  },

  isPSEIncreasingConnectionToIndigenousComplete(rfi) {
    if (!rfi.IndigenousConnection) return rfi.IndigenousConnection === 0;
    const requiredFields = ['iCEIDetailsNote'];
    const expenseRequiredFields = ['description', 'date', 'frequency', 'expense'];
    const isExpenseInformationComplete =
      !isEmpty(rfi.indigenousExpenseList) &&
      rfi.indigenousExpenseList?.every((expense) => !hasEmptyFields(expense, expenseRequiredFields));
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

  // AFS VALIDATIONS
  isAFSComplete(afs, uploadedDocuments) {
    if (afs?.afsStatus == null) return false;
    if (afs.afsStatus === AFS_STATUSES.UPLOAD_DOCUMENTS) {
      const afsDocuments = uploadedDocuments?.filter((document) =>
        [DOCUMENT_TYPES.APPLICATION_AFS, DOCUMENT_TYPES.APPLICATION_AFS_SUBMITTED].includes(document.documentType),
      );
      return afsDocuments?.length > 0;
    }
    return true;
  },

  // ECE-WE VALIDATIONS
  isECEWEOrganizationComplete(ecewe, isGroup, languageYearLabel, applicationTemplateVersion) {
    if (isEmpty(ecewe)) return false;
    if (!isGroup || !ecewe.optInECEWE) return ecewe.optInECEWE != null;
    const requiredFields = [];
    if (languageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26) {
      requiredFields.push(...this.requiredFieldsForECEWEOrganization202526Template(ecewe, applicationTemplateVersion));
    } else {
      requiredFields.push(...this.requiredFieldsForECEWEOrganizationPreviousYearsTemplate(ecewe, languageYearLabel));
    }
    const isCSSEAValid = languageYearLabel !== PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26 || !this.showCSSEAWarning(ecewe);
    return !hasEmptyFields(ecewe, requiredFields) && isCSSEAValid;
  },

  // 2025–26 FY and beyond (CCFRI-3819)
  requiredFieldsForECEWEOrganization202526Template(ecewe, applicationTemplateVersion) {
    const requiredFields = ['publicSector', 'describeOrgCSSEA'];
    if (ecewe.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.NOT_A_MEMBER_OF_CSSEA) {
      requiredFields.push('applicableSector');
      if (ecewe.applicableSector === ECEWE_SECTOR_TYPES.SOME_FACILITIES_UNIONIZED) {
        requiredFields.push('isUnionAgreementReached');
      }
    }
    if (ecewe.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA) {
      requiredFields.push('isUnionAgreementReached');
      if (showApplicationTemplateV1(applicationTemplateVersion)) {
        requiredFields.push('fundingModel');
      }
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

  showEceweFacilityUnionQuestion(eceweOrg, languageYearLabel) {
    return (
      eceweOrg?.publicSector === ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES &&
      eceweOrg?.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA &&
      languageYearLabel === PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26
    );
  },

  isECEWEFacilityComplete(ecewe, eceweOrg, languageYearLabel) {
    if (isEmpty(ecewe)) return false;
    if (ecewe.optInOrOut && this.showEceweFacilityUnionQuestion(eceweOrg, languageYearLabel)) {
      return ecewe?.facilityUnionStatus != null;
    }
    return ecewe?.optInOrOut != null;
  },

  showCSSEAWarning(ecewe) {
    //this is only for 2025-26
    return (
      ecewe?.publicSector === ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.NO &&
      ecewe?.describeOrgCSSEA === ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA
    );
  },

  isBankingInformationComplete(application) {
    return application?.hasBankingInfoChanged === YES_NO_VALUES.NO;
  },

  isFundingAgreementComplete(application) {
    return (
      application?.isFundingAgreementConfirmed === YES_NO_VALUES.YES &&
      application?.areLicenceDetailsConfirmed === YES_NO_VALUES.YES
    );
  },

  /*
   **** End of Summary Declaration validations
   */

  async getRenewalApplicationCCOF(applicationId) {
    try {
      if (!applicationId) return {};
      const response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION_RENEW}/${applicationId}/ccof`);
      return response?.data;
    } catch (error) {
      console.error(`Failed to get renewal application CCOF - ${error}`);
      throw error;
    }
  },

  async updateApplication(applicationId, payload) {
    try {
      if (!applicationId || isEmpty(payload)) return;
      const response = await ApiService.apiAxios.patch(`${ApiRoutes.APPLICATION}/${applicationId}`, payload);
      return response;
    } catch (error) {
      console.error(`Failed to update the application - ${error}`);
      throw error;
    }
  },

  async getAdjudicationECEWEFacilities(applicationId) {
    try {
      if (!applicationId) return;
      const response = await ApiService.apiAxios.get(`${ApiRoutes.APPLICATION}/${applicationId}/adj-ecewe-facilities`);
      return response.data;
    } catch (error) {
      console.error(`Failed to get Adjudication ECEWE facilities - ${error}`);
      throw error;
    }
  },
};
