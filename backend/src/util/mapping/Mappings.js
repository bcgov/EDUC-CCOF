const OrganizationMappings = [
  { back: 'ccof_facilitystartdate', front: 'yearBeganOperation' },
  { back: 'name', front: 'legalName' },
  { back: 'accountnumber', front: 'accountNumber' },
  { back: 'address1_name', front: 'address1' }, //Address
  { back: 'address1_city', front: 'city1' },
  { back: 'address1_stateorprovince', front: 'province1' },
  { back: 'address1_postalcode', front: 'postalCode1' },
  { back: 'address2_name', front: 'address2' }, //Mailing Address
  { back: 'address2_city', front: 'city2' },
  { back: 'address2_stateorprovince', front: 'province2' },
  { back: 'address2_postalcode', front: 'postalCode2' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'ccof_position', front: 'position' },
  { back: 'telephone1', front: 'phone' },
  // { back: 'businessBCeID', front: 'businessId'},
  { back: 'emailaddress1', front: 'email' },
  { back: '_primarycontactid_value', front: 'primaryContactId' },
  { back: 'ccof_instructionnumber', front: 'incNumber' }, //incorporation number
  { back: 'ccof_typeoforganization', front: 'organizationType' },
  { back: 'ccof_typeoforganization@OData.Community.Display.V1.FormattedValue', front: 'organizationTypeDesc' },
  { back: 'ccof_formcomplete', front: 'isOrganizationComplete' },
  { back: 'ccof_is_mailing_address_same', front: 'isSameAsMailing' },
  { back: 'ccof_is_org_mailing_address_entered_manually', front: 'isOrgMailingAddressEnteredManually' },
  { back: 'ccof_is_org_street_address_entered_manually', front: 'isOrgStreetAddressEnteredManually' },
  { back: 'ccof_providername', front: 'nameOfCareProvider' },
  { back: 'ccof_doingbusinessas', front: 'doingBusinessAs' },
  { back: 'ccof_partner1firstname', front: 'partner1FirstName' },
  { back: 'ccof_partner1middlename', front: 'partner1MiddleName' },
  { back: 'ccof_partner1lastname', front: 'partner1LastName' },
  { back: 'ccof_partner2firstname', front: 'partner2FirstName' },
  { back: 'ccof_partner2middlename', front: 'partner2MiddleName' },
  { back: 'ccof_partner2lastname', front: 'partner2LastName' },
  { back: 'ccof_partner3firstname', front: 'partner3FirstName' },
  { back: 'ccof_partner3middlename', front: 'partner3MiddleName' },
  { back: 'ccof_partner3lastname', front: 'partner3LastName' },
  { back: 'ccof_partner4firstname', front: 'partner4FirstName' },
  { back: 'ccof_partner4middlename', front: 'partner4MiddleName' },
  { back: 'ccof_partner4lastname', front: 'partner4LastName' },
  { back: 'ccof_organizationwebsiteurl', front: 'website' },
  { back: 'ccof_numberoffacilities', front: 'numberOfFacilities' },
];

const FacilityMappings = [
  { back: 'name', front: 'facilityName' },
  { back: 'ccof_facilitystartdate', front: 'yearBeganOperation' },
  { back: 'address1_line1', front: 'facilityAddress' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_stateorprovince', front: 'province' },
  { back: 'address1_postalcode', front: 'postalCode' },
  { back: 'ccof_position', front: 'position' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'address1_primarycontactname', front: 'contactName' },
  { back: 'telephone1', front: 'phone' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber' },
  { back: 'ccof_licensestartdate', front: 'licenseEffectiveDate' },
  { back: 'ccof_everreceivedfundingundertheccofprogram', front: 'hasReceivedFunding' },
  { back: 'ccof_facilityreceived_ccof_funding', front: 'fundingFacility' },
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },
  { back: 'accountnumber', front: 'facilityAccountNumber' },
  { back: '_ccof_change_request_value', front: 'changeRequestId' }, //likely won't stay here
  { back: 'ccof_is_facility_address_entered_manually', front: 'isFacilityAddressEnteredManually' },
  { back: 'ccof_is_facility_address_same_as_org', front: 'isFacilityAddressSameAsOrgStreetAddress' },
  { back: 'ccof_is_facility_contact_same_as_org', front: 'isFacilityContactSameAsOrgContact' },
  { back: 'ccof_healthauthority', front: 'healthAuthority' },
];

const CCFRIFacilityMappings = [
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_ccfrioptin', front: 'ccfriOptInStatus' },
  { back: 'ccof_informationccfri', front: 'ccfriApplicationNotes' },
  { back: '_ccof_previousccfri_value', front: 'previousCcfriId' },
  { back: 'ccof_formcomplete', front: 'ccof_formcomplete' },
  { back: 'ccof_feecorrectccfri', front: 'existingFeesCorrect' },
  { back: 'ccof_chargefeeccfri', front: 'hasClosureFees' },
  { back: 'ccof_applicationccfriid', front: 'ccfriApplicationId' },
  { back: 'ccof_unlock_rfi', front: 'unlockRfi' },
  { back: 'ccof_unlock_afs', front: 'unlockAfs' },
  { back: 'ccof_unlock_afsenable', front: 'enableAfs' },
  { back: 'ccof_afs_status', front: 'afsStatus' },
  { back: 'ccof_afs_status_mtfi', front: 'afsStatusMtfi' },
  { back: 'ccof_closureformcomplete', front: 'isCCFRIClosuresComplete' },
];

const RFIApplicationMappings = [
  { back: 'ccof_isthereanythingelseaboutyourchangeinhours', front: 'notes2' }, // "is there anything else about your change in hours",
  { back: 'ccof_rfipfiid', front: 'rfiId' }, // "df27e229-0b88-ed11-81ac-000d3af48db8",
  { back: 'ccof_feeincreasedduetoaincreasedconnection', front: 'IndigenousConnection' }, // 1 or 0
  { back: 'ccof_appliedforanyothersources', front: 'q3' }, // 1 or 0
  { back: 'ccof_howwillyourfeeincreasecontributetotheover', front: 'orgsustainability' }, // "how will your fee increase contribute to the overall?",
  { back: 'ccof_feeincreasedduetoaincreaseinhoursdays', front: 'feeIncreaseExtendedHours' }, // 1 or 0
  { back: 'ccof_describewhetherparentsoutofpocketmonthlyc', front: 'outOfPocketFees' }, // "describe whether parents out of pocket monthly",

  { back: 'ccof_meetalloftheabovecriteria', front: 'underservedPop' }, // 1 or 0
  { back: 'statuscode', front: 'status' }, // 1 or 0
  { back: 'ccof_feeincreasedduetoanexceptionalcircumstance', front: 'exceptionalCircumstances' }, // 0,
  { back: 'ccof_expenseinformation_reasonforincreasedfinancial', front: 'expenseInformationNote' }, // "Please explain why you have incurred or will incur",
  { back: 'ccof_serviceexpansiondetails_reasonforincreasedfin', front: 'serviceExpansionDetailsNote' },
  { back: 'ccof_indigenouscommunityexpense_reasonforincreased', front: 'iCEIDetailsNote' },
  { back: 'ccof_name', front: 'xxx3' }, // "RFI-22000025",
  { back: 'ccof_pleasedescribehowthemajorityofchildrenyou', front: 'underservedChildCareTypes' }, // "please describe how the majority of children you provide",
  { back: '_ccof_applicationccfri_value', front: 'ccfriApplicationId' }, // "1d261039-0e7c-ed11-81ad-000d3af4f277",
  { back: 'ccof_increasedparentfeesbefore', front: 'xxx6' }, // 1 or 0
  { back: 'ccof_exceptionalcircumstanceoccurwithin6m', front: 'circumstanceOccurWithin6Month' }, // null,

  //Direct Care Staff Wage Increase
  { back: 'ccof_feeincreasedduetoawageincrease', front: 'feeIncreaseDueToWage' }, // 1 or 0,//Is your fee increase due to a wage increase for Direct Care Staff?
  { back: 'ccof_wageincreasecommittedinwriting', front: 'increaseInWriting' }, //Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?
  { back: 'ccof_wageincreaestipulatedincollectivebargaining', front: 'isBargainingAgreement' }, //Is the wage increase stipulated in a collective bargaining agreement for unionized staff at the facility?
  { back: 'ccof_facilitycurrentwagesresultedinlossofdcs', front: 'lossOfCareStaff' }, //Has the facility's current wage(s) resulted in loss of Direct Care Staff or an inability to hire sufficient Direct Care Staff?
  { back: 'ccof_creatingimmediatehealthandsafetyconcerns', front: 'healthAndSafetyConcerns' }, //Is this creating immediate health and safety concerns for the facility under the requirements of the Child Care Licensing Regulation (CCLR)?

  { back: 'ccof_facilitysrecruitmentandretentionchallenges', front: 'textbox1' },
  { back: 'ccof_howmanydirectcarestaffhaveleftyourfacility', front: 'textbox2' },
  { back: 'ccof_whathaveyoudonetotrytorecruitstaff', front: 'textbox3' },
  { back: 'ccof_adjustyourhoursdaysofoperation', front: 'textbox4' },
  { back: 'ccof_facilityunabletofillspaces', front: 'textbox5' },
  { back: 'ccof_isthereanythingelseaboutyourexpensesyouw', front: 'textbox6' }, // "is there anything else about your expenses",
];

const ServiceExpansionDetailsMappings = [
  //ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi.
  { back: 'ccof_facilitysprevioushoursofoperationto', front: 'timeto' },
  { back: 'ccof_facilitysprevioushoursofoperation', front: 'timefrom' },
  { back: 'ccof_facilitysnewhoursofoperation', front: 'newtimefrom' },
  { back: 'ccof_facilitysnewhoursofoperationto', front: 'newtimeto' },
  { back: 'ccof_paymentfrequencydetails', front: 'frequency' },
  { back: 'ccof_dateofchange', front: 'date' },
  { back: 'ccof_amountofexpense', front: 'expense' },
  { back: 'ccof_rfipfiserviceexpansiondetailid', front: 'id' },
];

const DCSWageIncreaseMappings = [
  //ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail
  { back: 'ccof_numberofstaff', front: 'staffNumber' },
  { back: 'ccof_dcsrole', front: 'staffRole' },
  { back: 'ccof_wagebeforeincrease', front: 'wageBeforeIncrease' },
  { back: 'ccof_wageafterincrease', front: 'wageAfterIncrease' },
  { back: 'ccof_averagehoursperweek', front: 'averageHours' },
  { back: 'ccof_wageincreasedate', front: 'wageDate' },
  { back: 'ccof_rfi_pfi_dcs_wi_detailid', front: 'id' },
];

const ExpenseInformationMappings = [
  { back: 'ccof_expensedescription', front: 'description' },
  { back: 'ccof_dateofexpense', front: 'date' },
  { back: 'ccof_paymentfrequencydetails', front: 'frequency' },
  { back: 'ccof_expenseamountt', front: 'expense' },
  { back: 'ccof_rfipfiexpenseinfoid', front: 'id' },
];

const OtherFundingProgramMappings = [
  { back: 'ccof_name', front: 'fundingProgram' },
  { back: 'ccof_applicationdate', front: 'date' },
  { back: 'ccof_statusofapplication', front: 'status' },
  { back: 'ccof_amountreceived', front: 'amount' },
  { back: 'ccof_expense', front: 'expenses' },
  { back: 'ccof_rfi_pfi_other_fundingid', front: 'id' },
];

const IndigenousExpenseMappings = [
  { back: 'ccof_expensedescription', front: 'description' },
  { back: 'ccof_date', front: 'date' },
  { back: 'ccof_paymentfrequency', front: 'frequency' },
  { back: 'ccof_amount', front: 'expense' },
  { back: 'ccof_rfipfiserviceexpansionindigenouscommunityid', front: 'id' },
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
  { back: 'ccof_consent', front: 'hasConsent' }, // 1
];

const CCOFApplicationFundingMapping = [
  { back: '_ccof_licensetypes_value', front: 'licenceCategoryId' },
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
  { back: 'ccof_facilityhoursofoperationfrom', front: 'hoursFrom' },
  { back: 'ccof_facilityhoursofoperationto', front: 'hoursTo' },
  { back: 'ccof_maximumnumberofchildcarespacesyouoffer', front: 'maxSpaces' },

  { back: 'ccof_has_under36months', front: 'hasUnder36Months' },
  { back: 'ccof_has_30monthtoschoolage', front: 'has30MonthToSchoolAge' },
  { back: 'ccof_has_schoolagecareonschoolground', front: 'hasSchoolAgeCareOnSchoolGrounds' },
  { back: 'ccof_has_preschool', front: 'hasPreschool' },
  { back: 'ccof_has_multiagechildcare', front: 'hasMultiAge' },

  { back: 'ccof_maximumlicensedcapacity', front: 'maxLicensesCapacity' },
  { back: 'ccof_familychildcaremaxnumber', front: 'maxFamilyChildCare' },
  { back: 'ccof_inhomemultiageccmaxnumber', front: 'maxInHomeMultiAgeChildCare' },
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
  { back: 'ccof_isthefacilitylocatedonschoolproperty', front: 'isSchoolProperty' },
  { back: 'ccof_beforeschool', front: 'beforeSchool' },
  { back: 'ccof_beforekindergarten', front: 'beforeKindergarten' },
  { back: 'ccof_afterkindergarten', front: 'afterKindergarten' },
  { back: 'ccof_afterschool', front: 'afterSchool' },

  { back: 'ccof_maximumnumberofspacesyouofferextendedhours', front: 'maxCapacityExtended' },
  { back: 'ccof_maxnoofdaysperweekextendedhoursoffered', front: 'maxDaysPerWeekExtended' },
  { back: 'ccof_maxnoofweeksperyearextendedhoursoffered', front: 'maxWeeksPerYearExtended' },

  { back: 'ccof_has_under36months_extendedcc', front: 'hasUnder36MonthsExtendedCC' },
  { back: 'ccof_has_30monthtoschoolage_extendedcc', front: 'has30MonthToSchoolAgeExtendedCC' },
  { back: 'ccof_has_schoolagecareonschoolground_extendedc', front: 'hasSchoolAgeCareOnSchoolGroundsExtendedCC' },
  { back: 'ccof_has_multiagechildcare_extendedcc', front: 'hasMultiAgeExtendedCC' },

  { back: 'ccof_under36months4hoursoflessextendedcc', front: 'extendedChildCareUnder36Months4OrLess' },
  { back: 'ccof_30monthtoschoolage4hoursoflessextendedcc', front: 'extendedChildCare36MonthsToSchoolAge4OrLess' },
  { back: 'ccof_schoolageonground4hoursoflessextendedcc', front: 'extendedChildCareSchoolAge4OrLess' },
  { back: 'ccof_multiagechildcare4hoursoflessextendedcc', front: 'multiAgeCare4OrLess' },
  { back: 'ccof_familychildcare4hoursorlessextendedcc', front: 'familyExtendedCC4OrLess' },
  { back: 'ccof_inhomemultiagecc4hoursorlessextendedcc', front: 'inHomeMultiAgeExtendedCC4OrLess' },

  { back: 'ccof_under36monthsmorethan4hourextendedcc', front: 'extendedChildCareUnder36Months4OrMore' },
  { back: 'ccof_30monthtoschoolagemorethan4hourextended', front: 'extendedChildCare36MonthsToSchoolAge4OrMore' },
  { back: 'ccof_schoolageongroundmorethan4hrextendedcc', front: 'extendedChildCareSchoolAge4OrMore' },
  { back: 'ccof_multiagechildcaremorethan4hourextendedcc', front: 'multiAgeCare4more' },
  { back: 'ccof_familychildcaremorethan4hoursextendedcc', front: 'familyExtendedCC4OrMore' },
  { back: 'ccof_inhomemultiageccmorethan4hoursextendedcc', front: 'inHomeMultiAgeExtendedCC4OrMore' },

  { back: 'ccof_regularlyofferextendeddailyhourofchildca', front: 'isExtendedHours' },
  { back: 'ccof_formcomplete', front: 'isCCOFComplete' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_application_basefundingid', front: 'ccofBaseFundingId' },

  { back: 'ccof_providertype@OData.Community.Display.V1.FormattedValue', front: 'providerType' },
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
  { back: 'ccof_ecewe_selecttheapplicablesector', front: 'applicableSector' },
  { back: 'ccof_public_sector_employer', front: 'publicSector' }, //null,
  { back: 'ccof_union_agreement_reached', front: 'isUnionAgreementReached' }, //null,
  { back: 'ccof_describe_your_org', front: 'describeOrgCSSEA' }, //null,
];

const ECEWEFacilityMappings = [
  { back: 'ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_optintoecewe', front: 'optInOrOut' },
  { back: 'ccof_facilityunionstatus', front: 'facilityUnionStatus' },
  { back: 'ccof_change_request_new_facilityid', front: 'changeRequestNewFacilityId' },
];

const UserProfileOrganizationMappings = [
  { back: 'organization_name', front: 'organizationName' },
  { back: 'organization_accountid', front: 'organizationId' },
  { back: 'organization_ccof_formcomplete', front: 'isOrganizationComplete' },
  { back: 'organization_accountnumber', front: 'organizationAccountNumber' },
  { back: 'organization_ccof_fundingagreementnumber', front: 'fundingAgreementNumber' },
  { back: 'organization_ccof_bypass_goodstanding_check', front: 'organizationBypassGoodStandingCheck' },
  { back: 'organization_ccof_good_standing_status', front: 'organizationGoodStandingStatus' },
];

const UserProfileApplicationMappings = [
  //application
  { back: 'ccof_applicationid', front: 'applicationId' },
  { back: 'statuscode', front: 'applicationStatus' },
  { back: 'ccof_providertype', front: 'organizationProviderType' }, // group or family
  { back: 'ccof_applicationtype', front: 'applicationType' },
  { back: 'ccof_application_template_version', front: 'applicationTemplateVersion' },
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
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber' },
  { back: 'ccof_facilitystatus_formatted', front: 'facilityStatus' },
  { back: 'ccof_healthauthority', front: 'healthAuthority' },
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
  { back: 'statuscode', front: 'statusCode' },
  { back: 'accountnumber', front: 'facilityAccountNumber' },
  { back: 'ccof_formcomplete', front: 'isFacilityComplete' },
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber' },
  { back: 'telephone1', front: 'telephone' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'address1_line1', front: 'addressLineOne' },
  { back: 'address1_line2', front: 'addressLineTwo' },
  { back: 'address1_city', front: 'city' },
  { back: 'address1_stateorprovince', front: 'province' },
  { back: 'address1_postalcode', front: 'postalCode' },
];

const ClosureMappings = [
  { back: 'ccof_application_ccfri_closureid', front: 'closureId' },
  { back: '_ccof_applicationccfri_value', front: 'ccfriApplicationId' },
  { back: '_ccof_facilityinfo_value', front: 'facilityId' },
  { back: '_ccof_facilityinfo_value@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
  { back: '_ccof_organizationfacility_value', front: 'organizationId' },
  { back: '_ccof_program_year_value', front: 'programYearId' },
  { back: 'ccof_startdate', front: 'startDate' },
  { back: 'ccof_enddate', front: 'endDate' },
  { back: 'ccof_closure_status', front: 'closureStatus' },
  { back: 'ccof_closure_type', front: 'closureType' },
  { back: 'ccof_payment_eligibility', front: 'paymentEligibility' },
  { back: 'ccof_age_affected_groups', front: 'ageGroups' },
  { back: 'ccof_comment', front: 'closureReason' },
  { back: 'ccof_is_full_closure', front: 'fullClosure' },
  { back: 'ccof_paidclosure', front: 'paidClosure' },
  { back: '_ccof_change_action_closure_value', front: 'changeActionClosureId' },
];

const UserProfileBaseCCFRIMappings = [
  { back: 'statuscode', front: 'ccfriStatus' },
  { back: 'ccof_ccfrioptin', front: 'ccfriOptInStatus' },
  { back: 'ccof_applicationccfriid', front: 'ccfriApplicationId' },
  { back: '_ccof_facility_value', front: 'ccfriFacilityId' },
  { back: 'ccof_formcomplete', front: 'isCCFRIComplete' },
  { back: 'ccof_has_nmf', front: 'hasNmf' },
  { back: 'ccof_has_rfi', front: 'hasRfi' },
  { back: 'ccof_closureformcomplete', front: 'isCCFRIClosuresComplete' },
  { back: 'ccof_nmf_formcomplete', front: 'isNmfComplete' },
  { back: 'ccof_rfi_formcomplete', front: 'isRfiComplete' },
];

const UserProfileCCFRIMappings = [
  { back: 'ccof_unlock_rfi', front: 'unlockRfi' },
  { back: 'ccof_unlock_ccfri', front: 'unlockCcfri' },
  { back: 'ccof_unlock_nmf_rfi', front: 'unlockNmf' },
  { back: 'ccof_unlock_afs', front: 'unlockAfs' },
  { back: 'ccof_unlock_afsenable', front: 'enableAfs' },
  { back: 'ccof_afs_status', front: 'afsStatus' },
  ...UserProfileBaseCCFRIMappings,
];
const UserProfileECEWEMappings = [
  { back: 'statuscode', front: 'eceweStatus' },
  { back: 'ccof_optintoecewe', front: 'eceweOptInStatus' },
  { back: 'ccof_applicationeceweid', front: 'eceweApplicationId' },
  { back: '_ccof_facility_value', front: 'eceweFacilityId' },
];

const UserProfileChangeRequestNewFacilityMappings = [
  { back: 'ccof_change_requestid', front: 'changeRequestId' },
  { back: 'ccof_change_request_new_facilityid', front: 'changeRequestNewFacilityId' },
  { back: '_ccof_change_action_value', front: 'changeActionId' },
  { back: '_ccof_ccof_value', front: 'ccofBaseFundingId' },
  { back: '_ccof_ccfri_value', front: 'ccfriApplicationId' },
  { back: '_ccof_ecewe_value', front: 'eceweApplicationId' },
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
  { back: 'ccof_ccfri_funding_guidelines', front: 'fundingGuidelinesUrl' },
];

const MessageMappings = [
  { back: 'activityid', front: 'messageId' },
  { back: 'createdon', front: 'dateReceived' },
  { back: 'ccof_program_year', front: 'programYearValue' },
  { back: 'description', front: 'messageContent' },
  { back: 'lastopenedtime', front: 'lastOpenedTime' },
  { back: 'subject', front: 'subject' },
  { back: 'regardingobjectid_account_email.accountid', front: 'organizationId' },
  { back: 'regardingobjectid_account_email.name', front: 'organizationName' },
];

const DeclarationMappings = [
  { back: 'ccof_consent', front: 'agreeConsentCertify' },
  { back: 'ccof_submittedby', front: 'orgContactName' },
  { back: 'ccof_latestsubmissiondate', front: 'latestSubmissionDate' },
  { back: 'ccof_declarationastatus', front: 'declarationAStatus' },
  { back: 'ccof_declarationbstatus', front: 'declarationBStatus' },
  { back: 'statuscode', front: 'applicationStatus' },
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' },
  { back: 'ccof_unlock_licenseupload', front: 'unlockLicenseUpload' },
  { back: 'ccof_unlock_supportingdocument', front: 'unlockSupportingDocuments' },
  { back: 'ccof_unlock_ccof', front: 'unlockBaseFunding' },
  { back: 'ccof_unlock_ecewe', front: 'unlockEcewe' },
  { back: 'facilities', front: 'facilities' },
];

const SystemMessagesMappings = [
  { back: 'ccof_systemmessageid', front: 'messageID' },
  { back: 'ccof_startdate', front: 'startDate' },
  { back: 'ccof_enddate', front: 'endDate' },
  { back: 'ccof_message', front: 'message' },
];

const ApplicationSummaryMappings = [
  // Application Details
  { back: '_ccof_programyear_value', front: 'programYearId' }, //"cd63f67b-bd39-ed11-9db0-002248d53d53",
  { back: '_ccof_organization_value', front: 'organizationId' }, //"45c35443-6a35-ed11-9db1-002248d53d53",
  { back: 'ccof_applicationtype', front: 'applicationType' }, //100000002,
  { back: 'ccof_applicationid', front: 'applicationId' }, //"ad483720-e1a7-ed11-aad0-000d3a09c3a2",
  { back: 'ccof_name', front: 'name' }, //"APP-23005239",
  { back: 'ccof_providertype', front: 'organizationProviderType' }, //100000001,
  // Unsure if this is needed
  // { back: 'ccof_familychildcare', front: 'isFamiliyChildCare' }, //false,
  // { back: 'ccof_multiagechildcare', front: 'isMultiAgeChildCare' }, //false,
  // { back: 'ccof_inhomemultiagechildcare', front: 'isHomeMultiAgeChildCare' }, //false,
  // Declaration Details
  { back: 'ccof_consent', front: 'hasConsent' }, //1,
  { back: 'ccof_declarationastatus', front: 'declarationAStatus' }, //1,
  { back: 'ccof_declarationbstatus', front: 'declarationBStatus' }, //1,
  { back: 'ccof_submittedby', front: 'orgContactName' }, //"agree",
  // ECE-WE Details
  { back: 'ccof_ecewe_optin', front: 'optInECEWE' }, //1,
  { back: 'ccof_ecewe_selecttheapplicablesector', front: 'applicableSector' }, //null,
  { back: 'ccof_ecewe_confirmation', front: 'confirmation' }, //null,
  { back: 'ccof_ecewe_employeeunion', front: 'belongsToUnion' }, //0,
  { back: 'ccof_ecewe_selecttheapplicablefundingmodel', front: 'fundingModel' }, //null,
  { back: 'ccof_public_sector_employer', front: 'publicSector' }, //null,
  // Unlock Details
  { back: 'ccof_unlock_ccof', front: 'unlockBaseFunding' }, //null,
  { back: 'ccof_unlock_ecewe', front: 'unlockEcewe' }, //null,
  { back: 'ccof_unlock_licenseupload', front: 'unlockLicenseUpload' }, //1,
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' }, //1,
  { back: 'ccof_unlock_supportingdocument', front: 'unlockSupportingDocuments' }, //null,
  // Form Complete details
  { back: 'ccof_ecewe_eligibility_complete', front: 'isEceweComplete' }, //true,
  { back: 'ccof_licensecomplete', front: 'isLicenseUploadComplete' }, //true,
  // Status codes
  { back: 'ccof_ccofstatus', front: 'ccofStatus' }, //1,
  { back: 'statuscode', front: 'applicationStatus' }, //3,
];

const ApplicationSummaryCcfriMappings = [
  ...CCFRIFacilityMappings,
  { back: 'ccof_applicationccfriid', front: 'ccfriId' }, // null,
  { back: 'ccof_unlock_ccfri', front: 'unlockCcfri' }, // null,
  { back: 'ccof_has_nmf', front: 'hasNmf' }, // false,
  { back: 'ccof_unlock_nmf_rfi', front: 'unlockNmf' }, // null,
  { back: 'ccof_nmf_formcomplete', front: 'isNmfComplete' }, // false,
  { back: 'ccof_has_rfi', front: 'hasRfi' }, // false,
  { back: 'ccof_unlock_rfi', front: 'unlockRfi' }, // null,
  { back: 'ccof_rfi_formcomplete', front: 'isRfiComplete' }, // false,
];

const CCFRIApprovableFeeSchedulesMappings = [
  { back: 'ccof_approvable_fee_scheduleid', front: 'approvableFeeScheduleId' },
  { back: '_ccof_program_year_value', front: 'programYearId' },
  { back: '_ccof_applicationccfri_value', front: 'ccfriId' },
  { back: 'ccof_frequency', front: 'feeFrequency' },
  { back: '_ccof_category_value', front: 'childCareCategoryId' },
  { back: 'ccof_apr', front: 'approvedFeeApr' },
  { back: 'ccof_may', front: 'approvedFeeMay' },
  { back: 'ccof_jun', front: 'approvedFeeJun' },
  { back: 'ccof_jul', front: 'approvedFeeJul' },
  { back: 'ccof_aug', front: 'approvedFeeAug' },
  { back: 'ccof_sep', front: 'approvedFeeSep' },
  { back: 'ccof_oct', front: 'approvedFeeOct' },
  { back: 'ccof_nov', front: 'approvedFeeNov' },
  { back: 'ccof_dec', front: 'approvedFeeDec' },
  { back: 'ccof_jan', front: 'approvedFeeJan' },
  { back: 'ccof_feb', front: 'approvedFeeFeb' },
  { back: 'ccof_mar', front: 'approvedFeeMar' },
];

const PdfDocumentMappings = [
  { back: 'annotationid', front: 'annotationId' },
  { back: 'filename', front: 'fileName' },
  { back: 'type', front: 'type' },
  { back: 'submissiondate', front: 'submissionDate' },
  { back: 'fiscalyear', front: 'fiscalYear' },
  { back: 'id', front: 'appId' },
  { back: 'filesize', front: 'fileSize' },
];

const FundingAgreementMappings = [
  { back: 'ccof_version', front: 'fundingAgreementOrderNumber' }, // null,
  { back: 'ccof_name', front: 'fundingAgreementNumber' }, // null,
  { back: '_ccof_programyear_value', front: 'programYearId' },
  { back: 'ccof_end_date', front: 'endDate' },
  { back: '_ccof_programyear_value@OData.Community.Display.V1.FormattedValue', front: 'fundingAgreementTerm' },
  { back: 'statuscode@OData.Community.Display.V1.FormattedValue', front: 'internalStatus' },
  { back: 'ccof_external_portal_status@OData.Community.Display.V1.FormattedValue', front: 'externalStatus' },
  { back: 'ccof_start_date', front: 'fundingAgreementStartDate' },
  { back: 'ccof_funding_agreementid', front: 'fundingAgreementId' },
  { back: '_ccof_organization_value', front: 'organizationId' },
];

const DocumentsMappings = [
  { back: 'annotationid', front: 'annotationId' },
  { back: 'filesize', front: 'fileSize' },
  { back: 'filename', front: 'fileName' },
  { back: 'documentbody', front: 'documentBody' },
  { back: 'notetext', front: 'description' },
  { back: 'subject', front: 'documentType' },
];

const ContactMappings = [
  { back: 'contactid', front: 'contactId' },
  { back: 'ccof_username', front: 'bceid' },
  { back: 'emailaddress1', front: 'email' },
  { back: 'firstname', front: 'firstName' },
  { back: 'lastname', front: 'lastName' },
  { back: 'telephone1', front: 'telephone' },
];

const ApplicationDocumentsMappings = [
  ...DocumentsMappings,
  { back: 'ApplicationFacilityDocument.ccof_facility', front: 'facilityId' },
  { back: 'ApplicationFacilityDocument.ccof_facility@OData.Community.Display.V1.FormattedValue', front: 'facilityName' },
];

const EnrolmentReportSummaryMappings = [
  { back: 'ccof_monthlyenrollmentreportid', front: 'enrolmentReportId' },
  { back: '_ccof_organization_value', front: 'organizationId' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: '_ccof_programyear_value', front: 'programYearId' },
  { back: 'ccof_month', front: 'month' },
  { back: 'ccof_year', front: 'year' },
  { back: 'ccof_submissiondeadline', front: 'submissionDeadline' },
  { back: 'ccof_reportversion', front: 'reportVersion' },
  { back: 'ccof_ccof_external_status', front: 'externalCcofStatusCode' },
  { back: 'ccof_ccof_external_status@OData.Community.Display.V1.FormattedValue', front: 'externalCcofStatusText' },
  { back: 'ccof_ccfri_external_status', front: 'externalCcfriStatusCode' },
  { back: 'ccof_ccfri_external_status@OData.Community.Display.V1.FormattedValue', front: 'externalCcfriStatusText' },
];

const EnrolmentReportExtensionMappings = [
  { back: 'ccof_approvedparentfee0to18', front: 'approvedParentFees0To18' },
  { back: 'ccof_approvedparentfee18to36', front: 'approvedParentFees18To36' },
  { back: 'ccof_approvedparentfee3yk', front: 'approvedParentFees3YK' },
  { back: 'ccof_approvedparentfeeoosck', front: 'approvedParentFeesOOSCK' },
  { back: 'ccof_approvedparentfeeooscg', front: 'approvedParentFeesOOSCG' },
  { back: 'ccof_approvedparentfeepre', front: 'approvedParentFeesPre' },
  { back: 'ccof_approvedparentfeefrequency0to18', front: 'approvedParentFeesFrequency0To18' },
  { back: 'ccof_approvedparentfeefrequency18to36', front: 'approvedParentFeesFrequency18To36' },
  { back: 'ccof_approvedparentfeefrequency3yk', front: 'approvedParentFeesFrequency3YK' },
  { back: 'ccof_approvedparentfeefrequencyoosck', front: 'approvedParentFeesFrequencyOOSCK' },
  { back: 'ccof_approvedparentfeefrequencyooscg', front: 'approvedParentFeesFrequencyOOSCG' },
  { back: 'ccof_approvedparentfeefrequencypre', front: 'approvedParentFeesFrequencyPre' },
];

const EnrolmentReportMappings = [
  ...EnrolmentReportSummaryMappings,
  ...EnrolmentReportExtensionMappings,
  { back: 'ccof_providertype', front: 'organizationProviderType' },
  { back: 'ccof_totalenrolled0to18', front: 'totalEnrolled0To18' },
  { back: 'ccof_totalenrolled18to36', front: 'totalEnrolled18To36' },
  { back: 'ccof_totalenrolled3yk', front: 'totalEnrolled3YK' },
  { back: 'ccof_totalenrolledoosck', front: 'totalEnrolledOOSCK' },
  { back: 'ccof_totalenrolledooscg', front: 'totalEnrolledOOSCG' },
  { back: 'ccof_totalenrolledpre', front: 'totalEnrolledPre' },
  { back: 'ccof_currenttotalless0to18', front: 'currentTotalLess0To18' },
  { back: 'ccof_currenttotalover0to18', front: 'currentTotalOver0To18' },
  { back: 'ccof_currenttotalless18to36', front: 'currentTotalLess18To36' },
  { back: 'ccof_currenttotalover18to36', front: 'currentTotalOver18To36' },
  { back: 'ccof_currenttotalless3yk', front: 'currentTotalLess3YK' },
  { back: 'ccof_currenttotalover3yk', front: 'currentTotalOver3YK' },
  { back: 'ccof_currenttotallessooscg', front: 'currentTotalLessOOSCG' },
  { back: 'ccof_currenttotaloverooscg', front: 'currentTotalOverOOSCG' },
  { back: 'ccof_currenttotallessoosck', front: 'currentTotalLessOOSCK' },
  { back: 'ccof_currenttotaloveroosck', front: 'currentTotalOverOOSCK' },
  { back: 'ccof_currenttotallesspre', front: 'currentTotalLessPre' },
  { back: 'ccof_ccofbaseamountless0to18', front: 'ccofBaseAmountLess0To18' },
  { back: 'ccof_ccofbaseamountover0to18', front: 'ccofBaseAmountOver0To18' },
  { back: 'ccof_ccofbaseamountless18to36', front: 'ccofBaseAmountLess18To36' },
  { back: 'ccof_ccofbaseamountover18to36', front: 'ccofBaseAmountOver18To36' },
  { back: 'ccof_ccofbaseamountless3yk', front: 'ccofBaseAmountLess3YK' },
  { back: 'ccof_ccofbaseamountover3yk', front: 'ccofBaseAmountOver3YK' },
  { back: 'ccof_ccofbaseamountlessooscg', front: 'ccofBaseAmountLessOOSCG' },
  { back: 'ccof_ccofbaseamountoverooscg', front: 'ccofBaseAmountOverOOSCG' },
  { back: 'ccof_ccofbaseamountlessoosck', front: 'ccofBaseAmountLessOOSCK' },
  { back: 'ccof_ccofbaseamountoveroosck', front: 'ccofBaseAmountOverOOSCK' },
  { back: 'ccof_ccofbaseamountlesspre', front: 'ccofBaseAmountLessPre' },
  { back: 'ccof_ccfriamountless0to18', front: 'ccfriAmountLess0To18' },
  { back: 'ccof_ccfriamountover0to18', front: 'ccfriAmountOver0To18' },
  { back: 'ccof_ccfriamountless18to36', front: 'ccfriAmountLess18To36' },
  { back: 'ccof_ccfriamountover18to36', front: 'ccfriAmountOver18To36' },
  { back: 'ccof_ccfriamountless3yk', front: 'ccfriAmountLess3YK' },
  { back: 'ccof_ccfriamountover3yk', front: 'ccfriAmountOver3YK' },
  { back: 'ccof_ccfriamountlessooscg', front: 'ccfriAmountLessOOSCG' },
  { back: 'ccof_ccfriamountoverooscg', front: 'ccfriAmountOverOOSCG' },
  { back: 'ccof_ccfriamountlessoosck', front: 'ccfriAmountLessOOSCK' },
  { back: 'ccof_ccfriamountoveroosck', front: 'ccfriAmountOverOOSCK' },
  { back: 'ccof_ccfriamountlesspre', front: 'ccfriAmountLessPre' },
  { back: 'ccof_ccfriprovideramountless0to18', front: 'ccfriProviderAmountLess0To18' },
  { back: 'ccof_ccfriprovideramountover0to18', front: 'ccfriProviderAmountOver0To18' },
  { back: 'ccof_ccfriprovideramountless18to36', front: 'ccfriProviderAmountLess18To36' },
  { back: 'ccof_ccfriprovideramountover18to36', front: 'ccfriProviderAmountOver18To36' },
  { back: 'ccof_ccfriprovideramountless3yk', front: 'ccfriProviderAmountLess3YK' },
  { back: 'ccof_ccfriprovideramountover3yk', front: 'ccfriProviderAmountOver3YK' },
  { back: 'ccof_ccfriprovideramountlessooscg', front: 'ccfriProviderAmountLessOOSCG' },
  { back: 'ccof_ccfriprovideramountoverooscg', front: 'ccfriProviderAmountOverOOSCG' },
  { back: 'ccof_ccfriprovideramountlessoosck', front: 'ccfriProviderAmountLessOOSCK' },
  { back: 'ccof_ccfriprovideramountoveroosck', front: 'ccfriProviderAmountOverOOSCK' },
  { back: 'ccof_ccfriprovideramountlesspre', front: 'ccfriProviderAmountLessPre' },
  { back: 'ccof_grandtotalbase', front: 'grandTotalBase' },
  { back: 'ccof_grandtotalccfri', front: 'grandTotalCcfri' },
  { back: 'ccof_grandtotalccfriprovider', front: 'grandTotalCcfriProvider' },
];

const DailyEnrolmentMappings = [
  { back: 'ccof_dailyenrollmentid', front: 'dailyEnrolmentId' },
  { back: '_ccof_monthlyenrollmentreport_value', front: 'enrolmentReportId' },
  { back: 'ccof_day', front: 'day' },
  { back: 'ccof_daytype', front: 'dayType' },
  { back: 'ccof_daytype@OData.Community.Display.V1.FormattedValue', front: 'dayTypeName' },
  { back: 'ccof_less0to18', front: 'less0To18' },
  { back: 'ccof_over0to18', front: 'over0To18' },
  { back: 'ccof_less18to36', front: 'less18To36' },
  { back: 'ccof_over18to36', front: 'over18To36' },
  { back: 'ccof_less3yk', front: 'less3YK' },
  { back: 'ccof_over3yk', front: 'over3YK' },
  { back: 'ccof_lessooscg', front: 'lessOOSCG' },
  { back: 'ccof_overooscg', front: 'overOOSCG' },
  { back: 'ccof_lessoosck', front: 'lessOOSCK' },
  { back: 'ccof_overoosck', front: 'overOOSCK' },
  { back: 'ccof_lesspre', front: 'lessPre' },
];

const LicenceMappings = [
  { back: 'ccof_licenseid', front: 'licenceId' },
  { back: 'ccof_name', front: 'licenceNumber' },
  { back: 'ccof_organization', front: 'ccofOrganization' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_start_date', front: 'licenceStartDate' },
  { back: 'ccof_end_date', front: 'licenceEndDate' },
  { back: 'ccof_service_delivery_details_license_ccof_license', front: 'serviceDeliveryDetails' },
];

const ServiceDeliveryMappings = [
  { back: 'ccof_license_categories@OData.Community.Display.V1.FormattedValue', front: 'licenseCategory' },
  { back: 'ccof_max_weeks_per_year', front: 'maxweeksPerYear' },
  { back: 'ccof_max_days_per_week', front: 'maxdaysPerWeek' },
  { back: 'ccof_overnight_care', front: 'overnightCare' },
  { back: 'ccof_care_type@OData.Community.Display.V1.FormattedValue', front: 'capacityByCareType' },
  { back: 'ccof_extended_hours_offered', front: 'extendedHours' },

  { back: 'ccof_start_date', front: 'licenceStartDate' },
  { back: 'ccof_end_date', front: 'licenceEndDate' },
  { back: 'ccof_max_capacity', front: 'maximumCapacity' },
  { back: 'ccof_licenced_spaces', front: 'licencedSpaces' },
  { back: 'ccof_hours_of_operation_start', front: 'facilityHoursFrom' },
  { back: 'ccof_hours_of_operation_end', front: 'facilityHoursTo' },

  { back: 'ccof_max_4_or_less', front: 'maxfourorLess' },
  { back: 'ccof_max_over_4', front: 'maxoverFour' },

  { back: 'ccof_number_of_preschool_sessions', front: 'preschoolSessions' },
  { back: 'ccof_school_age_on_school_grounds', front: 'schoolAgeOnSchoolGrounds' },
  { back: 'ccof_recreational_care', front: 'recreationalCare' },
  { back: 'ccof_before_school', front: 'beforeSchoolCare' },
  { back: 'ccof_after_school', front: 'afterSchoolCare' },
  { back: 'ccof_morning_kindercare', front: 'morningKinderCare' },
  { back: 'ccof_afternoon_kindercare', front: 'afterKinderCare' },
  { back: 'ccof_accepts_subsidy', front: 'acceptsSubsidy' },
];

module.exports = {
  ApplicationDocumentsMappings,
  DailyEnrolmentMappings,
  DocumentsMappings,
  ContactMappings,
  OrganizationMappings,
  FacilityMappings,
  CCOFApplicationMappings,
  CCOFApplicationFundingMapping,
  ECEWEApplicationMappings,
  ECEWEFacilityMappings,
  EnrolmentReportExtensionMappings,
  EnrolmentReportMappings,
  EnrolmentReportSummaryMappings,
  UserProfileFacilityMappings,
  UserProfileBaseFundingMappings,
  UserProfileOrganizationMappings,
  UserProfileApplicationMappings,
  UserProfileCCFRIMappings,
  UserProfileBaseCCFRIMappings,
  UserProfileECEWEMappings,
  ProgramYearMappings,
  MessageMappings,
  CCFRIApprovableFeeSchedulesMappings,
  CCFRIFacilityMappings,
  OrganizationFacilityMappings,
  ClosureMappings,
  RFIApplicationMappings,
  DeclarationMappings,
  ServiceExpansionDetailsMappings,
  DCSWageIncreaseMappings,
  ExpenseInformationMappings,
  OtherFundingProgramMappings,
  NMFApplicationMappings,
  IndigenousExpenseMappings,
  SystemMessagesMappings,
  ApplicationSummaryMappings,
  ApplicationSummaryCcfriMappings,
  UserProfileChangeRequestNewFacilityMappings,
  PdfDocumentMappings,
  FundingAgreementMappings,
  LicenceMappings,
  ServiceDeliveryMappings,
};
