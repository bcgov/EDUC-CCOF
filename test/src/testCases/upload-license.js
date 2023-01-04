import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageUploadLicense from '../pageObjects/PageUploadLicense';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const upload = new PageUploadLicense();


fixture `Facility Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Upload License', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(upload.licenseUploadButton);
  await t.click(upload.noButton);
  await t.expect(upload.header.exists).ok({timeout: 5000});
  const facilities = Selector('input').withAttribute('placeholder', 'Select your file');
  const length = await facilities.count;
  let index = 0;
  for(index; index < length; index++){
    await t.click(Selector('div').withExactText('Select your file').nth(index));
    await upload.uploadFiles(t, facilities.nth(index), 'Community Care Licence.png');
  }
  await t.click(upload.saveButton);
  await t.takeScreenshot({fullPage: true});
  await t.expect(upload.nextButton.hasAttribute('disabled')).notOk(); // This will fail if the next button is disable

  await t.takeScreenshot({fullPage: true});
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});


test('Delete License', async t => {
    await login.bceIdLogin(t);
    await t
      .click(landing.continueButton)
      .wait(2000);
    await t.click(upload.licenseUploadButton);
    await t.click(upload.noButton);
    await t.expect(upload.header.exists).ok({timeout: 5000});
    
    const length = await Selector('.mdi-delete').count;
    let index = 0;
    for(index; index < length; index++){
      await t.click(Selector('.mdi-delete').nth(0));
      const facilities = Selector('input').withAttribute('placeholder', 'Select your file');
      const length = await facilities.count;
      await t.expect(length).eql(index + 1);
    }
    await t.click(upload.saveButton);
    await t.takeScreenshot({fullPage: true});
    await t.expect(upload.nextButton.hasAttribute('disabled')).ok(); // This will fail if the next button is not disable
  
    await t.takeScreenshot({fullPage: true});
    await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
  });