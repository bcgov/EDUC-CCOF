'use strict';

const { getOperation, postOperation, patchOperationWithObjectId, deleteOperationWithObjectId, sleep, getLabelFromValue, updateChangeRequestNewFacility, getChangeActionDetails } = require('./utils');
const { CCOF_APPLICATION_TYPES, ORGANIZATION_PROVIDER_TYPES, APPLICATION_STATUS_CODES, CCOF_STATUS_CODES, CHANGE_REQUEST_TYPES, CCFRI_STATUS_CODES } = require('../util/constants');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const { MappableObjectForFront, MappableObjectForBack, getMappingString } = require('../util/mapping/MappableObject');
const {
  ClosureMappings,
  ECEWEApplicationMappings,
  ECEWEFacilityMappings,
  DeclarationMappings,
  UserProfileBaseCCFRIMappings,
  UserProfileCCFRIMappings,
  ApplicationSummaryMappings,
  ApplicationSummaryCcfriMappings,
  OrganizationFacilityMappings,
  CCOFApplicationFundingMapping,
  OrganizationMappings,
  CCFRIApprovableFeeSchedulesMappings,
  CCFRIFacilityMappings,
} = require('../util/mapping/Mappings');
const { getLicenseCategoriesByFacilityId, getFacilityChildCareTypesByCcfriId, getFacilityByFacilityId } = require('./facility');
const { getRfiApplicationByCcfriId } = require('./rfiApplication');
const { getNmfApplicationByCcfriId } = require('./nmfApplication');
const { mapFundingObjectForFront } = require('./funding');
const pLimit = require('p-limit');

const { ChangeRequestMappings, ChangeActionRequestMappings, NewFacilityMappings, MtfiMappings } = require('../util/mapping/ChangeRequestMappings');

async function renewCCOFApplication(req, res) {
  try {
    const application = req.body;
    const payload = {
      ccof_providertype: application.providerType === 'GROUP' ? ORGANIZATION_PROVIDER_TYPES.GROUP : ORGANIZATION_PROVIDER_TYPES.FAMILY,
      ccof_applicationtype: CCOF_APPLICATION_TYPES.RENEW,
      ccof_application_template_version: application.applicationTemplateVersion,
      'ccof_ProgramYear@odata.bind': `/ccof_program_years(${application.programYearId})`,
      'ccof_Organization@odata.bind': `/ccof_program_years(${application.organizationId})`,
    };
    const applicationGuid = await postOperation('ccof_applications', payload);

    //After the application is created, get the application guid
    return res.status(HttpStatus.CREATED).json({ applicationId: applicationGuid });
  } catch (e) {
    log.error('error', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getRenewalApplicationCCOF(req, res) {
  try {
    const operation = `ccof_applications(${req.params.applicationId})?$select=ccof_has_banking_information_changed,ccof_is_funding_agreement_confirmed,ccof_are_licence_details_confirmed`;
    const response = await getOperation(operation);
    return res.status(HttpStatus.OK).json(new MappableObjectForFront(response, ApplicationSummaryMappings));
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateApplication(req, res) {
  try {
    const response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, new MappableObjectForBack(req.body, ApplicationSummaryMappings).toJSON());
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function patchCCFRIApplication(req, res) {
  try {
    const payload = new MappableObjectForBack(req.body, CCFRIFacilityMappings).toJSON();
    const response = await patchOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId, payload);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deleteCCFRIApplication(req, res) {
  try {
    await deleteOperationWithObjectId('ccof_applicationccfris', req.params.ccfriId);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

//creates or updates CCFRI application.
async function updateCCFRIApplication(req, res) {
  const body = req.body;
  const retVal = [];
  try {
    await Promise.all(
      body.map(async (facility) => {
        const payload = {
          ccof_ccfrioptin: facility.optInResponse,
          'ccof_Facility@odata.bind': `/accounts(${facility.facilityID})`,
          'ccof_Application@odata.bind': `/ccof_applications(${facility.applicationID})`,
        };

        // if there is Change Action ID in request body -> creating new Change Action MTFI
        if (facility.changeActionId) {
          delete payload['ccof_Application@odata.bind'];
          payload['ccof_change_request_mtfi_application_ccfri'] = [
            {
              'ccof_facility@odata.bind': `/accounts(${facility.facilityID})`,
              'ccof_Change_Action@odata.bind': `/ccof_change_actions(${facility.changeActionId})`,
              'ccof_Organization@odata.bind': `/accounts(${facility.organizationId})`,
              'ccof_ProgramYear@odata.bind': `/ccof_program_years(${facility.programYearId})`,
            },
          ];
        }

        //only bind CCFRI application to main application if this facility is completed during a new application
        //ccfri application for change request should only bind to their respective changeAction (done below)
        //requirements changed so now we DO bind to main app... leaving this here for now just in case it changes again.
        // if (!facility.changeRequestNewFacilityId){
        //   payload = {...payload, 'ccof_Application@odata.bind': `/ccof_applications(${facility.applicationID})`};
        // };

        let response = undefined;
        if (facility.ccfriApplicationId) {
          response = await patchOperationWithObjectId('ccof_applicationccfris', facility.ccfriApplicationId, payload);
          retVal.push(response);
        } else {
          response = await postOperation('ccof_applicationccfris', payload);
          retVal.push({
            facilityId: facility.facilityID,
            applicationId: facility.applicationID,
            ccfriApplicationId: response,
            ccof_ccfrioptin: facility.optInResponse,
          });
        }

        //if this ccfri application is linked to a new facility change request, add the linkage to the New Facility Change Request
        if (facility.changeRequestNewFacilityId) {
          const resp = await updateChangeRequestNewFacility(facility.changeRequestNewFacilityId, {
            'ccof_ccfri@odata.bind': `/ccof_applicationccfris(${facility.ccfriApplicationId ? facility.ccfriApplicationId : response})`,
          });
          retVal.push(resp);
        }
        await sleep(100); //slow down the hits to dynamics.
      }),
    ); //end for each
  } catch (e) {
    log.error(e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }

  return res.status(HttpStatus.OK).json(retVal);
}

async function getApprovableFeeSchedules(req, res) {
  try {
    const response = await getOperation(`ccof_applicationccfris(${req.params.ccfriId})?$select=ccof_afs_status,ccof_afs_status_mtfi&$expand=ccof_afs_applicationccfri`);
    const afs = new MappableObjectForFront(response, ApplicationSummaryCcfriMappings).toJSON();
    afs.approvableFeeSchedules = response?.ccof_afs_applicationccfri?.map((item) => new MappableObjectForFront(item, CCFRIApprovableFeeSchedulesMappings).toJSON());
    return res.status(HttpStatus.OK).json(afs);
  } catch (e) {
    log.error('An error occurred while getting CCFRI AFS', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* child care and program year GUIDs are looked up in AddNewFees.vue */

async function upsertParentFees(req, res) {
  const body = req.body;

  //the front end sends over an array of objects. This loops through the array and sends a dynamics API request
  //for each object.
  body.forEach(async (feeGroup) => {
    //only call the delete API if there is a GUID acossciated to that child care category fee group
    if (feeGroup?.deleteMe && feeGroup?.parentFeeGUID) {
      try {
        await deleteOperationWithObjectId('ccof_application_ccfri_childcarecategories', feeGroup.parentFeeGUID);
      } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
      }
    } else if (feeGroup?.feeFrequency) {
      const childCareCategory = `/ccof_childcare_categories(${feeGroup.childCareCategory})`;
      const programYear = `/ccof_program_years(${feeGroup.programYear})`;
      const payload = {
        ccof_frequency: feeGroup.feeFrequency,
        'ccof_ChildcareCategory@odata.bind': childCareCategory,
        'ccof_ProgramYear@odata.bind': programYear,
        'ccof_ApplicationCCFRI@odata.bind': `/ccof_applicationccfris(${feeGroup.ccfriApplicationGuid})`,
      };

      Object.assign(payload, {
        ccof_apr: feeGroup.aprFee,
        ccof_may: feeGroup.mayFee,
        ccof_jun: feeGroup.junFee,
        ccof_jul: feeGroup.julFee,
        ccof_aug: feeGroup.augFee,
        ccof_sep: feeGroup.sepFee,
        ccof_oct: feeGroup.octFee,
        ccof_nov: feeGroup.novFee,
        ccof_dec: feeGroup.decFee,
        ccof_jan: feeGroup.janFee,
        ccof_feb: feeGroup.febFee,
        ccof_mar: feeGroup.marFee,
      });
      const url = `_ccof_applicationccfri_value=${feeGroup.ccfriApplicationGuid},_ccof_childcarecategory_value=${feeGroup.childCareCategory},_ccof_programyear_value=${feeGroup.programYear} `;
      try {
        await patchOperationWithObjectId('ccof_application_ccfri_childcarecategories', url, payload);
      } catch (e) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
      }
    }
  }); //end forEach

  //if no notes, don't bother sending any requests. Even if left blank, front end will send over an empty string
  //so body[0].notes will always exist

  const payload = {
    ccof_informationccfri: body[0].notes,
    ccof_formcomplete: body[0].ccof_formcomplete,
    ccof_has_rfi: body[0].ccof_has_rfi,
    ccof_feecorrectccfri: body[0].existingFeesCorrect,
    ccof_chargefeeccfri: body[0].hasClosureFees,
  };

  try {
    await patchOperationWithObjectId('ccof_applicationccfris', body[0].ccfriApplicationGuid, payload);
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function getECEWEApplication(req, res) {
  try {
    const operation =
      'ccof_applications(' +
      req.params.applicationId +
      ')?$select=ccof_ecewe_optin,ccof_ecewe_employeeunion,ccof_ecewe_selecttheapplicablefundingmodel,ccof_describe_your_org,ccof_ecewe_selecttheapplicablesector,ccof_public_sector_employer,ccof_union_agreement_reached,ccof_ecewe_confirmation&$expand=ccof_ccof_application_ccof_applicationecewe_application($select=ccof_name,_ccof_facility_value,ccof_optintoecewe,ccof_facilityunionstatus,statuscode)';
    let eceweApp = await getOperation(operation);
    eceweApp = new MappableObjectForFront(eceweApp, ECEWEApplicationMappings);
    const forFrontFacilities = [];
    Object.values(eceweApp.data.facilities).forEach((value) => forFrontFacilities.push(new MappableObjectForFront(value, ECEWEFacilityMappings).data));
    eceweApp.data.facilities = forFrontFacilities;
    return res.status(HttpStatus.OK).json(eceweApp);
  } catch (e) {
    log.error('An error occurred while getting ECEWEApplication', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEApplication(req, res) {
  let application = req.body;
  application = new MappableObjectForBack(application, ECEWEApplicationMappings);
  application = application.toJSON();
  application.ccof_ecewe_employeeunion = application.ccof_ecewe_optin == 0 ? null : application.ccof_ecewe_employeeunion;
  try {
    log.verbose('updateECEWEApplication: payload', application);
    const response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, application);
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function updateECEWEFacilityApplication(req, res) {
  const facilities = req.body;
  const forBackFacilities = [];
  let response;
  Object.values(facilities).forEach((value) => forBackFacilities.push(new MappableObjectForBack(value, ECEWEFacilityMappings).data));
  let eceweApplicationId;
  try {
    for (const key in forBackFacilities) {
      // add join attributes for application and facility
      forBackFacilities[key]['ccof_application@odata.bind'] = '/ccof_applications(' + req.params.applicationId + ')';
      forBackFacilities[key]['ccof_Facility@odata.bind'] = '/accounts(' + forBackFacilities[key]._ccof_facility_value + ')';
      eceweApplicationId = forBackFacilities[key].ccof_applicationeceweid;
      const changeRequestNewFacilityId = forBackFacilities[key].ccof_change_request_new_facilityid;
      // remove attributes that are already used in payload join (above) and not needed.
      delete forBackFacilities[key].ccof_applicationeceweid;
      delete forBackFacilities[key]._ccof_facility_value;
      delete forBackFacilities[key].ccof_change_request_new_facilityid;

      const facility = forBackFacilities[key];
      if (eceweApplicationId) {
        // send PATCH (update existing ECEWE facility)
        response = await patchOperationWithObjectId('ccof_applicationecewes', eceweApplicationId, facility);
      } else {
        // send POST (create a new ECEWE facility)
        const operation = 'ccof_applicationecewes';
        response = await postOperation(operation, facility);
        facilities[key].eceweApplicationId = response;
        //if this is a new facility change request, link ECEWE application to the New Facility Change Request
        if (changeRequestNewFacilityId) {
          await updateChangeRequestNewFacility(changeRequestNewFacilityId, { 'ccof_ecewe@odata.bind': `/ccof_applicationecewes(${facilities[key].eceweApplicationId})` });
        }
      }
    }
    return res.status(HttpStatus.OK).json({ facilities: facilities });
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* Get the user declaration for a given application id. */
async function getDeclaration(req, res) {
  try {
    const operation = 'ccof_applications(' + req.params.applicationId + ')?$select=ccof_consent,ccof_submittedby,ccof_latestsubmissiondate,ccof_declarationastatus,ccof_declarationbstatus,statuscode';
    let declaration = await getOperation(operation);
    declaration = new MappableObjectForFront(declaration, DeclarationMappings);
    return res.status(HttpStatus.OK).json(declaration);
  } catch (e) {
    log.error('An error occurred while getting Declaration', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* Submit CCOF/CCFRI/ECEWE application */
async function submitApplication(req, res) {
  let declaration = new MappableObjectForBack(req.body, DeclarationMappings);
  declaration.data.statuscode = APPLICATION_STATUS_CODES.SUBMITTED;
  const ccfriFacilitiesToLock = JSON.parse(JSON.stringify(declaration));
  declaration = declaration.toJSON();
  try {
    delete declaration.facilities;
    let response = await patchOperationWithObjectId('ccof_applications', req.params.applicationId, declaration);

    // If CCRFI facilities exist on the payload we need to iterate
    // each and call CCFRI endpoint to relock attributes.
    if (checkKey('facilities', ccfriFacilitiesToLock)) {
      let ccof_applicationccfriid;
      for (let facility of ccfriFacilitiesToLock.facilities) {
        facility = new MappableObjectForBack(facility, UserProfileCCFRIMappings).toJSON();
        ccof_applicationccfriid = facility.ccof_applicationccfriid;
        delete facility.ccof_applicationccfriid;
        response = await patchOperationWithObjectId('ccof_applicationccfris', ccof_applicationccfriid, facility);
      }
    }
    return res.status(HttpStatus.OK).json(response);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

function getFacilityInMap(map, facilityId) {
  let facility = map.get(facilityId);
  if (!facility) {
    facility = { facilityId: facilityId };
    map.set(facilityId, facility);
  }
  return facility;
}

async function updateStatusForApplicationComponents(req, res) {
  const promises = [];
  const request = req.body;
  try {
    if (request.organizationId && request.isOrganizationComplete !== null && request.isOrganizationComplete !== undefined) {
      let organizationReq = {
        isOrganizationComplete: request.isOrganizationComplete,
      };
      organizationReq = new MappableObjectForBack(organizationReq, OrganizationMappings).toJSON();
      promises.push(patchOperationWithObjectId('accounts', request.organizationId, organizationReq));
    }

    if (
      request.applicationId &&
      ((request.isEceweComplete !== null && request.isEceweComplete !== undefined) || (request.isLicenseUploadComplete !== null && request.isLicenseUploadComplete !== undefined))
    ) {
      let applicationReq = {
        isEceweComplete: request.isEceweComplete,
        isLicenseUploadComplete: request.isLicenseUploadComplete,
      };
      if (request.changeRequestId) {
        applicationReq = new MappableObjectForBack(applicationReq, ChangeRequestMappings).toJSON();
        promises.push(patchOperationWithObjectId('ccof_change_requests', request.changeRequestId, applicationReq));
      } else {
        applicationReq = new MappableObjectForBack(applicationReq, ECEWEApplicationMappings).toJSON();
        promises.push(patchOperationWithObjectId('ccof_applications', req.params.applicationId, applicationReq));
      }
    }
    if (request.facilities) {
      for (const facility of request.facilities) {
        if (facility.facilityId && facility.isFacilityComplete !== null && facility.isFacilityComplete !== undefined) {
          let facilityReq = {
            isFacilityComplete: facility.isFacilityComplete,
          };
          facilityReq = new MappableObjectForBack(facilityReq, OrganizationFacilityMappings).toJSON();
          promises.push(patchOperationWithObjectId('accounts', facility.facilityId, facilityReq));
        }
      }
    }
    if (request.fundings) {
      for (const funding of request.fundings) {
        if (funding.basefundingId && funding.isCCOFComplete !== null && funding.isCCOFComplete !== undefined) {
          let ccofBaseFundingReq = {
            isCCOFComplete: funding.isCCOFComplete,
          };
          ccofBaseFundingReq = new MappableObjectForBack(ccofBaseFundingReq, CCOFApplicationFundingMapping).toJSON();
          promises.push(patchOperationWithObjectId('ccof_application_basefundings', funding.basefundingId, ccofBaseFundingReq));
        }
      }
    }
    if (request.ccfris) {
      for (const ccfri of request.ccfris) {
        if (
          ccfri.ccfriId &&
          ((ccfri.isCCFRIComplete !== null && ccfri.isCCFRIComplete !== undefined) ||
            (ccfri.isNmfComplete !== null && ccfri.isNmfComplete !== undefined) ||
            (ccfri.isRfiComplete !== null && ccfri.isRfiComplete !== undefined))
        ) {
          let ccfriApplicationReq = {
            isCCFRIComplete: ccfri.isCCFRIComplete,
            isNmfComplete: ccfri.isNmfComplete,
            isRfiComplete: ccfri.isRfiComplete,
          };
          ccfriApplicationReq = new MappableObjectForBack(ccfriApplicationReq, UserProfileCCFRIMappings).toJSON();
          promises.push(await patchOperationWithObjectId('ccof_applicationccfris', ccfri.ccfriId, ccfriApplicationReq));
        }
      }
    }
    const results = await Promise.all(promises); // array of promise resolution.
    for (const result of results) {
      result.status === 'rejected' ? console.error(result.reason) : console.info(result.value);
    }
    return res.sendStatus(HttpStatus.OK);
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function populateSummaryDataForFacility(facility) {
  try {
    const childCareLicenses = await getLicenseCategoriesByFacilityId(facility.facilityId);
    facility.childCareLicenses = Array.from(childCareLicenses.values());
  } catch (e) {
    log.warn('populateSummaryDataForFacility unable to find Licence Categories', e);
  }

  // check for opt out - no need for more calls if opt-out
  if (facility.ccfri?.ccfriId && facility.ccfri?.ccfriOptInStatus === 1) {
    const { ccfri } = facility;
    const facilityChildcareTypes = await getFacilityChildCareTypesByCcfriId(ccfri.ccfriId);
    facility.ccfri.childCareTypes = facilityChildcareTypes.childCareTypes;

    // load up the previous ccfri app if it exists, so we can check that we are not missing any child care fee
    // categories from the last year.
    if (ccfri.previousCcfriId) {
      const previousCcfriId = await getFacilityChildCareTypesByCcfriId(ccfri.previousCcfriId);
      facility.ccfri.prevYearCcfriApp = previousCcfriId;
    }

    facility.ccfri.closures = [];
    const closuresResponse = await getOperation(`ccof_application_ccfri_closures?$filter=_ccof_applicationccfri_value eq ${ccfri.ccfriId}`);
    closuresResponse?.value?.forEach((closure) => facility.ccfri.closures.push(new MappableObjectForFront(closure, ClosureMappings).toJSON()));

    if (ccfri?.hasRfi || ccfri?.unlockRfi) {
      const rfiApp = await getRfiApplicationByCcfriId(ccfri.ccfriId);
      facility.rfiApp = rfiApp;
    }

    if (ccfri?.hasNmf || ccfri?.unlockNmf) {
      const nmfApp = await getNmfApplicationByCcfriId(ccfri.ccfriId);
      facility.nmfApp = nmfApp;
    }
  }

  // jb changed below to work with renewel apps
  facility.facilityInfo = await getFacilityByFacilityId(facility.facilityId);

  return facility;
}

async function getApplicationSummary(req, res) {
  try {
    const operation = `ccof_applications(${req.params.applicationId})?$expand=ccof_applicationccfri_Application_ccof_ap($select=${getMappingString(
      ApplicationSummaryCcfriMappings,
    )}),ccof_ccof_application_ccof_applicationecewe_application($select=ccof_name,_ccof_facility_value,ccof_optintoecewe,statuscode,ccof_facilityunionstatus),ccof_application_basefunding_Application`;
    const results = await getOperation(operation);

    const applicationSummary = new MappableObjectForFront(results, ApplicationSummaryMappings).data;
    applicationSummary.organizationProviderType = getLabelFromValue(applicationSummary.organizationProviderType, ORGANIZATION_PROVIDER_TYPES);
    applicationSummary.applicationType = getLabelFromValue(applicationSummary.applicationType, CCOF_APPLICATION_TYPES);
    applicationSummary.ccofStatus = getLabelFromValue(applicationSummary.ccofStatus, CCOF_STATUS_CODES, 'NEW');
    applicationSummary.applicationStatus = getLabelFromValue(applicationSummary.applicationStatus, APPLICATION_STATUS_CODES, 'NEW');

    // setup the Facility map
    const facilityMap = new Map();
    // map CCFRI
    results.ccof_applicationccfri_Application_ccof_ap?.forEach((ccfri) => {
      const mappedCCFRI = new MappableObjectForFront(ccfri, ApplicationSummaryCcfriMappings).data;
      getFacilityInMap(facilityMap, mappedCCFRI.facilityId).ccfri = mappedCCFRI;
    });

    // map ECE-WE
    results.ccof_ccof_application_ccof_applicationecewe_application?.forEach((ecewe) => {
      const mappedEcewe = new MappableObjectForFront(ecewe, ECEWEFacilityMappings).data;
      getFacilityInMap(facilityMap, mappedEcewe.facilityId).ecewe = mappedEcewe;
    });

    // map CCOF Base funding if it exists
    results.ccof_application_basefunding_Application?.forEach((baseFunding) => {
      const mappedBaseFunding = mapFundingObjectForFront(baseFunding);
      getFacilityInMap(facilityMap, mappedBaseFunding.facilityId).funding = mappedBaseFunding;
    });

    // add the change request ID to the facility so we can filter by it on the front end
    const allChangeRequests = await getChangeRequestsFromApplicationId(req.params.applicationId);
    if (allChangeRequests.length > 0) {
      allChangeRequests.forEach((changeRequest) => {
        changeRequest.changeActions.forEach((changeAction) => {
          if (changeAction.changeType == 'NEW_FACILITY') {
            changeAction.facilities.forEach((newFac) => {
              getFacilityInMap(facilityMap, newFac.facilityId).changeRequestId = changeAction.changeRequestId;
            });
          }
        });
      });
    }

    const facilityFilters = Array.isArray(req.body.facilities) ? req.body.facilities : [];
    const facilities = facilityFilters.length > 0 ? Array.from(facilityMap.values()).filter((facility) => facilityFilters.includes(facility.facilityId)) : Array.from(facilityMap.values());
    const facilityPromises = [];
    const limit = pLimit(6);
    for (const facility of facilities) {
      facilityPromises.push(limit(async () => await populateSummaryDataForFacility(facility)));
    }
    const facilitiesWithSummaryData = await Promise.all(facilityPromises);

    return res.status(HttpStatus.OK).json({
      application: applicationSummary,
      facilities: facilitiesWithSummaryData,
    });
  } catch (e) {
    log.error('An error occurred while getting getApplicationSummary', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

/* Checks if object attrubte name exists in payload */
function checkKey(key, obj) {
  for (const name in obj) {
    if (name === key) {
      return true;
    }
    if (typeof obj[name] === 'object') {
      if (checkKey(key, obj[name])) {
        return true;
      }
    }
  }
  return false;
}

async function getFacilityChangeData(changeActionId) {
  const mappedData = [];
  //also grab some facility data so we can use the CCOF page.We might also be able to grab CCFRI ID from here?
  const newFacOperation = `ccof_change_request_new_facilities?$select=_ccof_facility_value,ccof_change_request_new_facilityid&$expand=ccof_facility($select=name,ccof_facilitystatus)&$filter=_ccof_change_action_value eq ${changeActionId}`;
  const newFacData = await getOperation(newFacOperation);
  newFacData.value.forEach((fac) => {
    if (fac.ccof_facility) {
      const mappedFacility = new MappableObjectForFront(fac, NewFacilityMappings).toJSON();
      mappedFacility.facilityName = fac.ccof_facility['name'];
      mappedFacility.facilityStatus = fac.ccof_facility['ccof_facilitystatus@OData.Community.Display.V1.FormattedValue'];
      mappedData.push(mappedFacility);
    }
  });

  return mappedData;
}

async function getMTFIChangeData(changeActionId) {
  const mtfi = await getChangeActionDetails(changeActionId, 'ccof_change_request_mtfis', MtfiMappings, 'ccof_CCFRI', UserProfileBaseCCFRIMappings);
  mtfi?.forEach((item) => {
    item.ccfriStatus = getLabelFromValue(item.ccfriStatus, CCFRI_STATUS_CODES, 'NOT STARTED');
  });
  return mtfi;
}
//and Microsoft.Dynamics.CRM.In(PropertyName='_ccof_application_value',PropertyValues=[${applicationId}]));
async function getChangeRequestsFromApplicationId(applicationIds) {
  let str = '[';

  const regex = new RegExp('([^,]+)', 'g');
  const found = applicationIds.match(regex);
  found.forEach((app, index) => {
    str = str + `'${app}'`;
    if (index != found.length - 1) {
      str = str + ',';
    } else {
      str = str + ']';
    }
  });

  try {
    const operation = `ccof_change_requests?$expand=ccof_change_action_change_request&$select=${getMappingString(
      ChangeRequestMappings,
    )}&$filter=ccof_change_action_change_request/any(c:(c/ccof_changetype ne ${CHANGE_REQUEST_TYPES.NEW_CLOSURE} and c/ccof_changetype ne ${CHANGE_REQUEST_TYPES.EDIT_EXISTING_CLOSURE} and c/ccof_changetype ne ${CHANGE_REQUEST_TYPES.REMOVE_A_CLOSURE})) and (Microsoft.Dynamics.CRM.In(PropertyName='ccof_application',PropertyValues=${str}))`;
    let changeRequests = await getOperation(operation);
    changeRequests = changeRequests.value;

    const payload = [];
    await Promise.all(
      changeRequests.map(async (request) => {
        const req = new MappableObjectForFront(request, ChangeRequestMappings).toJSON();

        //go through the array of change ACTIONS and map them. Depending on the type of change action - we might need to load more data.
        req.changeActions = await Promise.all(
          request.ccof_change_action_change_request.map(async (changeAction) => {
            let mappedChangeAction = new MappableObjectForFront(changeAction, ChangeActionRequestMappings).toJSON();
            if (mappedChangeAction.changeType === CHANGE_REQUEST_TYPES.NEW_FACILITY) {
              mappedChangeAction = { ...mappedChangeAction, facilities: await getFacilityChangeData(mappedChangeAction.changeActionId) };
            } else if (mappedChangeAction.changeType === CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE) {
              mappedChangeAction = { ...mappedChangeAction, mtfiFacilities: await getMTFIChangeData(mappedChangeAction.changeActionId) };
            }
            mappedChangeAction.changeType = getLabelFromValue(mappedChangeAction.changeType, CHANGE_REQUEST_TYPES);
            return mappedChangeAction;
          }),
        );

        payload.push(req);
      }),
    );
    return payload;
  } catch (e) {
    log.error('An error occurred while getting change request', e);
    throw e;
  }
}

async function getChangeRequest(req, res) {
  try {
    //pulled the logic out into a seperate function so it can be called from somewhere else
    const payload = await getChangeRequestsFromApplicationId(req.params.applicationId);
    return res.status(HttpStatus.OK).json(payload);
  } catch (e) {
    log.error('An error occurred while getting change request', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

async function deletePcfApplication(req, res) {
  try {
    const operation = `ccof_applications(${req.params.applicationId})?$expand=ccof_application_basefunding_Application($select=_ccof_facility_value)`;
    const application = await getOperation(operation);

    //loop thru to grab facility ID's and delete all of them
    await Promise.all(
      application['ccof_application_basefunding_Application'].map(async (facility) => {
        await deleteOperationWithObjectId('accounts', facility['_ccof_facility_value']);
      }),
    );

    //delete the application
    await deleteOperationWithObjectId('ccof_applications', req.params.applicationId);

    //and delete the org. We must delete the org otherwise the user will be linked to multiple orgs in dynamics
    await deleteOperationWithObjectId('accounts', application['_ccof_organization_value']);

    return res.status(HttpStatus.OK).json();
  } catch (e) {
    log.error('An error occurred while deleting PCF', e);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data ? e.data : e?.status);
  }
}

module.exports = {
  updateCCFRIApplication,
  upsertParentFees,
  getECEWEApplication,
  updateECEWEApplication,
  updateECEWEFacilityApplication,
  renewCCOFApplication,
  getDeclaration,
  submitApplication,
  getApplicationSummary,
  updateStatusForApplicationComponents,
  getChangeRequest,
  getApprovableFeeSchedules,
  patchCCFRIApplication,
  deleteCCFRIApplication,
  deletePcfApplication,
  getRenewalApplicationCCOF,
  updateApplication,
};
