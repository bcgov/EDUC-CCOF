const OrganizationMappings = [
  { back: 'ccof_facilitystartdate', front: 'yearBeganOperation' },
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
  // { back: 'ccof_typeoforganization@OData.Community.Display.V1.FormattedValue', front: 'organizationTypeDesc' },
  { back: 'ccof_formcomplete', front: 'isOrganizationComplete' },
  // { back: 'QQQQQQQQ', front: 'nameOfCareProvider' },
  // { back: 'QQQQQQQQ', front: 'facilityName' },
];

const FacilityMappings = [
  { back: 'name', front: 'facilityName' },
  { back: 'ccof_facilitystartdate', front: 'yearBeganOperation' },
  { back: 'address1_line1', front: 'facilityAddress' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_postalcode', front: 'postalCode' },
  { back: 'ccof_position', front: 'position' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'telephone1', front: 'phone' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber' },
  { back: 'ccof_licensestartdate', front: 'licenseEffectiveDate' },
  { back: 'ccof_facility_received_ccof_funding', front: 'fundingFacility' },
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },

  // XXXXXXXXXXXXX: 'licenseEffectiveDate',
  // XXXXXXXXXXXXX: 'hasReceivedFunding',
];

const CCFRIFacilityMappings = [
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_ccfrioptin', front: 'ccfriOptInStatus' },
  { back: 'ccof_informationccfri', front: 'ccfriApplicationNotes'},
  { back: '_ccof_previousccfri_value', front: 'previousCcfriId' },
  { back: 'ccof_formcomplete', front: 'ccof_formcomplete' },
  // XXXXXXXXXXXXX: 'licenseEffectiveDate',
  // XXXXXXXXXXXXX: 'hasReceivedFunding',
];

const RFIApplicationMappings = [
  { back: 'ccof_isthereanythingelseaboutyourchangeinhours', front: 'changeInHours'}, // "is there anything else about your change in hours",
  { back: 'ccof_rfipfiid', front: 'rfiId'}, // "df27e229-0b88-ed11-81ac-000d3af48db8",
  { back: 'ccof_feeincreasedduetoaincreasedconnection', front: 'feeIncrease' }, // 1 or 0
  { back: 'ccof_appliedforanyothersources', front: 'otherSources' }, // 1 or 0
  { back: 'ccof_howwillyourfeeincreasecontributetotheover', front: 'contributionOverall'}, // "how will your fee increase contribute to the overall?",
  { back: 'ccof_feeincreasedduetoaincreaseinhoursdays', front: 'increaseDueToHours' }, // 1 or 0
  { back: 'ccof_describewhetherparentsoutofpocketmonthlyc', front: 'outOfPocket'}, // "describe whether parents out of pocket monthly",
  { back: 'ccof_isthereanythingelseaboutyourexpensesyouw', front: 'anythingElse'}, // "is there anything else about your expenses",
  { back: 'ccof_meetalloftheabovecriteria', front: 'meetCriteria' }, // 1 or 0
  { back: 'statuscode', front: 'status' }, // 1 or 0
  { back: 'ccof_feeincreasedduetoanexceptionalcircumstance', front: 'exceptionalCircumstances'}, // 0,
  { back: 'ccof_pleaseexplainwhyyouhaveincurredorwillincu', front: 'xxx1'}, // "Please explain why you have incurred or will incur",
  { back: 'ccof_feeincreasedduetoawageincrease', front: 'feeIncreaseDueToWage' }, // 1 or 0
  { back: 'ccof_name', front: 'xxx3'}, // "RFI-22000025",
  { back: 'ccof_pleasedescribehowthemajorityofchildrenyou', front: 'xxx4'}, // "please describe how the majority of children you provide",
  { back: '_ccof_applicationccfri_value@OData.Community.Display.V1.FormattedValue', front: 'xxx5'}, // "ID-22000522",
  { back: '_ccof_applicationccfri_value', front: 'ccfriApplicationId'}, // "1d261039-0e7c-ed11-81ad-000d3af4f277",
  { back: 'ccof_increasedparentfeesbefore', front: 'xxx6' }, // 1 or 0
  { back: 'ccof_exceptionalcircumstanceoccurwithin6m', front: 'circumstanceOccurWithin6Month'}, // null,
];


const CCFRIClosureDateMappings = [
  { back: 'ccof_startdate', front: 'startDate' },
  { back: 'ccof_enddate', front: 'endDate' },
  { back: 'ccof_startdate@OData.Community.Display.V1.FormattedValue', front: 'formattedStartDate' },
  { back: 'ccof_enddate@OData.Community.Display.V1.FormattedValue', front: 'formattedEndDate' },
  { back: 'ccof_paidclosure', front: 'feesPaidWhileClosed' },
  { back: 'ccof_comment', front: 'closureReason' },
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
  { back: 'ccof_multiagechildcaremaxnumber', front: 'maxGroupChildCareMultiAge' },
  { back: 'ccof_groupchildcareunder36months', front: 'maxGroupChildCareUnder36' },
  
  { back: 'ccof_groupchildcare30monthtoschoolagemaxnumber', front: 'maxGroupChildCare36' },
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
  { back: '_ccof_facility_value', front: 'facilityId' },
  
];

const ECEWEApplicationMappings = [
  { back: 'ccof_applicationid', front: 'applicationId' },
  { back: 'ccof_ecewe_optin', front: 'optInECEWE' },
  { back: 'ccof_ecewe_employeeunion', front: 'belongsToUnion' },
  { back: 'ccof_ecewe_selecttheapplicablefundingmodel', front: 'fundingModel' },
  { back: 'ccof_ecewe_confirmation', front: 'confirmation' },
  { back: 'ccof_ccof_application_ccof_applicationecewe_application', front: 'facilities' },
  { back: 'ccof_licensecomplete', front: 'isLicenseUploadComplete' },
  { back: 'ccof_ecewe_eligibility_complete', front: 'isEceweComplete' },
];

const ECEWEFacilityMappings = [
  { back: 'ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_optintoecewe', front: 'optInOrOut' },
];

const UserProfileOrganizationMappings = [
  { back: 'organization_name', front: 'organizationName' },
  { back: 'organization_accountid', front: 'organizationId' },
  { back: 'organization_ccof_formcomplete', front: 'isOrganizationComplete' }
];

const UserProfileApplicationMappings = [ //application
  { back: 'ccof_applicationid', front: 'applicationId' },
  { back: 'statuscode', front: 'applicationStatus' },
  { back: 'ccof_providertype', front: 'organizationProviderType' }, // group or family
  { back: 'ccof_applicationtype', front: 'applicationType' },
  { back: 'ccof_licensecomplete', front: 'isLicenseUploadComplete' },
  { back: 'ccof_ecewe_eligibility_complete', front: 'isEceweComplete' },
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' },
  { back: 'ccof_unlock_licenseupload', front: 'unlockLicenseUpload' },
  { back: 'ccof_unlock_supportingdocument', front: 'unlockSupportingDocuments' },
  { back: 'ccof_unlock_ccof', front: 'unlockBaseFunding' },
  { back: 'ccof_unlock_ecewe', front: 'unlockEcewe' }
];

const UserProfileFacilityMappings = [
  { back: 'accountid', front: 'facilityId' },
  { back: 'name', front: 'facilityName' },
  { back: 'accountnumber', front: 'facilityAccountNumber' },
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber'},
];
const UserProfileBaseFundingMappings = [
  //base funding
  { back: 'ccof_application_basefundingid', front: 'ccofBaseFundingId' },
  { back: 'statuscode', front: 'ccofBaseFundingStatus' },
  { back: 'ccof_formcomplete', front: 'isCCOFComplete' },
  // { back: '---CCOF.ccof_name', front: 'ccofApplicationName'},
];

const OrganizationFacilityMappings = [
  { back: 'accountid', front: 'facilityId' },
  { back: 'name', front: 'facilityName' },
  { back: 'accountnumber', front: 'facilityAccountNumber' },
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber'},
];


const UserProfileCCFRIMappings = [
  { back: 'statuscode', front: 'ccfriStatus' },
  { back: 'ccof_ccfrioptin', front: 'ccfriOptInStatus' },
  { back: 'ccof_applicationccfriid', front: 'ccfriApplicationId' },
  { back: '_ccof_facility_value', front: 'ccfriFacilityId' },
  { back: 'ccof_formcomplete', front: 'isCCFRIComplete' },
  { back: 'ccof_unlock_rfi', front: 'unlockRfi'},
  { back: 'ccof_unlock_ccfri', front: 'unlockCcfri'},
  { back: 'ccof_unlock_nmf_rfi', front: 'unlockNmf'},
];

const UserProfileECEWEMappings = [
  { back: 'statuscode', front: 'eceweStatus' },
  { back: 'ccof_optintoecewe', front: 'eceweOptInStatus' },
  { back: 'ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: '_ccof_facility_value', front: 'eceweFacilityId' },
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

const MessageMappings = [
  { back: 'activityid', front: 'messageId' },
  { back: 'createdon', front: 'dateReceived' },
  { back: 'description', front: 'messageContent' },
  { back: 'lastopenedtime', front: 'lastOpenedTime' },
  { back: 'subject', front: 'subject' },
  { back: 'regardingobjectid_account_email.accountid', front: 'organizationId' },
  { back: 'regardingobjectid_account_email.name', front: 'organizationName' },
];

const DeclarationMappings = [
  { back: 'ccof_consent', front: 'agreeConsentCertify' },
  { back: 'ccof_submittedby', front: 'orgContactName' },
  { back: 'ccof_declarationastatus', front: 'declarationAStatus' },
  { back: 'ccof_declarationbstatus', front: 'declarationBStatus' },
  { back: 'statuscode', front: 'applicationStatus' },
];

module.exports = {
  OrganizationMappings,
  FacilityMappings,
  CCOFApplicationMappings,
  CCOFApplicationFundingMapping,
  ECEWEApplicationMappings,
  ECEWEFacilityMappings,
  UserProfileFacilityMappings,
  UserProfileBaseFundingMappings,
  UserProfileOrganizationMappings,
  UserProfileApplicationMappings,
  UserProfileCCFRIMappings,
  UserProfileECEWEMappings,
  ProgramYearMappings,
  MessageMappings,
  CCFRIFacilityMappings,
  CCFRIClosureDateMappings,
  OrganizationFacilityMappings,
  RFIApplicationMappings,
  DeclarationMappings
};
