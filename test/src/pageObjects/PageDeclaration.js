import { Selector } from 'testcafe';
const { getButton, getTextField } = require('../utils/selectors');


class PageDeclaration {

  constructor() {
    this.signField = getTextField('Organization Contact Name/Digital signature (wording to be provided).');
    this.declarationButton = Selector('div', {timeout: 10000}).withExactText('Declaration');
    this.backButton = getButton('Back');
    this.submitButton = getButton('Submit');
    this.header = Selector('span').withText('Declaration');
    this.checkbox = Selector('input').withAttribute('role', 'checkbox');
  }
}
export default PageDeclaration;
