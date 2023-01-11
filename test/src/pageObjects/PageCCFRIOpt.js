import { Selector } from 'testcafe';
const { getButton } = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageCCFRIOpt {

  constructor() {
    this.CCFRIButton = Selector('div').withExactText('CCFRI');
    this.optButton = Selector('div').withAttribute('id', 'Optin/OptoutMenuBtn').find('a');
    this.optInAllButton = getButton('Opt-in All Facilities');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateOptFromFile(t, fileName){
    const length = await Selector('button').child('span').withText('UPDATE').count;
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
    let lines = data.split('\n');
    let index = 0;
    for(index; index < length; index++){
        await t.click(getButton('UPDATE').nth(0)).wait(1000);
        await t.click(Selector('label').withText(lines[index].trim()).nth(index));
    }
  }
}
export default PageCCFRIOpt;
