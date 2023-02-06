import {Selector} from 'testcafe';
import log from 'npmlog';

const {getButton, getRadioOption, getTextField, selectDate} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageCCFRIOpt {

  constructor() {
    this.CCFRIButton = Selector('div').withExactText('CCFRI');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async chooseFacility(t, facilityName) {
    const facilityButton = Selector('div').withText('Parent Fee').nextSibling().withExactText(facilityName);
    await t.click(facilityButton);
    await t.expect(Selector('p').withText(`Facility Name: ${facilityName}`).exists).ok();
  }

  async updateFeeFromFile(t, fileName) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    const year = lines[0].trim().toString();
    const type = lines[1].trim().toString();
    const category = lines[2].trim().toString();
    const feeFrequency = lines[3].trim().toString();
    const feeFrequencyLabel = feeFrequency.toLowerCase();
    log.info('Fee Frequency', feeFrequencyLabel);
    const header = Selector('p').withText(`Parent Fees ${year} FY: ${type} ${category}`);
    await t.expect(header.exists).ok();
    await t.click(header.parent().nextSibling().find('label').withExactText(feeFrequency));
    await t.expect(header.parent().nextSibling().find('label').withText(`Enter your highest ${feeFrequencyLabel} parent fee before CCFRI is applied in every month below. If you do not charge a parent fee (e.g. if the facility is closed) enter zero.`).exists).ok();

    for (let i = 4; i < lines.length; i++) {
      if (lines[i].split(':')[0] && lines[i].split(':')[1]) {
        const month = lines[i].split(':')[0].trim();
        const fee = lines[i].split(':')[1].trim();
        await t.typeText(header.parent().nextSibling().find('label').withExactText(month).nextSibling().nextSibling(), fee, {replace: true});

      }

    }
  }

  async updateClosure(t, fileName) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    const option = lines[0].trim().toString();
    await t.click(getRadioOption('Do you charge parent fees at this facility for any closures on business days? Indicate the facility closures on business days within the current fiscal year other than British Columbia statutory holidays. Only indicate the date of closures where parent fees are charged.', option));

    if (option === 'Yes') {
      for (let i = 1; i < lines.length; i += 4) {
        if (lines[i]) {
          await t.click(getButton('ADD NEW CLOSURE'));
          const index = Math.floor(i / 4);
          const startDate = getTextField('Select Start Date (YYYY-MM-DD)').nth(index);
          await t.click(startDate, {offsetX: -5}).wait(1000);
          await selectDate(t, lines[i]);
          const endDate = getTextField('Select End Date (YYYY-MM-DD)').nth(index);
          await t.click(endDate, {offsetX: -5}).wait(1000);
          await selectDate(t, lines[i + 1]);
          await t.typeText(getTextField('Closure Reason').nth(index), lines[i + 2]);
          await t.click(getRadioOption('Did parents pay for this closure?', lines[i + 3].trim()).nth(index));

        }
      }
    }
  }

  async updateInformation(t, fileName) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    const box = getTextField('Describe here');
    await t.typeText(box, data);
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
