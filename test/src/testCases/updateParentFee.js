import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageParentFee from '../pageObjects/PageParentFee';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
const parentFee = new PageParentFee();
const alert = new PageAlert();

fixture `CCFRI Parent Fee Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update Parent Fee Test', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(parentFee.CCFRIButton);
  await parentFee.chooseFacility(t, 'test2');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-1.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-2.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-3.txt');
  await parentFee.updateFeeFromFile(t, 'facility-parentfee-4.txt');
  await parentFee.updateClosure(t, 'facility-parentfee-closure.txt');
  await parentFee.updateInformation(t, 'facility-parentfee-information.txt');
  await t.expect(parentFee.nextButton.hasAttribute('disabled')).notOk();
  await t.click(parentFee.saveButton).wait(3000);
  await t.expect(alert.success.exists).ok();
  await t.click(parentFee.nextButton);

});

