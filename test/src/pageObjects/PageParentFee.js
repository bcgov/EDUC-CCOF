import { Selector } from 'testcafe';
const { getButton, getRadioOption, getTextField, selectDate } = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageCCFRIOpt {

  constructor() {
    this.CCFRIButton = Selector('div').withExactText('CCFRI');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async chooseFacility(t, facilityName){
    const facilityButton = Selector('div').withText('Parent Fee').nextSibling().withExactText(facilityName);
    await t.click(facilityButton);
    await t.expect(Selector('p').withText(`Facility Name: ${facilityName}`).exists).ok();
  }

  async updateFeeFromFile(t, fileName){
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    const year = lines[0].trim().toString();
    const type = lines[1].trim().toString();
    const category = lines[2].trim().toString();
    const feeFrequency = lines[3].trim().toString();
    const header = Selector('p').withText(`Parent Fees ${year} FY: ${type} ${category}`);
    await t.expect(header.exists).ok();
    await t.click(header.parent().nextSibling().find('label').withExactText(feeFrequency));
    await t.expect(header.parent().nextSibling().find('label').withText(`Enter your highest full-time ${feeFrequency} fee in every month below. If you do not charge a fee (e.g. if the facility is closed) enter zero.`).exists).ok();
  
    for(let i = 4; i < lines.length; i++){
      const month = lines[i].split(":")[0].trim();
      const fee = lines[i].split(":")[1].trim();
      await t.typeText(header.parent().nextSibling().find('label').withExactText(month).nextSibling().nextSibling(), fee, {replace: true});
    }
  }

  async updateClosure(t, fileName){
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    const option = lines[0].trim().toString();
    await t.click(getRadioOption('Do you charge parent fees at this facility for any closures on business days (other than statuary holidays)?', option));
    
    if(option === 'Yes'){
      for(let i = 1; i < lines.length; i+=4){
        await t.click(getButton('ADD NEW CLOSURE'));
        const index = Math.floor(i /4);
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

  async updateInformation(t, fileName){
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    const box = getTextField('Describe here');
    await t.typeText(box, data);
  }
}
export default PageCCFRIOpt;