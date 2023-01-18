import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import pageECEWEfacility from '../pageObjects/pageECEWEfacility';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
const opt = new pageECEWEfacility();
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
  await t.click(opt.ECEWEButton);
  await t.click(opt.facilityButton).wait(2000);
  await opt.updateOptFromFile(t, 'ecewe-facility-opt.txt');
  await t.expect(opt.nextButton.hasAttribute('disabled')).notOk();
  await t.click(opt.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.click(opt.nextButton);

});