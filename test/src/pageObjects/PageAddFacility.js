const {mapFieldsFromFile, getButton} = require('../utils/selectors');


class PageAddFacility {

  constructor() {
    this.fieldNames = [
      'Do you want to add another facility?',
    ];

    this.backButton = getButton('Back');
    this.yesButton = getButton('Yes');
    this.noButton = getButton('No');

  }

  async clickYesToAddFacility(t) {
    await t.click(this.yesButton);
  }

  async clickNoToAddFacility(t) {
    await t.click(this.noButton);
  }

  async loadFieldsFromFile(t, fileName) {
    await mapFieldsFromFile(t, this.fieldNames, fileName);
  }
}

export default PageAddFacility;
