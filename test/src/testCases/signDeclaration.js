import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageDeclaration from '../pageObjects/PageDeclaration';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');


const login = new PageLogin();
const landing = new PageLanding();
const declaration = new PageDeclaration();
const alert = new PageAlert();

fixture `Declaration Test`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Declaration', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(declaration.declarationButton).wait(1000);
  await t.expect(declaration.header.exists).ok({timeout: 5000});
  await t.click(declaration.checkbox);
  await t.typeText(declaration.signField, "Organization Contact");
  await t.click(declaration.submitButton).wait(2000);
  await t.expect(alert.submit.exists).ok();
  await t.expect(declaration.submitButton.hasAttribute('disable')).notOk(); 
})