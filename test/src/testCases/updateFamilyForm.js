import PageLogin from '../pageObjects/PageLogin';
import PageLanding from '../pageObjects/PageLanding';
import PageFamilyForm from '../pageObjects/PageFamilyForm';
import PageAlert from '../pageObjects/PageAlert';

const config = require('../utils/configLoader');
import { Selector } from 'testcafe';


const login = new PageLogin();
const landing = new PageLanding();
const family = new PageFamilyForm();
const alert = new PageAlert();


fixture `Family Form Tests`
  .page(`${config.get('url')}/login`)
  .beforeEach(async t => {
    await t.maximizeWindow();
    await t.setTestSpeed(1);
  });

test('Update Family Form - Completed info', async t => {
  await login.bceIdLogin(t);
  
  if(await landing.continueButton.exists){
    await t
    .click(landing.continueButton)
    .wait(2000);
  }else{
    await t
    .click(landing.newButton)
    .wait(2000);
    await t.click(landing.familyButton).wait(2000);
  }
  
  await family.updateField(t, 'Mailing Address', '111 sutter street');
  await family.loadFieldsFromFile(t, 'family-completed.txt');
  await t.takeScreenshot({fullPage: true});
  await t.expect(family.nextButton.hasAttribute('disabled')).notOk();
  await t.click(family.saveButton).wait(2000);
  await t.expect(alert.success.exists).ok();
  await t.click(family.nextButton);
  await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
});

test('Update Family Form - Incompleted info', async t => {
    await login.bceIdLogin(t);
    
    if(await landing.continueButton.exists){
      await t
      .click(landing.continueButton)
      .wait(2000);
    }else{
      await t
      .click(landing.newButton)
      .wait(2000);
      await t.click(landing.familyButton).wait(2000);
    }
    
    await family.updateField(t, 'Mailing Address', '111 sutter street');
    await family.loadFieldsFromFile(t, 'family-incompleted.txt');
    await t.takeScreenshot({fullPage: true});
    await t.expect(family.nextButton.hasAttribute('disabled')).ok();
    await t.click(family.saveButton).wait(2000);
    await t.expect(alert.success.exists).ok();
    await t.expect(Selector('.v-system-bar').exists).ok({ timeout: 5000 });
  });