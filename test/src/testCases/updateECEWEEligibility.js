import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageECEWEEligibility from '../pageObjects/pageECEWEEligibility';
import PageAlert from '../pageObjects/PageAlert';
import PageECEWEfacility from '../pageObjects/pageECEWEfacility';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();

const eligibility = new PageECEWEEligibility();
const alert = new PageAlert();
const opt = new PageECEWEfacility();

fixture `ECE-WE Eligibility Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update ECE-WE Eligibility', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(eligibility.ECEWEButton);
  await t.click(eligibility.eligibilityButton);
  await eligibility.updateOptionFromFile(t, 'ee2eTest-ecewe-eligibility.txt');
  await eligibility.clickSaveAndNextButton(t);
  await opt.updateOptFromFile(t, 'e2eTest-ecewe-facility.txt');
  await opt.clickSaveAndNextButton(t);

});

