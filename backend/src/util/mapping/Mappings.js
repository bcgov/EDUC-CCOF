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
  { back: 'ccof_formcomplete', front: 'isOrganizationComplete' },
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
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },

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
  { back: 'ccof_monthwhenfacilityisclosedforentiremonth', front: 'hasClosedMonth' },

  { back: 'ccof_closedfacilityinjan', front: 'closedIn1' },
  { back: 'ccof_closedfacilityinfeb', front: 'closedIn2' },
  { back: 'ccof_closedfacilityinmar', front: 'closedIn3' },
  { back: 'ccof_closedfacilityinapr', front: 'closedIn4' },
  { back: 'ccof_closedfacilityinmay', front: 'closedIn5' },
  { back: 'ccof_closedfacilityinjun', front: 'closedIn6' },
  { back: 'ccof_closedfacilityinjul', front: 'closedIn7' },
  { back: 'ccof_closedfacilityinaug', front: 'closedIn8' },
  { back: 'ccof_closedfacilityinsep', front: 'closedIn9' },
  { back: 'ccof_closedfacilityinoct', front: 'closedIn10' },
  { back: 'ccof_closedfacilityinnov', front: 'closedIn11' },
  { back: 'ccof_closedfacilityindec', front: 'closedIn12' },

  { back: 'ccof_maxnoofdaysperweekyouprovidechildcare', front: 'maxDaysPerWeek' },
  { back: 'ccof_maxnoofweeksperyearyouprovidechildcare', front: 'maxWeeksPerYear' },
  { back: 'ccof_facilityhoursofoperationfrom', front: 'hoursFrom12hr' },
  { back: 'ccof_facilityhoursofoperationto', front: 'hoursTo12hr' },
  { back: 'ccof_maximumlicensedcapacity', front: 'maxLicensesCapacity' },
  { back: 'ccof_multiagechildcaremaxnumber', front: 'maxGroupChildCare' },
  { back: 'ccof_groupchildcareunder36months', front: 'maxGroupChildCare36' },
  { back: 'ccof_preschoolmaxnumber', front: 'maxPreschool' },
  { back: 'ccof_groupchildcareschoolagecareonschoolground', front: 'maxGroupChildCareSchool' },
  { back: 'ccof_preschoolsessionmon', front: 'monday' },
  { back: 'ccof_preschoolsessiontues', front: 'tusday' },
  { back: 'ccof_preschoolsessionwed', front: 'wednesday' },
  { back: 'ccof_preschoolsessionthurs', front: 'thursday' },
  { back: 'ccof_preschoolsessionfri', front: 'friday' },
  { back: 'ccof_isthefacilitylocatedonschoolproperty', front: 'isSchoolProperty', },
  { back: 'ccof_beforeschool', front: 'beforeSchool' },
  { back: 'ccof_beforekindergarten', front: 'beforeKindergarten' },
  { back: 'ccof_afterkindergarten', front: 'afterKindergarten' },
  { back: 'ccof_afterschool', front: 'afterSchool' },

  { back: 'ccof_maxnoofdaysperweekextendedhoursoffered', front: 'maxDaysPerWeekExtended' },
  { back: 'ccof_maxnoofweeksperyearextendedhoursoffered', front: 'maxWeeksPerYearExtended' },

  
  { back: 'ccof_under36months4hoursoflessextendedcc', front: 'groupChildCareUnder36Months4OrLess' },
  { back: 'ccof_30monthtoschoolage4hoursoflessextendedcc', front: 'groupChildCare36MonthsToSchoolAge4OrLess' },
  { back: 'ccof_schoolageonground4hoursoflessextendedcc', front: 'groupChildCareSchoolAge4OrLess' },
  { back: 'ccof_multiagechildcare4hoursoflessextendedcc', front: 'multiAgeCare4OrLess' },

  { back: 'ccof_under36monthsmorethan4hourextendedcc', front: 'groupChildCareUnder36Months4OrMore' },
  { back: 'ccof_30monthtoschoolagemorethan4hourextended', front: 'groupChildCare36MonthsToSchoolAge4OrMore' },
  { back: 'ccof_schoolageongroundmorethan4hrextendedcc', front: 'groupChildCareSchoolAge4OrMore' },
  { back: 'ccof_multiagechildcaremorethan4hourextendedcc', front: 'multiAgeCare4more' },
  
  { back: 'ccof_regularlyofferextendeddailyhourofchildca', front: 'isExtendedHours' },
  { back: 'ccof_formcomplete', front: 'isCCOFComplete' },
  
];

const ECEWEApplicationMappings = [
  { back: 'ccof_applicationid', front: 'applicationId' },
  { back: 'ccof_ecewe_optin', front: 'q1OptInECEWE' },
  { back: 'ccof_ecewe_employeeunion', front: 'q2BelongsToUnion' },
  { back: 'ccof_ecewe_selecttheapplicablefundingmodel', front: 'q3FundingModel' },
  { back: 'ccof_ccof_application_ccof_applicationecewe_application', front: 'facilities' },
];

const ECEWEFacilityMappings = [
  { back: 'ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_optintoecewe', front: 'optInOrOut' },
];

const UserProfileOrganizationMappings = [
  { back: 'Organization.name', front: 'organizationName' },
  { back: 'Organization.accountid', front: 'organizationId' },
  { back: 'Organization.ccof_formcomplete', front: 'isOrganizationComplete' },
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
  { back: 'CCOF.Facility.name', front: 'facilityName' },
  { back: 'CCOF.Facility.accountnumber', front: 'facilityAccountNumber' },
  { back: 'CCOF.Facility.ccof_formcomplete', front: 'isFacilityComplete' },
  { back: 'CCOF.Facility.ccof_facilitylicencenumber', front: 'licenseNumber'},
  //base funding
  { back: 'CCOF.ccof_application_basefundingid', front: 'ccofBaseFundingId' },
  { back: 'CCOF.statuscode', front: 'ccofBaseFundingStatus' },
  { back: 'CCOF.ccof_formcomplete', front: 'isCCOFComplete' },
  { back: 'CCOF.ccof_name', front: 'ccofApplicationName'},
  
];

const UserProfileCCFRIMappings = [
  { back: 'CCFRI.statuscode', front: 'ccfriStatus' },
  { back: 'CCFRI.ccof_ccfrioptin', front: 'ccfriOptInStatus' },
  { back: 'CCFRI.ccof_applicationccfriid', front: 'ccfriApplicationId' },
  { back: 'CCFRI.ccof_applicationccfriid', front: 'ccfriApplicationId' },
  { back: 'CCFRI.ccof_facility', front: 'ccfriFacilityId' },
  { back: 'CCFRI.ccof_formcomplete', front: 'isCCFRIComplete' },
  { back: 'CCFRI.ccof_name', front: 'ccfriApplicationName'},
];

const UserProfileECEWEMappings = [
  { back: 'ECEWE.statuscode', front: 'eceweStatus' },
  { back: 'ECEWE.ccof_optintoecewe', front: 'eceweOptInStatus' },
  { back: 'ECEWE.ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: 'ECEWE.ccof_facility', front: 'eceweFacilityId' },
  { back: 'ECEWE.ccof_formcomplete', front: 'isECEWEComplete' },
  { back: 'ECEWE.ccof_name', front: 'eceweApplicationName'},
];

const ProgramYearMappings = [
  { back: 'ccof_program_yearid', front: 'programYearId' },
  { back: 'ccof_name', front: 'name' },
  { back: 'statuscode', front: 'status' },
  { back: 'ccof_programyearnumber', front: 'order' },
  { back: '_ccof_previousyear_value', front: 'previousYearId' },
  { back: 'ccof_intakeperiodstart', front: 'intakeStart' },
  { back: 'ccof_intakeperiodend', front: 'intakeEnd' },
  { back: 'ccof_declarationbstart', front: 'declarationbStart' },
];

module.exports = {
  OrganizationMappings,
  FacilityMappings,
  CCOFApplicationMappings,
  CCOFApplicationFundingMapping,
  ECEWEApplicationMappings,
  ECEWEFacilityMappings,
  UserProfileFacilityMappings,
  UserProfileOrganizationMappings,
  UserProfileCCFRIMappings,
  UserProfileECEWEMappings,
  ProgramYearMappings,
};
