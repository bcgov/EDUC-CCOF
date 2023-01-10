import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageOrganization from '../pageObjects/PageOrganization';
import PageAlert from '../pageObjects/PageAlert';
const config = require('../utils/configLoader');

const login = new PageLogin();
const landing = new PageLanding();
const organization = new PageOrganization();
const alert = new PageAlert();

fixture `Input validation Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

//   test('Organization - Input validation', async t => {
//     await login.bceIdLogin(t);
  
//     if(await landing.continueButton.exists){
//       await t
//       .click(landing.continueButton)
//       .wait(2000);
//     }else{
//       await t
//       .click(landing.newButton)
//       .wait(2000);
//       await t.click(landing.groupButton).wait(2000);
//     }
//     await organization.validateAllInput(t);
//     await t.takeScreenshot({fullPage: true});
//     await t.expect(organization.nextButton.hasAttribute('disabled')).ok();
//     await t.click(organization.saveButton).wait(2000);
//     await t.expect(alert.success.exists).ok();
//   });

  test('Organization - Email validation', async t => {
    await login.bceIdLogin(t);
  
    if(await landing.continueButton.exists){
      await t
      .click(landing.continueButton)
      .wait(2000);
    }else{
      await t
      .click(landing.newButton)
      .wait(2000);
      await t.click(landing.groupButton).wait(2000);
    }
    await organization.validateOneInput(t, 'E-mail Address of Signing Authority', 'text', 'A valid email is required');
    await organization.validateOneInput(t, 'E-mail Address of Signing Authority', '123', 'A valid email is required');
    //await organization.validateOneInput(t, 'E-mail Address of Signing Authority', 'text123@gmail.com@gmail.com', 'A valid email is required');
    await t.takeScreenshot({fullPage: true});
    await t.expect(organization.nextButton.hasAttribute('disabled')).ok();
    await t.click(organization.saveButton).wait(2000);
    await t.expect(alert.success.exists).ok();
  });

