const OrganizationMappings = [
  { back: 'name', front: 'legalName' },
  { back: 'address1_name', front: 'address1' }, //Address 
  { back: 'address1_city', front: 'city1' },
  { back: 'address1_postalcode', front: 'postalCode1' },
  { back: 'address2_name', front: 'address2' }, //Mailing Address       
  { back: 'address2_city', front: 'city2' },
  { back: 'address2_postalcode', front: 'postalCode2' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'ccof_position', front: 'position' },
  { back: 'telephone1', front: 'phone' },
  // { back: 'businessBCeID', front: 'businessId'},
  { back: 'emailaddress1', front: 'email' },
  { back: 'ccof_instructionnumber', front: 'incNumber' },//incorporation number    
  { back: 'ccof_typeoforganization', front: 'organizationType' },
  { back: 'ccof_typeoforganization@OData.Community.Display.V1.FormattedValue', front: 'organizationTypeDesc' },
];

const FacilityMappings = [
  { back: 'name', front: 'facilityName' },
  { back: 'ccof_facilitystartdate', front: 'yearBeginOperation' },
  { back: 'address1_line1', front: 'facilityAddress' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_postalcode', front: 'postalCode' },
  { back: 'ccof_position', front: 'position' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'telephone1', front: 'phone' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber' },
  // XXXXXXXXXXXXX: 'licenseEffectiveDate',
  // XXXXXXXXXXXXX: 'hasReceivedFunding',
];

const CCOFApplicationMappings = [
  { back: 'ccof_applicationtype', front: 'applicationType' }, // 100000000 New Org
  { back: 'ccof_name', front: 'name' }, // APP-22000059
  { back: 'ccof_applicationid', front: 'applicationId' }, // guid
  { back: '_ccof_organization_value', front: 'organizationId' }, //guid 
  { back: 'ccof_familychildcare', front: 'isFamiliyChildCare' }, //false,
  { back: 'ccof_inhomemultiagechildcare', front: 'isHomeMultiAgeChildCare' }, //false,
  { back: '_ccof_programyear_value', front: 'programYearId' }, //guid
  { back: 'ccof_multiagechildcare', front: 'isMultiAgeChildCare' }, //false,
  { back: 'ccof_providertype', front: 'providerTypeId' }, //100000000 Group
  { back: 'ccof_consent', front: 'hasConset' },  // 1
];

const CCOFApplicationFundingMapping = [
  { back: 'XXXXX', front: 'closedMonths' },
  { back: 'XXXXX', front: 'isValidForm' },
  { back: 'XXXXX', front: 'maxDaysPerWeek' },
  { back: 'XXXXX', front: 'maxDaysPerYear' },
  { back: 'XXXXX', front: 'hasClosedMonth' },
  { back: 'XXXXX', front: 'menu1' },
  { back: 'XXXXX', front: 'hoursFrom' },
  { back: 'XXXXX', front: 'hoursFrom12hr' },
  { back: 'XXXXX', front: 'menu2' },
  { back: 'XXXXX', front: 'hoursTo' },
  { back: 'XXXXX', front: 'hoursTo12hr' },
  { back: 'XXXXX', front: 'maxLicensesCapacity' },
  { back: 'XXXXX', front: 'maxGroupChildCare' },
  { back: 'XXXXX', front: 'maxGroupChildCare36' },
  { back: 'XXXXX', front: 'maxPreschool' },
  { back: 'XXXXX', front: 'maxGroupChildCareSchool' },
  { back: 'XXXXX', front: 'monday' },
  { back: 'XXXXX', front: 'tusday' },
  { back: 'XXXXX', front: 'wednesday' },
  { back: 'XXXXX', front: 'thursday' },
  { back: 'XXXXX', front: 'friday' },
  { back: 'XXXXX', front: 'isSchoolProperty', },
  { back: 'XXXXX', front: 'beforeSchool' },
  { back: 'XXXXX', front: 'beforeKindergarten' },
  { back: 'XXXXX', front: 'isExtendedHours', },
  { back: 'XXXXX', front: 'afterKindergarten' },
  { back: 'XXXXX', front: 'afterSchool' },
  { back: 'XXXXX', front: 'maxDaysPerWeekExtended' },
  { back: 'XXXXX', front: 'maxDaysPerYearExtended' },
  { back: 'XXXXX', front: 'groupChildCare4less' },
  { back: 'XXXXX', front: 'groupChildCare4more' },
  { back: 'XXXXX', front: 'groupChildCare36School4less' },
  { back: 'XXXXX', front: 'groupChildCare36School4more' },
  { back: 'XXXXX', front: 'groupChildCareSchoolAge4less' },
  { back: 'XXXXX', front: 'groupChildCareSchoolAge4more' },
  { back: 'XXXXX', front: 'multiAgeCare4less' },
  { back: 'XXXXX', front: 'multiAgeCare4more' }
];

const UserProfileOrganizationMappings = [
  { back: 'Organization.name', front: 'organizationName' },
  { back: 'Organization.accountid', front: 'organizationId' },
  { back: 'Application.ccof_applicationid', front: 'applicationId' },
  { back: 'Application.statuscode', front: 'applicationStatus' },
  { back: 'Application.ccof_providertype', front: 'organizationProviderType' }, // group or family
  // Unneeded mappings, can be added in later if we want them
  // { back: 'Application.ccof_applicationtype', front: 'applicationType' },
  // { back: 'Application.ccof_name', front: 'ccofApplicationName' },
  // { back: 'Application.ccof_programyear', front: 'ccofProgramYearId' },
  // { back: 'Organization.accountnumber', front: 'organizationAccountNumber' },
];

const UserProfileFacilityMappings = [
  { back: 'CCOF.ccof_facility', front: 'facilityId' },
  { back: 'CCOF.Facility.name', front: 'facilityName'},
  // { back: 'CCOF.Facility.accountnumber', front: 'facilityAccountNumber'},
  //base funding
  { back: 'CCOF.ccof_application_basefundingid', front: 'ccofBaseFundingId'},
  { back: 'CCOF.statuscode', front: 'ccofBaseFundingStatus'},
  // { back: 'CCOF.ccof_name', front: 'ccofApplicationName'},
  //ccfri
  { back: 'CCFRI.statuscode', front: 'ccfriStatus'},
  { back: 'CCFRI.ccof_ccfrioptin', front: 'ccfriOptInStatus'},
  { back: 'CCFRI.ccof_applicationccfriid', front: 'ccfriApplicationId'},
  // { back: 'CCFRI.ccof_name', front: 'ccfriApplicationName'},
  //ece-we
  { back: 'ECEWE.statuscode', front: 'eceweStatus'},
  { back: 'ECEWE.ccof_optintoecewe', front: 'eceweOptInStatus'},
  { back: 'ECEWE.ccof_applicationeceweid', front: 'eceweApplicationId'},
  // { back: 'ECEWE.ccof_name', front: 'eceweApplicationName'},
];

module.exports = {
  OrganizationMappings,
  FacilityMappings,
  CCOFApplicationMappings,
  CCOFApplicationFunding: CCOFApplicationFundingMapping,
  UserProfileFacilityMappings,
  UserProfileOrganizationMappings
};
