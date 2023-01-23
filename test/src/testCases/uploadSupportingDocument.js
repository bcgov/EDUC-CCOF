import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageSupportingDocument from '../pageObjects/PageSupportingDocument';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const upload = new PageSupportingDocument();
const alert = new PageAlert();
const acceptFile = ["jpg", "jpeg", "png", "pdf", "docx", "doc", "xls", "xlsx", "heic"];
const facilityName = "Test DEV 07 Next Next Fac";


fixture `Upload Support Document`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

  test('Upload Support Document', async t => {
    await login.bceIdLogin(t);
    await t
      .click(landing.continueButton)
      .wait(2000);
    await t.click(upload.supportingDocumentButton).wait(1000);

    for(let i = 0; i < acceptFile.length; i++){
      const fileName = `sample_${acceptFile[i]}.${acceptFile[i]}`;
      await upload.uploadFile(t, facilityName, fileName, true);
      await t.takeScreenshot({fullPage: true});
      await t.click(upload.saveButton).wait(2000);
      await t.takeScreenshot({fullPage: true});
    }
    await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
  });


  // test('Delete Support Document', async t => {
  //     await login.bceIdLogin(t);
  //     await t
  //       .click(landing.continueButton)
  //       .wait(2000);
      
  //     await t.click(upload.supportingDocumentButton).wait(1000);
  //     await upload.deleteFile(t, 'test2', 'sample_jpeg');
  //     await t.click(upload.saveButton);
  //     await t.takeScreenshot({fullPage: true});

  //     await t.takeScreenshot({fullPage: true});
  //     await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
  // });