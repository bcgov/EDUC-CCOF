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
const config = require('../utils/configLoader');
const validation = require('../utils/validation');

const login = new PageLogin();
const landing = new PageLanding();
const organization = new PageOrganization();
const facility = new PageFacility();
const funding = new PageFunding();
const addFacility = new PageAddFacility();
const licenseUpload = new PageUploadLicense();
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
  await t.expect(organization.nextButton.hasAttribute('disabled')).notOk();
  await t.click(organization.saveButton).wait(3000);
  log.info('Organization page save button clicked');
  await t.expect(alert.success.exists).ok();
  await t.click(organization.nextButton);
  log.info('Organization page next button clicked');

  //facility-1
  await facility.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility.txt');
  log.info('Facility page data loaded');
  await t.expect(facility.nextButton.hasAttribute('disabled')).notOk();
  await t.click(facility.saveButton).wait(3000);
  log.info('Facility page save button clicked');
  await t.click(facility.nextButton);
  log.info('Facility page next button clicked');
  await t.wait(3000);
  //funding-1
  await funding.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility1-Funding.txt');
  log.info('Funding page data loaded');
  await t.expect(funding.nextButton.hasAttribute('disabled')).notOk();
  await t.click(funding.saveButton).wait(3000);
  log.info('Funding page save button clicked');
  await t.click(funding.nextButton);
  log.info('Funding page next button clicked');
  await t.wait(3000);
  //Add Facility
  await addFacility.clickYesToAddFacility(t);
  log.info('Add Facility page Yes button clicked');

  //facility-2
  await facility.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility2.txt');
  log.info('Facility2  page data loaded');
  await t.expect(facility.nextButton.hasAttribute('disabled')).notOk();
  await t.click(facility.saveButton).wait(3000);
  log.info('Facility2 page save button clicked');
  await t.click(facility.nextButton);
  log.info('Facility2 page next button clicked');
  await t.wait(3000);
  //funding-2
  await funding.loadFieldsFromFile(t, 'e2eTest-GroupProvider-Facility2-Funding.txt');
  log.info('Facility2 Funding page data loaded');
  await t.expect(funding.nextButton.hasAttribute('disabled')).notOk();
  await t.click(funding.saveButton).wait(3000);
  log.info('Facility2 Funding page save button clicked');
  await t.click(funding.nextButton);
  log.info('Facility2 Funding page next button clicked');

  // Navigate to License Upload
  await t.wait(3000);
  await addFacility.clickNoToAddFacility(t);
  log.info('Add Facility page No button clicked');

  //license upload
  log.info('Licence Upload Page Loaded');
  await t.expect(licenseUpload.nextButton.hasAttribute('disabled')).ok();
  await licenseUpload.uploadLicense(t, 'CCOF_License1.png',facility1Name);
  log.info('Licence Upload Page  Licence uploaded for Facility 1');
  await t.expect(licenseUpload.nextButton.hasAttribute('disabled')).ok();
  await licenseUpload.uploadLicense(t, 'CCOF_License2.jpg',facility2Name);
  log.info('Licence Upload Page  Licence uploaded for Facility 2');
  await t.expect(licenseUpload.nextButton.hasAttribute('disabled')).notOk();
  await t.click(licenseUpload.saveButton).wait(3000);
  log.info('Licence Upload Page  save button clicked');
  await t.click(licenseUpload.nextButton);
  log.info('Licence Upload Page next button clicked');

  //Opt In CCFRI


});

