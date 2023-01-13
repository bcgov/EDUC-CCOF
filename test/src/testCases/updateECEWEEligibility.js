import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import pageECEWEEligibility from '../pageObjects/pageECEWEEligibility';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
const eligibility = new pageECEWEEligibility();
const alert = new PageAlert();

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
  await eligibility.updateOptionFromFile(t, 'ecewe-eligibility.txt');
  await t.expect(eligibility.nextButton.hasAttribute('disabled')).notOk();
  await t.click(eligibility.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.click(eligibility.nextButton);

});

