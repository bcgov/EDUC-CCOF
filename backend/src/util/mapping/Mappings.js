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
  { back: 'ccof_isthereanythingelseaboutyourchangeinhours', front: 'notes2'}, // "is there anything else about your change in hours",
  { back: 'ccof_rfipfiid', front: 'rfiId'}, // "df27e229-0b88-ed11-81ac-000d3af48db8",
  { back: 'ccof_feeincreasedduetoaincreasedconnection', front: 'IndigenousConnection' }, // 1 or 0
  { back: 'ccof_appliedforanyothersources', front: 'q3' }, // 1 or 0
  { back: 'ccof_howwillyourfeeincreasecontributetotheover', front: 'orgsustainability'}, // "how will your fee increase contribute to the overall?",
  { back: 'ccof_feeincreasedduetoaincreaseinhoursdays', front: 'feeIncreaseExtendedHours' }, // 1 or 0
  { back: 'ccof_describewhetherparentsoutofpocketmonthlyc', front: 'outOfPocketFees'}, // "describe whether parents out of pocket monthly",

  { back: 'ccof_meetalloftheabovecriteria', front: 'underservedPop' }, // 1 or 0
  { back: 'statuscode', front: 'status' }, // 1 or 0
  { back: 'ccof_feeincreasedduetoanexceptionalcircumstance', front: 'exceptionalCircumstances'}, // 0,
  { back: 'ccof_expenseinformation_reasonforincreasedfinancial', front: 'expenseInformationNote'}, // "Please explain why you have incurred or will incur",
  { back: 'ccof_serviceexpansiondetails_reasonforincreasedfin', front: 'serviceExpansionDetailsNote'},
  { back: 'ccof_indigenouscommunityexpense_reasonforincreased', front: 'iCEIDetailsNote'},
  { back: 'ccof_name', front: 'xxx3'}, // "RFI-22000025",
  { back: 'ccof_pleasedescribehowthemajorityofchildrenyou', front: 'underservedChildCareTypes'}, // "please describe how the majority of children you provide",
  { back: '_ccof_applicationccfri_value', front: 'ccfriApplicationId'}, // "1d261039-0e7c-ed11-81ad-000d3af4f277",
  { back: 'ccof_increasedparentfeesbefore', front: 'xxx6' }, // 1 or 0
  { back: 'ccof_exceptionalcircumstanceoccurwithin6m', front: 'circumstanceOccurWithin6Month'}, // null,

  //Direct Care Staff Wage Increase
  { back: 'ccof_feeincreasedduetoawageincrease', front: 'feeIncreaseDueToWage' }, // 1 or 0,//Is your fee increase due to a wage increase for Direct Care Staff?
  {back:'ccof_wageincreasecommittedinwriting', front: 'increaseInWriting'}, //Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?
  {back:'ccof_wageincreaestipulatedincollectivebargaining', front: 'isBargainingAgreement'}, //Is the wage increase stipulated in a collective bargaining agreement for unionized staff at the facility?
  {back:'ccof_facilitycurrentwagesresultedinlossofdcs', front: 'lossOfCareStaff'},//Has the facility's current wage(s) resulted in loss of Direct Care Staff or an inability to hire sufficient Direct Care Staff?
  {back:'ccof_creatingimmediatehealthandsafetyconcerns', front: 'healthAndSafetyConcerns'},//Is this creating immediate health and safety concerns for the facility under the requirements of the Child Care Licensing Regulation (CCLR)?

  { back: 'ccof_facilitysrecruitmentandretentionchallenges', front: 'textbox1'},
  { back: 'ccof_howmanydirectcarestaffhaveleftyourfacility', front: 'textbox2'},
  { back: 'ccof_whathaveyoudonetotrytorecruitstaff', front: 'textbox3'},
  { back: 'ccof_adjustyourhoursdaysofoperation', front: 'textbox4'},
  { back: 'ccof_facilityunabletofillspaces', front: 'textbox5'},
  { back: 'ccof_isthereanythingelseaboutyourexpensesyouw', front: 'textbox6'}, // "is there anything else about your expenses",


];

const ServiceExpansionDetailsMappings = [//ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi.
  { back: 'ccof_facilitysprevioushoursofoperationto', front: 'timeto'},
  { back: 'ccof_facilitysprevioushoursofoperation', front: 'timefrom'},
  { back: 'ccof_facilitysnewhoursofoperation', front: 'newtimeto'},
  { back: 'ccof_facilitysnewhoursofoperationto', front: 'newtimefrom'},
  { back: 'ccof_paymentfrequencydetails', front: 'frequency'},
  { back: 'ccof_dateofchange', front: 'date'},
  { back: 'ccof_amountofexpense', front: 'expense'},
];

const DCSWageIncreaseMappings = [ //ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail
  { back: 'ccof_numberofstaff', front: 'staffNumber'},
  { back: 'ccof_dcsrole', front: 'staffRole'},
  { back: 'ccof_wagebeforeincrease', front: 'wageBeforeIncrease'},
  { back: 'ccof_wageafterincrease', front: 'wageAfterIncrease'},
  { back: 'ccof_averagehoursperweek', front: 'averageHours'},
  { back: 'ccof_wageincreasedate', front: 'wageDate'},
];

const ExpenseInformationMappings = [
  { back: 'ccof_expensedescription', front: 'description'},
  { back: 'ccof_dateofexpense', front: 'date'},
  { back: 'ccof_paymentfrequencydetails', front: 'frequency'},
  { back: 'ccof_expenseamount', front: 'expense'},
];

const OtherFundingProgramMappings = [
  { back: 'ccof_name', front: 'fundingProgram'},
  { back: 'ccof_applicationdate', front: 'date'},
  { back: 'ccof_statusofapplication', front: 'status'},
  { back: 'ccof_amountreceived', front: 'amount'},
  { back: 'ccof_expense', front: 'expenses'},
];

const IndigenousExpenseMappings = [
  { back: 'ccof_expensedescription', front: 'description'},
  { back: 'ccof_date', front: 'date'},
  { back: 'ccof_paymentfrequency', front: 'frequency'},
  { back: 'ccof_amount', front: 'expense'},
];

const NMFApplicationMappings = [
  { back: 'ccof_rfi_pfi_nmfid', front: 'nmfId' },
  { back: 'ccof_supportneeds', front: 'supportNeeds' }, // 1 or 0
  { back: 'ccof_supportneeds_comment', front: 'supportNeedsComments' }, // "Please describe any associated expenses."
  { back: 'ccof_lowincome_families', front: 'lowIncomeFamilies' }, // 1 or 0
  { back: 'ccof_lowincomefamilies_comments', front: 'lowIncomeFamiliesComments' }, // "Please describe the service(s) and associated expenses."
  { back: 'ccof_remote_communities', front: 'remoteCommunities' }, // 1 or 0
  { back: 'ccof_remotecommunities_comment', front: 'remoteCommunitiesComments' }, // "Please describe the service and associated expenses."
  { back: 'ccof_othercomment', front: 'otherComments' }, // "Please tell us anything else you’d like us to know ..."
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
  { back: 'ccof_maximumnumberofchildcarespacesyouoffer', front: 'maxSpaces' },
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

  { back: 'ccof_maximumnumberofspacesyouofferextendedhours', front: 'maxCapacityExtended' },
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
  { back: 'ccof_unlock_ecewe', front: 'unlockEcewe' },
  { back: 'ccof_ccofstatus', front: 'ccofStatus' },
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
  { back: 'ccof_has_nmf', front: 'hasNmf'},
  { back: 'ccof_has_rfi', front: 'hasRfi'},
  { back: 'ccof_nmf_formcomplete', front: 'isNmfComplete'},
  { back: 'ccof_rfi_formcomplete', front: 'isRfiComplete'},
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
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' },
  { back: 'ccof_unlock_licenseupload', front: 'unlockLicenseUpload' },
  { back: 'ccof_unlock_supportingdocument', front: 'unlockSupportingDocuments' },
  { back: 'ccof_unlock_ccof', front: 'unlockBaseFunding' },
  { back: 'ccof_unlock_ecewe', front: 'unlockEcewe' },
  { back: 'facilities', front: 'facilities'}
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
  DeclarationMappings,
  ServiceExpansionDetailsMappings,
  DCSWageIncreaseMappings,
  ExpenseInformationMappings,
  OtherFundingProgramMappings,
  NMFApplicationMappings,
  IndigenousExpenseMappings
};
