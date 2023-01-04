import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageFacility from '../pageObjects/PageFacility';
import PageOrganization from '../pageObjects/PageOrganization';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const facility = new PageFacility();
const organization = new PageOrganization();


fixture `Facility Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update Facility', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(organization.nextButton);
  await facility.loadFieldsFromFile(t, 'test1-facility.txt');
  await t.expect(facility.nextButton.hasAttribute('disabled')).notOk(); // This will fail if the next button is disable
  await t.takeScreenshot({fullPage: true});
  await t.click(facility.saveButton);
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});
