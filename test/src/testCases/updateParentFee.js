import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageParentFee from '../pageObjects/PageParentFee';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


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
  await parentFee.updateParentFeeFromFile(t, 'test2', 'facility-parentfee.txt')

  await t.expect(parentFee.nextButton.hasAttribute('disabled')).ok();
});

