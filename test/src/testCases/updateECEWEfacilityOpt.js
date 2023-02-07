import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageECEWEfacility from '../pageObjects/pageECEWEfacility';
import PageAlert from '../pageObjects/PageAlert';
import PageECEWEEligibility from '../pageObjects/pageECEWEEligibility';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
const opt = new PageECEWEfacility();
const elibility = new PageECEWEEligibility();
const alert = new PageAlert();

fixture `ECE-WE Facility Opt-in Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update ECE-WE Facility', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(elibility.ECEWEButton);
  await t.click(elibility.eligibilityButton);
  await t.click(opt.ECEWEButton);
  await t.click(opt.facilityButton);
  await opt.updateOptFromFile(t, 'e2eTest-ecewe-facility.txt');
  await opt.clickSaveAndNextButton(t);

});
