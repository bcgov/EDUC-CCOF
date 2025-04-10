import { isEmpty } from 'lodash';

import ApplicationService from '@/services/applicationService';
import { hasEmptyFields } from '@/utils/common.js';

export default {
  isMTFIComplete(mtfiFacilities) {
    return mtfiFacilities?.every((facility) => this.isMTFIFacilityComplete(facility));
  },
  isMTFIFacilityComplete(facility) {
    if (isEmpty(facility)) return false;
    const requiredFields = [
      'feeFrequency',
      'approvedFeeApr',
      'approvedFeeMay',
      'approvedFeeJun',
      'approvedFeeJul',
      'approvedFeeAug',
      'approvedFeeSep',
      'approvedFeeOct',
      'approvedFeeNov',
      'approvedFeeDec',
      'approvedFeeJan',
      'approvedFeeFeb',
      'approvedFeeMar',
    ];
    const isChildCareTypesComplete = facility.newCcfri?.childCareTypes?.every(
      (ccType) => !hasEmptyFields(ccType, requiredFields),
    );
    const isParentFeesComplete =
      facility.newCcfri?.childCareTypes?.length === facility.oldCcfri?.childCareTypes?.length &&
      isChildCareTypesComplete;
    const isRFIComplete = !facility?.hasRfi || ApplicationService.isRFIComplete(facility.rfiApp, false);
    const isAFSComplete =
      !facility?.enableAfs || ApplicationService.isAFSComplete(facility.afs, facility.uploadedDocuments);
    return isParentFeesComplete && isRFIComplete && isAFSComplete;
  },
};
