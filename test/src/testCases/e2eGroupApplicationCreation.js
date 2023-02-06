import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageOrganization from '../pageObjects/PageOrganization';
import PageAlert from '../pageObjects/PageAlert';
import PageFacility from '../pageObjects/PageFacility';
import PageFunding from '../pageObjects/PageFunding';
import PageAddFacility from '../pageObjects/PageAddFacility';
import PageUploadLicense from '../pageObjects/PageUploadLicense';
import log from "npmlog";
import {Selector} from 'testcafe';
import PageCCFRIOpt from '../pageObjects/PageCCFRIOpt';
import PageParentFee from '../pageObjects/PageParentFee';
import PageECEWEfacility from '../pageObjects/pageECEWEfacility';
import PageSupportingDocument from '../pageObjects/PageSupportingDocument';
import PageECEWEEligibility from '../pageObjects/pageECEWEEligibility';
import PageDeclaration from '../pageObjects/PageDeclaration';
const config = require('../utils/configLoader');
const validation = require('../utils/validation');

const login = new PageLogin();
const landing = new PageLanding();
const organization = new PageOrganization();
const facility = new PageFacility();
const funding = new PageFunding();
const addFacility = new PageAddFacility();
const licenseUpload = new PageUploadLicense();
const ccfriOpt = new PageCCFRIOpt();
const parentFee = new PageParentFee();
const eceweEligibility = new PageECEWEEligibility();
const eceweFacility = new PageECEWEfacility();
const supportingDocument = new PageSupportingDocument();
const declaration = new PageDeclaration();

const alert = new PageAlert();
const userSetup = require('../services/user-set-up.js');
const facility1Name= 'Test Automation Facility 1';
const facility2Name= 'Test Automation Facility 2';
fixture `e2e Test Happy Path`
  .page(`${config.get('url')}/login`).after(async t => {
  //await userSetup.deleteUserOrganizationSetup(config.get('bceid_credentials:username'));
  await userSetup.deleteOrganization('Test Automation Organization');
})
  .before(async t => {
    await userSetup.deleteUserOrganizationSetup(config.get('bceid_credentials:username'));
  })
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('e2e-Test', async t => {
  await login.bceIdLogin(t);

  if(await landing.continueButton.exists){
    await t
      .click(landing.continueButton)
      .wait(2000);
  }else{
    await t
      .click(landing.newButton)
      .wait(2000);
    await t.click(landing.groupButton).wait(2000);
  }
  //validation checks
/*  await t.expect(organization.nextButton.hasAttribute('disabled')).ok();
  await validation.validateOneInput(t, 'E-mail Address of Signing Authority', 'text', 'A valid email is required');
  await validation.validateOneInput(t, 'E-mail Address of Signing Authority', '123', 'A valid email is required');
  await validation.validateOneInput(t, 'Postal Code', 'V123', 'A valid postal code is required');
  await validation.validateOneInput(t, 'Postal Code', '1234', 'A valid postal code is required');
  await validation.validateOneInput(t, 'Postal Code', 'vvvv', 'A valid postal code is required');
  await t.click(organization.saveButton).wait(2000);*/

  // organization
  log.info('User Logged in and on Organization page');
  await organization.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Organization.txt');
  log.info('Organization page data loaded');
  await organization.nextButtonIsEnabled(t);
  await organization.clickSaveAndNextButton(t)

  //facility-1
  await facility.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility.txt');
  log.info('Facility page data loaded');
  await facility.nextButtonIsEnabled(t);
  await facility.clickSaveAndNextButton(t);
  await t.wait(3000);

  //funding-1
  await funding.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility1-Funding.txt');
  log.info('Funding page data loaded');
  await funding.nextButtonIsEnabled(t);
  await funding.clickSaveAndNextButton(t);
  await t.wait(3000);
  //Add Facility
  await addFacility.clickYesToAddFacility(t);
  log.info('Add Facility page Yes button clicked');

  //facility-2
  await facility.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility2.txt');
  log.info('Facility2  page data loaded');
  await facility.nextButtonIsEnabled(t);
  await facility.clickSaveAndNextButton(t);
  await t.wait(3000);

  //funding-2
  await funding.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility2-Funding.txt');
  log.info('Facility2 Funding page data loaded');
  await funding.nextButtonIsEnabled(t);
  await funding.clickSaveAndNextButton(t);
  await t.wait(3000);

  // Navigate to License Upload
  await addFacility.clickNoToAddFacility(t);
  log.info('Add Facility page No button clicked');

  //license upload
  log.info('Licence Upload Page Loaded');
  await t.expect(licenseUpload.nextButton.hasAttribute('disabled')).ok();
  await licenseUpload.uploadLicense(t, 'CCOF_License1.png',facility1Name);
  log.info('Licence Upload Page  Licence uploaded for Facility 1');
  await licenseUpload.nextButtonIsDisabled(t);
  await licenseUpload.uploadLicense(t, 'CCOF_License2.jpg',facility2Name);
  log.info('Licence Upload Page  Licence uploaded for Facility 2');
  await licenseUpload.nextButtonIsEnabled(t);
  await licenseUpload.clickSaveAndNextButton(t);

  //Opt In CCFRI
  await ccfriOpt.clickOptInForAllFacilities(t);
  await ccfriOpt.clickSaveAndNextButton(t);


  //parent fee facility 1
  log.info('CCFRI Parent Fee for Facility 1 ');
  await parentFee.chooseFacility(t, facility1Name);
  log.info('Reading File:facility-parentfee-1.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-1.txt');
  log.info('Reading File:facility-parentfee-2.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-2.txt');
  log.info('Reading File:facility-parentfee-3.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-3.txt');
  log.info('Reading File:facility-parentfee-4.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-4.txt');
  log.info('Reading File:facility-parentfee-5.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-5.txt');
  log.info('Reading File:facility-parentfee-6.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-6.txt');
  log.info('Reading File:facility-parentfee-1-1.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-1-1.txt');
  log.info('Reading File:facility-parentfee-2-2.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-2-2.txt');
  log.info('Reading File:facility-parentfee-3-3.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-3-3.txt');
  log.info('Reading File:facility-parentfee-4-4.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-4-4.txt');
  log.info('Reading File:facility-parentfee-5-5.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-5-5.txt');
  log.info('Reading File:facility-parentfee-6-6.txt ');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-6-6.txt');
  await t.wait(3000);
  await parentFee.updateClosure(t, 'facility-parentfee-closure.txt');
  await parentFee.updateInformation(t, 'facility-parentfee-information.txt');
  await parentFee.clickSaveAndNextButton(t);
  await t.wait(3000);

  //parent fee facility 2
  log.info('CCFRI Parent Fee for Facility 2');
  await parentFee.chooseFacility(t, facility2Name);
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-1.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-2.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-3.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-4.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-5.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-6.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-1-1.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-2-2.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-3-3.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-4-4.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-5-5.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-6-6.txt');
  await parentFee.updateClosure(t, 'facility-parentfee-noclosure.txt');
  await parentFee.updateInformation(t, 'facility-parentfee-information.txt');
  await parentFee.clickSaveAndNextButton(t);

  //ECE-WE Eligibility
  log.info('ECE-WE Eligibility Page Loaded');
  await eceweEligibility.updateOptionFromFile(t, 'ee2eTest-ecewe-eligibility.txt');
  await eceweEligibility.clickSaveAndNextButton(t);

  //ECE-WE Facility
  log.info('ECE-WE Facility Loaded');
  await eceweFacility.updateOptFromFile(t, 'e2eTest-ecewe-facility.txt');
  await eceweFacility.clickSaveAndNextButton(t);

  //Supporting Document
  log.info('Supporting Document Loaded');
  await supportingDocument.uploadSupportingDocumentForFacility(t, 'sample_txt.txt', facility1Name);
  await supportingDocument.nextButtonIsEnabled(t);
  await supportingDocument.clickSaveAndNextButton(t);

  //Declaration
  log.info('Declaration Loaded');
  await declaration.clickDeclarationCheckBox(t);
  await declaration.submitButtonIsDisabled(t);
  await declaration.singDeclaration(t, 'Test Automation Submitted');
  await declaration.submitButtonIsEnabled(t);
  await declaration.clickSubmitButton(t);

});

