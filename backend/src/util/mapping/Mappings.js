const OrganizationMappings = [
  { back: 'name', front: 'legalName'},
  { back: 'address1_name', front: 'address1'}, //Address 
  { back: 'address1_city', front: 'city1'},
  { back: 'address1_postalcode', front: 'postalCode1'},
  { back: 'address2_name', front: 'address2'}, //Mailing Address       
  { back: 'address2_city', front: 'city2'},
  { back: 'address2_postalcode', front: 'postalCode2'},
  { back: 'address1_primarycontactname', front: 'contactName'},
  { back: 'ccof_position', front: 'position'},
  { back: 'telephone1', front: 'phone'},
  // { back: 'businessBCeID', front: 'businessId'},
  { back: 'emailaddress1', front: 'email'},
  { back: 'ccof_instructionnumber', front: 'incNumber'},//incorporation number    
  { back: 'ccof_typeoforganization', front: 'organizationType'},
  { back: 'ccof_typeoforganization@OData.Community.Display.V1.FormattedValue', front: 'organizationTypeDesc' },
];

const FacilityMappings = [
  { back: 'name', front: 'facilityName'},
  { back: 'ccof_facilitystartdate', front: 'yearBeginOperation'},
  { back: 'address1_line1', front: 'facilityAddress'},
  { back: 'address1_city', front: 'city'},
  { back: 'address1_postalcode', front: 'postalCode'},
  { back: 'ccof_position', front: 'position'},
  { back: 'emailaddress1', front: 'email'},
  { back: 'address1_primarycontactname', front: 'contactName'},
  { back: 'telephone1', front: 'phone'},
  { back: 'ccof_facilitylicencenumber', front: 'licenseNumber'},
  // XXXXXXXXXXXXX: 'licenseEffectiveDate',
  // XXXXXXXXXXXXX: 'hasReceivedFunding',
];

const CCOFApplicationMappings = [
  { back: 'ccof_applicationtype', front: 'applicationType' }, // 100000000 New Org
  { back: 'ccof_name', front:'name' }, // APP-22000059
  { back: 'ccof_applicationid', front: 'applicationId' }, // guid
  { back: '_ccof_organization_value', front: 'organizationId' }, //guid 
  { back: 'ccof_familychildcare', front: 'isFamiliyChildCare' }, //false,
  { back: 'ccof_inhomemultiagechildcare', front: 'isHomeMultiAgeChildCare' }, //false,
  { back: '_ccof_programyear_value', front: 'programYearId' }, //guid
  { back: 'ccof_multiagechildcare', front: 'isMultiAgeChildCare' }, //false,
  { back: 'ccof_providertype', front: 'providerTypeId' }, //100000000 Group
  { back: 'ccof_consent', front: 'hasConset' },  // 1
];

const UserProfileFacilityMappings = [
  { back: 'CCOF.ccof_facility', front: 'facilityId' },
  { back: 'CCOF.Facility.name', front: 'facilityName'},
  { back: 'CCFRI.statuscode', front: 'ccfriStatus'},
  { back: 'ECEWE.statuscode', front: 'eceweStatus'},
  { back: 'CCFRI.ccof_ccfrioptin', front: 'ccfriOptInStatus'}
];

module.exports = {
  OrganizationMappings,
  FacilityMappings,
  CCOFApplicationMappings,
  UserProfileFacilityMappings
};
