import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageCCFRIOpt from '../pageObjects/PageCCFRIOpt';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const ccfriOpt = new PageCCFRIOpt();
const alert = new PageAlert();

fixture `CCFRI Opt-In Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Opt-in All Test', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(ccfriOpt.CCFRIButton);
  await t.click(ccfriOpt.optButton);
  await t.click(ccfriOpt.optInAllButton);
  await t.takeScreenshot({fullPage: true});
  await t.click(ccfriOpt.saveButton);
  await t.expect(alert.success.exists).ok();
  await t.expect(ccfriOpt.nextButton.hasAttribute('disabled')).notOk();
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});

test('Opt-in Test', async t => {
    await login.bceIdLogin(t);
    await t
      .click(landing.continueButton)
      .wait(2000);
    await t.click(ccfriOpt.CCFRIButton);
    await t.click(ccfriOpt.optButton);
    await ccfriOpt.updateOptFromFile(t,'ccfri-opt.txt');
    await t.takeScreenshot({fullPage: true});
    await t.click(ccfriOpt.saveButton);
    await t.expect(alert.success.exists).ok();
    await t.expect(ccfriOpt.nextButton.hasAttribute('disabled')).notOk();
    await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
  });
