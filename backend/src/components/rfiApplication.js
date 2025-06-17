'use strict';
const { sleep, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const {
  RFIApplicationMappings,
  ServiceExpansionDetailsMappings,
  DCSWageIncreaseMappings,
  ExpenseInformationMappings,
  OtherFundingProgramMappings,
  IndigenousExpenseMappings,
} = require('../util/mapping/Mappings');

async function deleteChildTable(rfipfiid, entityName, selectorName, filterName) {
  if (!filterName) {
    filterName = '_ccof_rfiparentfeeincrease_value';
  }
  //entityName = ccof_rfi_pfi_other_fundings
  //selectorName = ccof_rfi_pfi_other_fundingid
  const query = `${entityName}?$select=${selectorName}&$filter=(${filterName} eq ${rfipfiid})`;
  try {
    const resp = await getOperation(query);
    resp.value?.forEach(async (el) => {
      await deleteOperationWithObjectId(entityName, el[selectorName]);
      await sleep(100);
    });
  } catch (e) {
    log.error(`error while trying to delete child table [${entityName}]`, e);
    throw e;
  }
}

//CCFRI-3850 - timing issue with getting Median fees attached to CCFRI ID. Add in some sleeper code to retry if median fees return blank.
//ideally, this should only take 2-4 seconds but dynamics is slow.
//CCFRI's should always have a median attached, so if no median is found, throw an error.
async function getRFIMedian(req, res) {
  try {
    const MAX_RETRIES = 4;
    const SLEEP_DURATION = 5000; // in ms
    const operation = `ccof_applicationccfris?$select=_ccof_region3pctmedian_value,_ccof_region_value&$expand=ccof_Region3PctMedian($select=ccof_3percentageof0to18,ccof_3percentageof18to36,ccof_3percentageof3ytok,ccof_3percentageofoosctok,ccof_3percentageofoosctog,ccof_3percentageofpre,ccof_0to18months,ccof_18to36months,ccof_3yearstokindergarten,ccof_outofschoolcarekindergarten,ccof_outofschoolcaregrade1,ccof_preschool),ccof_Region($select=ccof_name,ccof_regionnumber)&$filter=(ccof_applicationccfriid eq ${req.params.ccfriId}) and (ccof_Region3PctMedian/ccof_median_fee_sdaid ne null) and (ccof_Region/ccof_fee_regionid ne null)`;

    let rfiMedian = (await getOperation(operation)).value;
    let retryCount = 0;
    const medians = {};

    while (rfiMedian?.length === 0 && retryCount < MAX_RETRIES) {
      log.info(`No median found. Retrying in ${SLEEP_DURATION}ms (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      await sleep(SLEEP_DURATION);
      rfiMedian = (await getOperation(operation)).value;
      retryCount++;
    }
    if (rfiMedian?.length === 0) {
      log.error('Median fees not found after retrying.');
      throw new Error('Median fees not found');
    }
    if (rfiMedian?.length > 0) {
      medians['0 to 18 months'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageof0to18;
      medians['18 to 36 months'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageof18to36;
      medians['3 Years to Kindergarten'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageof3ytok;
      medians['Out of School Care - Kindergarten'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageofoosctok;
      medians['Out of School Care - Grade 1+'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageofoosctog;
      medians['Preschool'] = rfiMedian[0].ccof_Region3PctMedian?.ccof_3percentageofpre;
    } else if (rfiMedian?.length > 1) {
      log.error('Expected 1 set of RFI Medians got more: ', rfiMedian);
    }

    return res.status(HttpStatus.OK).json(medians);
  } catch (e) {
    log.error('An error occurred while getting getRFIMedian', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function formatDate(data, columnName) {
  if (data[columnName]) {
    data[columnName] = data[columnName].split('T')[0];
  }
  return data;
}

async function deleteRfiApplication(req, res) {
  let query = `ccof_rfipfis?$filter=(_ccof_applicationccfri_value eq ${req.params.ccfriId} and statuscode eq 1)`;

  try {
    const response = await getOperation(query);

    //there should only every be one RFI application per ccfri app.
    //if array empty - don't try to delete anything.
    if (response?.value?.length > 0) {
      await deleteOperationWithObjectId('ccof_rfipfis', response.value[0].ccof_rfipfiid);
    }

    return res.status(HttpStatus.OK).json({});
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getRfiApplicationByCcfriId(ccfriId) {
  const query = `ccof_rfipfis?$filter=(_ccof_applicationccfri_value eq ${ccfriId} and statuscode eq 1)&$expand=ccof_ccof_rfipfi_ccof_rfi_pfi_fee_history_deta($select=ccof_feeafterincrease),ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi,ccof_rfi_pfi_other_funding_RFI_PFI, ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail,ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi,ccof_rfipfi_ccof_rfipfi_IndegenousService`;
  const response = await getOperation(query);

  if (response.value.length > 0) {
    let rfiApplication = new MappableObjectForFront(response.value[0], RFIApplicationMappings);
    rfiApplication.data['expansionList'] = response.value[0].ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi?.map((el) =>
      formatDate(new MappableObjectForFront(el, ServiceExpansionDetailsMappings).data, 'date'),
    );
    rfiApplication.data['wageList'] = response.value[0].ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail?.map((el) => formatDate(new MappableObjectForFront(el, DCSWageIncreaseMappings).data, 'wageDate'));
    rfiApplication.data['expenseList'] = response.value[0].ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi?.map((el) =>
      formatDate(new MappableObjectForFront(el, ExpenseInformationMappings).data, 'date'),
    );
    rfiApplication.data['fundingList'] = response.value[0].ccof_rfi_pfi_other_funding_RFI_PFI?.map((el) => formatDate(new MappableObjectForFront(el, OtherFundingProgramMappings).data, 'date'));
    rfiApplication.data['indigenousExpenseList'] = response.value[0].ccof_rfipfi_ccof_rfipfi_IndegenousService?.map((el) =>
      formatDate(new MappableObjectForFront(el, IndigenousExpenseMappings).data, 'date'),
    );

    return rfiApplication;
  } else {
    return {};
  }
}

async function getRFIApplication(req, res) {
  try {
    const rfiApplication = await getRfiApplicationByCcfriId(req.params.ccfriId);
    return res.status(HttpStatus.OK).json(rfiApplication);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

//jb-oct '24 - removing this because it breaks dynamics, but we may need to put back in at some point if we get the 1 day ahead bug again
// eslint-disable-next-line no-unused-vars
function formatTimeForBack(timeString) {
  return timeString + 'T12:00:00-07:00';
}

async function updateRFIApplication(req, res) {
  try {
    const friApplication = new MappableObjectForBack(req.body, RFIApplicationMappings).toJSON();
    const rfipfiid = req.params.rfipfiid;
    delete friApplication._ccof_applicationccfri_value;
    delete friApplication.ccof_rfipfiid;
    delete friApplication.ccof_name;

    let friApplicationResponse = await patchOperationWithObjectId('ccof_rfipfis', rfipfiid, friApplication);
    friApplicationResponse = new MappableObjectForFront(friApplicationResponse, RFIApplicationMappings);
    const isRfiComplete = req.body.isRfiComplete;
    const ccfriId = req.body.ccfriApplicationId;
    if (isRfiComplete != null) {
      await patchOperationWithObjectId('ccof_applicationccfris', ccfriId, {
        ccof_has_rfi: true,
        ccof_rfi_formcomplete: isRfiComplete,
      });
    }

    //update funding
    if (req.body.fundingList) {
      await deleteChildTable(rfipfiid, 'ccof_rfi_pfi_other_fundings', 'ccof_rfi_pfi_other_fundingid');
      const fundingListPayload = req.body.fundingList?.map((el) => new MappableObjectForBack(el, OtherFundingProgramMappings).data);

      fundingListPayload?.forEach(async (payload) => {
        // payload.ccof_applicationdate = formatTimeForBack(payload.ccof_applicationdate);
        payload['ccof_RFIParentFeeIncrease@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
        await postOperation('ccof_rfi_pfi_other_fundings', payload);
        await sleep(100);
      });
    }

    //update wageList
    if (req.body.wageList) {
      await deleteChildTable(rfipfiid, 'ccof_rfi_pfi_dcs_wi_details', 'ccof_rfi_pfi_dcs_wi_detailid');
      const wageListPayload = req.body.wageList?.map((el) => new MappableObjectForBack(el, DCSWageIncreaseMappings).data);

      wageListPayload?.forEach(async (payload) => {
        //payload.ccof_wageincreasedate = formatTimeForBack(payload.ccof_wageincreasedate);
        payload['ccof_RFIParentFeeIncrease@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
        await postOperation('ccof_rfi_pfi_dcs_wi_details', payload);
        await sleep(100);
      });
    }

    //update expansion details
    if (req.body.expansionList) {
      await deleteChildTable(rfipfiid, 'ccof_rfipfiserviceexpansiondetails', 'ccof_rfipfiserviceexpansiondetailid', '_ccof_rfipfi_value');
      const expansionListPayload = req.body.expansionList?.map((el) => new MappableObjectForBack(el, ServiceExpansionDetailsMappings).data);

      expansionListPayload?.forEach(async (payload) => {
        // payload.ccof_dateofchange = formatTimeForBack(
        //   payload.ccof_dateofchange
        // );
        payload['ccof_rfipfi@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
        await postOperation('ccof_rfipfiserviceexpansiondetails', payload);
        await sleep(100);
      });
    }

    //update expense details
    if (req.body.expenseList) {
      await deleteChildTable(rfipfiid, 'ccof_rfipfiexpenseinfos', 'ccof_rfipfiexpenseinfoid', '_ccof_rfipfi_value');
      const expenseListPayload = req.body.expenseList?.map((el) => new MappableObjectForBack(el, ExpenseInformationMappings).data);

      expenseListPayload?.forEach(async (payload) => {
        // payload.ccof_dateofexpense = formatTimeForBack(
        //   payload.ccof_dateofexpense
        // );

        payload['ccof_rfipfi@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
        await postOperation('ccof_rfipfiexpenseinfos', payload);
        await sleep(100);
      });
    }

    //rfipfiid, entityName, selectorName, filterName) {
    //update indigenous Expense details
    if (req.body.indigenousExpenseList) {
      await deleteChildTable(rfipfiid, 'ccof_rfipfiserviceexpansionindigenouscommunities', 'ccof_rfipfiserviceexpansionindigenouscommunityid', '_ccof_rfipfi_indegenousserviceexpansion_value');
      const indigenousExpensePayload = req.body.indigenousExpenseList?.map((el) => new MappableObjectForBack(el, IndigenousExpenseMappings).data);
      indigenousExpensePayload?.forEach(async (payload) => {
        // payload.ccof_date = formatTimeForBack(payload.ccof_date);
        payload['ccof_rfipfi_IndegenousServiceExpansion@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
        await postOperation('ccof_rfipfiserviceexpansionindigenouscommunities', payload);
        await sleep(100);
      });
    }

    return res.status(HttpStatus.OK).json(friApplicationResponse);
  } catch (e) {
    log.error('updateRFIApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function createRFIApplication(req, res) {
  try {
    const friApplication = new MappableObjectForBack(req.body, RFIApplicationMappings).toJSON();
    delete friApplication._ccof_applicationccfri_value;
    delete friApplication.ccof_rfipfiid;

    friApplication['ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi'] = req.body.expansionList?.map((el) => new MappableObjectForBack(el, ServiceExpansionDetailsMappings).data);
    // friApplication[
    //   "ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi"
    // ]?.forEach(
    //   (item) =>
    //     (item.ccof_dateofchange = formatTimeForBack(item.ccof_dateofchange))
    // );
    friApplication['ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail'] = req.body.wageList?.map((el) => new MappableObjectForBack(el, DCSWageIncreaseMappings).data);
    // friApplication["ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail"]?.forEach(
    //   (item) =>
    //     (item.ccof_wageincreasedate = formatTimeForBack(
    //       item.ccof_wageincreasedate
    //     ))
    // );
    friApplication['ccof_rfi_pfi_other_funding_RFI_PFI'] = req.body.fundingList?.map((el) => new MappableObjectForBack(el, OtherFundingProgramMappings).data);
    // friApplication["ccof_rfi_pfi_other_funding_RFI_PFI"]?.forEach(
    //   (item) =>
    //     (item.ccof_applicationdate = formatTimeForBack(
    //       item.ccof_applicationdate
    //     ))
    // );
    friApplication['ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi'] = req.body.expenseList?.map((el) => new MappableObjectForBack(el, ExpenseInformationMappings).data);
    // friApplication["ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi"]?.forEach(
    //   (item) =>
    //     (item.ccof_dateofexpense = formatTimeForBack(item.ccof_dateofexpense))
    // );
    friApplication['ccof_rfipfi_ccof_rfipfi_IndegenousService'] = req.body.indigenousExpenseList?.map((el) => new MappableObjectForBack(el, IndigenousExpenseMappings).data);
    // friApplication["ccof_rfipfi_ccof_rfipfi_IndegenousService"]?.forEach(
    //   (item) => (item.ccof_date = formatTimeForBack(item.ccof_date))
    // );

    friApplication['ccof_ApplicationCCFRI@odata.bind'] = `/ccof_applicationccfris(${req.params.ccfriId})`;

    const friApplicationGuid = await postOperation('ccof_rfipfis', friApplication);

    //set a flag in ccof_applicationccfri that an RFI exists for this application
    await patchOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId, { ccof_has_rfi: true, ccof_rfi_formcomplete: req.body.isRfiComplete });
    return res.status(HttpStatus.CREATED).json({ friApplicationGuid: friApplicationGuid });
  } catch (e) {
    log.error('createRFIApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  getRFIApplication,
  createRFIApplication,
  updateRFIApplication,
  getRFIMedian,
  deleteRfiApplication,
  getRfiApplicationByCcfriId,
};
