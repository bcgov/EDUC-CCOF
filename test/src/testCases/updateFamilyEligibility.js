import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageFamilyEligibility from '../pageObjects/PageFamilyEligibility';
import PageFamilyForm from '../pageObjects/PageFamilyForm';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const eligibility = new PageFamilyEligibility();
const family = new PageFamilyForm();
const alert = new PageAlert();

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
  await t.click(family.nextButton);
  await eligibility.loadFieldsFromFile(t, 'family-eligibility.txt');
  await t.expect(eligibility.nextButton.hasAttribute('disabled')).notOk(); // This will fail if the next button is disable
  await t.takeScreenshot({fullPage: true});
  await t.click(eligibility.saveButton);
  await t.expect(alert.success.exists).ok();
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});
