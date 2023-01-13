import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
<<<<<<< HEAD
import PageECEWEEligibility from '../pageObjects/pageECEWEEligibility';
import PageAlert from '../pageObjects/PageAlert';
import PageECEWEfacility from '../pageObjects/pageECEWEfacility';
=======
import pageECEWEEligibility from '../pageObjects/pageECEWEEligibility';
import PageAlert from '../pageObjects/PageAlert';
>>>>>>> 53389bc (ECEWE pages)

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
<<<<<<< HEAD
const eligibility = new PageECEWEEligibility();
const alert = new PageAlert();
const opt = new PageECEWEfacility();
=======
const eligibility = new pageECEWEEligibility();
const alert = new PageAlert();
>>>>>>> 53389bc (ECEWE pages)

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
<<<<<<< HEAD
  await eligibility.updateOptionFromFile(t, 'ee2eTest-ecewe-eligibility.txt');
  await eligibility.clickSaveAndNextButton(t);
  await opt.updateOptFromFile(t, 'e2eTest-ecewe-facility.txt');
  await opt.clickSaveAndNextButton(t);
=======
  await eligibility.updateOptionFromFile(t, 'ecewe-eligibility.txt');
  await t.expect(eligibility.nextButton.hasAttribute('disabled')).notOk();
  await t.click(eligibility.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.click(eligibility.nextButton);
>>>>>>> 53389bc (ECEWE pages)

});

