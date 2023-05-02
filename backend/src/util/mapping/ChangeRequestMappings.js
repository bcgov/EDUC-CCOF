const ChangeRequestMappings = [
  { back: '_ccof_program_year_value', front: 'programYearId'}, // "cd63f67b-bd39-ed11-9db0-002248d53d53",
  { back: 'ccof_name', front: 'name'}, // "807",
  { back: 'statuscode', front: 'status'}, // 6,
  { back: 'ccof_externalstatus', front: 'externalStatus'}, // 2,
  { back: 'ccof_provider_type', front: 'providerType'}, // 100000001, - family
  { back: 'ccof_change_requestid', front: 'changeRequestId'}, // "36866904-44d9-ed11-a7c6-000d3a09d132",
  { back: '_ccof_application_value', front: 'applicationId'}, // "d11fbf2c-e1c5-ed11-b597-000d3a09d699",
  { back: 'ccof_change_action_change_request ', front: 'ccof_change_action_change_request'}, // "d11fbf2c-e1c5-ed11-b597-000d3a09d699",
];

const ChangeActionRequestMappings = [
  { back: 'statuscode', front: 'status'}, // 6,
  { back: 'ccof_change_actionid', front: 'changeActionId'}, // 6,
  { back: 'ccof_changetype', front: 'changeType'}, // 6,
  { back: '_ccof_change_request_value', front: 'changeRequestId'}, // 6,
];

module.exports = {
  ChangeRequestMappings,
  ChangeActionRequestMappings
};
