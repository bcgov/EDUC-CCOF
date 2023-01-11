import { Selector } from 'testcafe';
const { getButton } = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class PageCCFRIOpt {

  constructor() {
    this.CCFRIButton = Selector('div').withExactText('CCFRI');
    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateParentFeeFromFile(t, facilityName, fileName){
    const facilityButton = Selector('div').withText('Parent Fee').nextSibling().withExactText(facilityName);
    await t.click(facilityButton);
  }
}
export default PageCCFRIOpt;