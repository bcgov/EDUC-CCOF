import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageFacility from '../pageObjects/PageFacility';
import PageOrganization from '../pageObjects/PageOrganization';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const facility = new PageFacility();
const organization = new PageOrganization();
const alert = new PageAlert();

fixture `Facility Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update Facility - Completed info', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(organization.nextButton);
  await facility.loadFieldsFromFile(t, 'facility-completed.txt');
  await t.expect(facility.nextButton.hasAttribute('disabled')).notOk(); 
  await t.takeScreenshot({fullPage: true});
  await t.click(facility.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.click(facility.nextButton);
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});

//The year began operation could not be removed from the page
test('Update Facility - Incompleted info', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(organization.nextButton);
  await facility.loadFieldsFromFile(t, 'facility-incompleted.txt');
  await t.takeScreenshot({fullPage: true});
  await t.expect(facility.nextButton.hasAttribute('disabled')).ok(); 
  await t.click(facility.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});
