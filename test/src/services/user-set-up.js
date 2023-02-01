const restUtils = require('../utils/rest-utils');
const log = require('npmlog');

const userSetUp = {
  async deleteUserOrganizationSetup(userid) {
    log.info('userid', userid);
    let userResponse = await restUtils.getOperation(`contacts?$select=contactid&$filter=(ccof_username eq '${userid}')`);
    log.info('userResponse', userResponse);
    if (!arrayIsEmpty(userResponse.value) && userResponse.value[0].contactid) {
      const ccofOrganizationResponse = await restUtils.getOperation(`ccof_bceid_organizations?$select=ccof_bceid_organizationid&$filter=(_ccof_businessbceid_value eq ${userResponse.value[0].contactid})`);
      log.info('ccofOrganizationResponse', ccofOrganizationResponse);
      if (!arrayIsEmpty(ccofOrganizationResponse.value) && ccofOrganizationResponse.value[0].ccof_bceid_organizationid) {
        await restUtils.deleteOperationWithObjectId('ccof_bceid_organizations', ccofOrganizationResponse.value[0].ccof_bceid_organizationid);
      }
    }
  },
  async deleteOrganization(orgName){
    const organizationResponse = await restUtils.getOperation(`accounts?$select=accountid&$filter=(name eq '${orgName}')`);
    log.info('organizationResponse', organizationResponse);
    if (!arrayIsEmpty(organizationResponse.value) && organizationResponse.value[0].accountid) {
      await restUtils.deleteOperationWithObjectId('accounts', organizationResponse.value[0].accountid);
    }
  }
};

function arrayIsEmpty(array) {
  //If it's not an array, return FALSE.
  if (!Array.isArray(array)) {
    return FALSE;
  }
  //If it is an array, check its length property
  if (array.length == 0) {
    //Return TRUE if the array is empty
    return true;
  }
  //Otherwise, return FALSE.
  return false;
}
module.exports = userSetUp;
