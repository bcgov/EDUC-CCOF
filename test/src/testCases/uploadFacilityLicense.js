import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageUploadLicense from '../pageObjects/PageUploadLicense';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const upload = new PageUploadLicense();

const acceptFile = ["docx", "doc", "xls", "xlsx", "heic"];
const facilityName = "test2";


fixture `Upload License Tests`
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
  // await t.click(upload.noButton);
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

test('Test file type', async t => {
  await login.bceIdLogin(t);
  await t
    .click(landing.continueButton)
    .wait(2000);
  await t.click(upload.licenseUploadButton).wait(2000);
  await t.expect(upload.header.exists).ok({timeout: 5000});
  const facility = Selector('td').withText(facilityName).parent(0);
  const facilityInput = facility.find('input').withAttribute('placeholder', 'Select your file');
  const deleteIcon = facility.find('i.mdi-delete').filterVisible();
  for(let i = 0; i < acceptFile.length; i++){
    if(await facility.find('i.mdi-delete').filterVisible().exists){
      await t.click(deleteIcon);
    }
    await t.click(facility.find('div').withExactText('Select your file'));
    const fileName = `sample_${acceptFile[i]}.${acceptFile[i]}`;
    await upload.uploadFiles(t, facilityInput, fileName);
    await t.takeScreenshot({fullPage: true});
    await t.click(upload.saveButton);
    await t.takeScreenshot({fullPage: true});
  }
})

test('Delete License', async t => {
    await login.bceIdLogin(t);
    await t
      .click(landing.continueButton)
      .wait(2000);
    await t.click(upload.licenseUploadButton);
    // await t.click(upload.noButton);
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