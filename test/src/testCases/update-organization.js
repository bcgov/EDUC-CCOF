import PageImpersonate from '../pageObjects/PageImpersonate';
import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageOrganization from '../pageObjects/PageOrganization';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const impersonate = new PageImpersonate();
const landing = new PageLanding();
const organization = new PageOrganization();


fixture `Organization Tests`
  .page(`${config.get('url')}/internal`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update Organization - Completed info', async t => {
  await login.idirLogin(t);
  await impersonate.loadUser(t, config.get('bceid_credentials').username);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await organization.updateField(t, 'Mailing Address', '111 sutter street');
  await organization.loadFieldsFromFile(t, 'organization-completed.txt');
  await t.takeScreenshot({fullPage: true});
  await t.expect(organization.nextButton.hasAttribute('disabled')).notOk();
  await t.click(organization.nextButton);
  //Have to test something or the test will fail.
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});

test('Update Organization - Incompleted info', async t => {
  await login.idirLogin(t);
  await impersonate.loadUser(t, config.get('bceid_credentials').username);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await organization.updateField(t, 'Mailing Address', '111 sutter street');
  await organization.loadFieldsFromFile(t, 'organization-incompleted.txt');
  await t.takeScreenshot({fullPage: true});
  await t.expect(organization.nextButton.hasAttribute('disabled')).ok();
  //Have to test something or the test will fail.
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});
