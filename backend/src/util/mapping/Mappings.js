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

module.exports = {
  OrganizationMappings
};
