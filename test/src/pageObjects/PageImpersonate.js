import { Selector} from 'testcafe';
const { getButton } = require('../utils/selectors');

class PageImpersonate {
  constructor() {
    this.bceidField = Selector('#businessBCeId-field');
    this.searchButton = getButton('Search');
  }

  async loadUser(t, bceidUsername) {
    await t
      .typeText(this.bceidField, bceidUsername)
      .click(this.searchButton);
  }
}
export default PageImpersonate;
