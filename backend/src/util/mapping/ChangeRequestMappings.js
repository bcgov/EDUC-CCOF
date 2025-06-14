const UserProfileChangeRequestMappings = [
  { back: 'ccof_name', front: 'name' },
  { back: 'statuscode', front: 'status' },
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' },
  { back: 'ccof_change_requestid', front: 'changeRequestId' },
  { back: 'ccof_licensecomplete', front: 'isLicenseUploadComplete' },
  { back: 'ccof_ecewe_eligibility_complete', front: 'isEceweComplete' },
  { back: 'ccof_externalstatus', front: 'externalStatus' }, // 2,
];

const ChangeRequestMappings = [
  { back: '_ccof_program_year_value', front: 'programYearId' },
  { back: 'ccof_provider_type', front: 'providerType' },
  { back: '_ccof_application_value', front: 'applicationId' },
  { back: 'ccof_change_action_change_request ', front: 'ccof_change_action_change_request' },
  { back: 'createdon', front: 'createdOnDate' },
  { back: 'ccof_firstsubmissiondate', front: 'firstSubmissionDate' },
  { back: 'ccof_latestsubmissiondate', front: 'latestSubmissionDate' },
  { back: 'ccof_change_action_change_request', front: 'changeActions' },
  { back: 'ccof_organization_contact_name', front: 'orgContactName' },
  { back: 'ccof_consent', front: 'agreeConsentCertify' },
  { back: 'ccof_ecewe_optin', front: 'optInECEWE' },
  { back: 'ccof_ecewe_employeesunion', front: 'belongsToUnion' },
  { back: 'ccof_ecewe_selecttheapplicablesector', front: 'applicableSector' },
  { back: 'ccof_ecewe_selecttheapplicablefundingmode', front: 'fundingModel' },
  { back: 'ccof_ecewe_confirmation', front: 'confirmation' },
  { back: 'ccof_declaration', front: 'enabledDeclarationB' },
  { back: 'ccof_indicator_unlock', front: 'isChangeRequestUnlocked' },
  { back: 'ccof_public_sector_employer', front: 'publicSector' },
  { back: 'ccof_union_agreement_reached', front: 'isUnionAgreementReached' },
  { back: 'ccof_describe_your_org', front: 'describeOrgCSSEA' },

  ...UserProfileChangeRequestMappings,
];

const ChangeActionRequestMappings = [
  { back: 'statuscode', front: 'status' },
  { back: 'ccof_change_actionid', front: 'changeActionId' },
  { back: 'ccof_changetype', front: 'changeType' },
  { back: '_ccof_change_request_value', front: 'changeRequestId' },
  { back: 'createdon', front: 'createdOn' },
];

const ChangeActionClosureMappings = [
  { back: '_ccof_closure_value', front: 'closureId' },
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: '_ccof_program_year_value', front: 'programYearId' },
  { back: 'ccof_closure_start_date', front: 'startDate' },
  { back: 'ccof_closure_end_date', front: 'endDate' },
  { back: 'ccof_paid_closure', front: 'paidClosure' },
  { back: 'ccof_is_full_closure', front: 'fullClosure' },
  { back: 'ccof_closure_reason', front: 'closureReason' },
  { back: 'ccof_any_details_added_on_request', front: 'closureDescription' },
  { back: 'ccof_closure_type', front: 'changeType' },
  { back: 'ccof_affected_age_groups', front: 'ageGroups' },
  { back: 'statuscode', front: 'statusCode' },
];

const NewFacilityMappings = [
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: 'ccof_change_request_new_facilityid', front: 'changeRequestNewFacilityId' },
  { back: 'ccof_unlock_ccfri', front: 'unlockCcfri' },
  { back: 'ccof_unlock_nmf_rfi', front: 'unlockNmf' },
  { back: 'ccof_unlock_rfi', front: 'unlockRfi' },
];

const MtfiMappings = [
  { back: '_ccof_facility_value', front: 'facilityId' },
  { back: '_ccof_ccfri_value', front: 'ccfriApplicationId' },
  { back: 'ccof_change_request_mtfiid', front: 'changeRequestMtfiId' },
  { back: 'ccof_unlock_nmf_rfi', front: 'unlockNmf' },
  { back: 'ccof_unlock_rfi', front: 'unlockRfi' },
  { back: 'ccof_unlock_ccfri', front: 'unlockCcfri' },
  { back: 'ccof_unlock_afs', front: 'unlockAfs' },
  { back: 'ccof_unlock_afs_enable', front: 'enableAfs' },
  { back: 'ccof_facilityid_mapped', front: 'facilityAccountNumber' },
];

const ChangeRequestUnlockMapping = [
  { back: 'ccof_applicationid', front: 'applicationId' },
  { back: 'statuscode', front: 'applicationStatus' },
  { back: 'ccof_providertype', front: 'organizationProviderType' },
  { back: 'ccof_applicationtype', front: 'applicationType' },
  { back: 'ccof_licensecomplete', front: 'isLicenseUploadComplete' },
  { back: 'ccof_ecewe_eligibility_complete', front: 'isEceweComplete' },
  { back: 'ccof_unlock_declaration', front: 'unlockDeclaration' },
  { back: 'ccof_unlock_licence_upload', front: 'isLicenseUploadUnlocked' },
  { back: 'ccof_unlock_supporting_document', front: 'isSupportingDocumentsUnlocked' },
  { back: 'ccof_unlock_ccof', front: 'isCCOFUnlocked' },
  { back: 'ccof_unlock_ecewe', front: 'isEceweUnlocked' },
  { back: 'ccof_ccofstatus', front: 'ccofStatus' },
  { back: 'ccof_unlock_other_changes_document', front: 'isOtherDocumentsUnlocked' },
  { back: 'ccof_unlock_change_request', front: 'isChangeRequestUnlocked' },
];

module.exports = {
  ChangeRequestMappings,
  ChangeActionClosureMappings,
  ChangeActionRequestMappings,
  NewFacilityMappings,
  MtfiMappings,
  UserProfileChangeRequestMappings,
  ChangeRequestUnlockMapping,
};
