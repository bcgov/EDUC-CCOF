import {Selector} from 'testcafe';
import log from 'npmlog';

const {getButton} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageCCFRIOpt {

  constructor() {
    this.CCFRIButton = Selector('div').withExactText('CCFRI');
    this.optButton = Selector('div').withAttribute('id', 'Optin/OptoutMenuBtn').find('a');
    this.optInAllButton = getButton('Opt in All Facilities');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateOptFromFile(t, fileName) {
    const length = await Selector('button').child('span').withText('UPDATE').count;
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    let index = 0;
    for (index; index < length; index++) {
      await t.click(getButton('UPDATE').nth(0)).wait(1000);
      await t.click(Selector('label').withText(lines[index].trim()).nth(index));
    }
  }

  async clickOptInForAllFacilities(t) {
    await t.click(this.optInAllButton);
    log.info('CCFRI opt in for all facilities clicked');
  }

  async clickSaveButton(t) {
    await t.click(this.saveButton).wait(3000);
    log.info('Save button clicked');
    await t.expect(alert.success.exists).ok();
    log.info('Save Successful clicked');
  }

  async clickBackButton(t) {
    await t.click(this.backButton);
    log.info('Back button clicked');
  }

  async clickNextButton(t) {
    await t.click(this.nextButton);
    log.info('Next button clicked');
  }

  async clickSaveAndNextButton(t) {
    this.clickSaveButton(t);
    this.clickNextButton(t);
  }

  async nextButtonIsDisabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).ok();
    log.info('Next button is disabled');
  }

  async nextButtonIsEnabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).notOk();
    log.info('Next button is enabled');
  }
}

export default PageCCFRIOpt;
