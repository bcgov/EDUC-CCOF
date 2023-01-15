'use strict';
const { sleep, getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, minify} = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack } = require('../util/mapping/MappableObject');
const { RFIApplicationMappings, ServiceExpansionDetailsMappings, DCSWageIncreaseMappings,
  ExpenseInformationMappings, OtherFundingProgramMappings} = require('../util/mapping/Mappings');


async function deleteChildTable(rfipfiid, entityName, selectorName, filterName) {
  if (!filterName) {
    filterName = '_ccof_rfiparentfeeincrease_value';
  }
  //entityName = ccof_rfi_pfi_other_fundings
  //selectorName = ccof_rfi_pfi_other_fundingid
  const query = `${entityName}?$select=${selectorName}&$filter=(${filterName} eq ${rfipfiid})`;
  try {
    const resp = await getOperation(query);
    resp.value?.forEach(async el => {
      await deleteOperationWithObjectId(entityName, el[selectorName]);
      await sleep(100);
    });
  } catch (e) {
    log.error(`error while trying to delete child table [${entityName}]`, e);
    throw e;
  }
}

async function getRFIMedian(req, res) {
  try {
    let operation = `ccof_applicationccfris?$select=_ccof_region3pctmedian_value,_ccof_region_value&$expand=ccof_Region3PctMedian($select=ccof_3percentageof0to18,ccof_3percentageof18to36,ccof_3percentageof3ytok,ccof_3percentageofoosctok,ccof_3percentageofoosctog,ccof_3percentageofpre,ccof_0to18months,ccof_18to36months,ccof_3yearstokindergarten,ccof_outofschoolcarekindergarten,ccof_outofschoolcaregrade1,ccof_preschool),ccof_Region($select=ccof_name,ccof_regionnumber)&$filter=(ccof_applicationccfriid eq ${req.params.ccfriId}) and (ccof_Region3PctMedian/ccof_median_fee_sdaid ne null) and (ccof_Region/ccof_fee_regionid ne null)`
    let rfiMedian = await getOperation(operation);
    rfiMedian = rfiMedian.value;
    let medians = {};
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
    log.verbose('Median data: ', minify(medians));
    return res.status(HttpStatus.OK).json(medians);
  } catch (e) {
    log.error('An error occurred while getting getRFIMedian', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}



async function getRFIApplication(req, res) {
  let query  = `ccof_rfipfis?$filter=(_ccof_applicationccfri_value eq ${req.params.ccfriId} and statuscode eq 1)&$expand=ccof_ccof_rfipfi_ccof_rfi_pfi_fee_history_deta($select=ccof_feeafterincrease),ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi,ccof_rfi_pfi_other_funding_RFI_PFI, ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail,ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi`;
  try {
    const response = await getOperation(query);
    console.log('response: ', minify(response.value));
    console.log('response length: ', response.value.length);
    if (response.value.length > 0) {
      let rfiApplication = new MappableObjectForFront(response.value[0], RFIApplicationMappings);
      rfiApplication.data['expansionList'] = response.value[0].ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi?.map(el=> new MappableObjectForFront(el,ServiceExpansionDetailsMappings).data);
      rfiApplication.data['wageList'] = response.value[0].ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail?.map(el=> new MappableObjectForFront(el,DCSWageIncreaseMappings).data);
      rfiApplication.data['expenseList'] = response.value[0].ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi?.map(el=> new MappableObjectForFront(el,ExpenseInformationMappings).data);
      rfiApplication.data['fundingList'] = response.value[0].ccof_rfi_pfi_other_funding_RFI_PFI?.map(el=> new MappableObjectForFront(el,OtherFundingProgramMappings).data);
      return res.status(HttpStatus.OK).json(rfiApplication);
    } else {
      return res.status(HttpStatus.OK).json({});
    }
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}

async function updateRFIApplication(req, res) {
  try {
    const friApplication = new MappableObjectForBack(req.body, RFIApplicationMappings).toJSON();
    const rfipfiid = req.params.rfipfiid;
    delete friApplication._ccof_applicationccfri_value;
    delete friApplication.ccof_rfipfiid;
    delete friApplication.ccof_name;

    // friApplication['ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi'] = req.body.expansionList?.map(el=> new MappableObjectForBack(el,ServiceExpansionDetailsMappings).data);
    // friApplication['ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail'] = req.body.wageList?.map(el=> new MappableObjectForBack(el,DCSWageIncreaseMappings).data);
    // friApplication['ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi'] = req.body.IndigenousExpenseList?.map(el=> new MappableObjectForBack(el,IndigenousCommunityExpenseInformationMappings).data);

    let friApplicationResponse = await patchOperationWithObjectId('ccof_rfipfis', rfipfiid, friApplication);
    friApplicationResponse = new MappableObjectForFront(friApplicationResponse, RFIApplicationMappings);

    //update funding
    await deleteChildTable(rfipfiid, 'ccof_rfi_pfi_other_fundings', 'ccof_rfi_pfi_other_fundingid');
    const fundingListPayload = req.body.fundingList?.map(el=> new MappableObjectForBack(el,OtherFundingProgramMappings).data);
    log.verbose('funding payload', minify(fundingListPayload));
    fundingListPayload?.forEach(async payload => {
      payload['ccof_RFIParentFeeIncrease@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
      await postOperation('ccof_rfi_pfi_other_fundings', payload);
      await sleep(100);
    });

    //update wageList
    await deleteChildTable(rfipfiid, 'ccof_rfi_pfi_dcs_wi_details', 'ccof_rfi_pfi_dcs_wi_detailid');
    const wageListPayload = req.body.wageList?.map(el=> new MappableObjectForBack(el,DCSWageIncreaseMappings).data);
    log.verbose('wageList payload', minify(wageListPayload));
    wageListPayload?.forEach(async payload => {
      payload['ccof_RFIParentFeeIncrease@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
      await postOperation('ccof_rfi_pfi_dcs_wi_details', payload);
      await sleep(100);
    });

    //update expansion details
    await deleteChildTable(rfipfiid, 'ccof_rfipfiserviceexpansiondetails', 'ccof_rfipfiserviceexpansiondetailid', '_ccof_rfipfi_value');
    const expansionListPayload = req.body.expansionList?.map(el=> new MappableObjectForBack(el,ServiceExpansionDetailsMappings).data);
    log.verbose('expansionList payload', minify(expansionListPayload));
    expansionListPayload?.forEach(async payload => {
      payload['ccof_rfipfi@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
      await postOperation('ccof_rfipfiserviceexpansiondetails', payload);
      await sleep(100);
    });

    //update expense details
    await deleteChildTable(rfipfiid, 'ccof_rfipfiexpenseinfos', 'ccof_rfipfiexpenseinfoid', '_ccof_rfipfi_value');
    const expenseListPayload = req.body.expenseList?.map(el=> new MappableObjectForBack(el,ExpenseInformationMappings).data);
    log.verbose('expenseListPayload payload', minify(expenseListPayload));
    expenseListPayload?.forEach(async payload => {
      payload['ccof_rfipfi@odata.bind'] = `/ccof_rfipfis(${rfipfiid})`;
      await postOperation('ccof_rfipfiexpenseinfos', payload);
      await sleep(100);
    });    

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

    friApplication['ccof_ccof_rfipfi_ccof_rfipfiserviceexpansiondetail_rfipfi'] = req.body.expansionList?.map(el=> new MappableObjectForBack(el,ServiceExpansionDetailsMappings).data);
    friApplication['ccof_rfi_pfi_dcs_wi_detail_RFI_PFI_Detail'] = req.body.wageList?.map(el=> new MappableObjectForBack(el,DCSWageIncreaseMappings).data);
    friApplication['ccof_rfi_pfi_other_funding_RFI_PFI'] = req.body.fundingList?.map(el=> new MappableObjectForBack(el,OtherFundingProgramMappings).data);
    friApplication['ccof_ccof_rfipfi_ccof_rfipfiexpenseinfo_rfipfi'] = req.body.expenseList?.map(el=> new MappableObjectForBack(el,ExpenseInformationMappings).data);


    friApplication['ccof_ApplicationCCFRI@odata.bind'] = `/ccof_applicationccfris(${req.params.ccfriId})`;
    log.info('createRFIApplication payload:', friApplication);
    const friApplicationGuid = await postOperation('ccof_rfipfis', friApplication);
    return res.status(HttpStatus.CREATED).json({ friApplicationGuid: friApplicationGuid });
  } catch (e) {
    log.error('createRFIApplication error:', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  getRFIApplication,
  createRFIApplication,
  updateRFIApplication,
  getRFIMedian,
};
