
import PageImpersonate from '../pageObjects/PageImpersonate';
import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageOrganization from '../pageObjects/PageOrganization';
import PageFunding from '../pageObjects/PageFunding';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const impersonate = new PageImpersonate();
const landing = new PageLanding();
const organization = new PageOrganization();
const funding = new PageFunding();

fixture `Organization Tests`
  .page(`${config.get('url')}/internal`)
  .beforeEach(async t => {
    await t.setTestSpeed(1);
  });

test('Update Organization', async t => {
  await login.idirLogin(t);
  await impersonate.loadUser(t, 'rlo');
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(organization.nextButton)
    .wait(5000)
  
  await t.click(organization.nextButton)
    .wait(5000)
  await funding.loadFieldsFromFile(t, 'test1-funding.txt');
  await t.takeScreenshot({fullPage: true});
  //Have to test something or the test will fail.
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});