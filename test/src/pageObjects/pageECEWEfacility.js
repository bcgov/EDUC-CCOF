import {findSourceMap} from 'module';
import {Selector} from 'testcafe';
import log from 'npmlog';

const {getButton} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageECEWEfacility {

  constructor() {
    this.ECEWEButton = Selector('div').withExactText('ECE-WE');
    this.facilityButton = Selector('div').withExactText('Facility');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateOptFromFile(t, fileName) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    const length = lines.length;
    for (let index = 0; index < length; index++) {
      if (await getButton('Update').exists) {
        await t.click(Selector('button', {timeout: 10000}).child('span').withText('Update').nth(index).parent()).wait(1000);
        await t.click(Selector('label').withText(lines[index].trim()).nth(0)).wait(1000);
      } else {
        await t.click(Selector('label').withText(lines[index].trim()).nth(index));
      }
    }
  }

  async clickSaveButton(t) {
    await t.click(this.saveButton).wait(3000);
    log.info('Save button clicked');

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

export default PageECEWEfacility;
