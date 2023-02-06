import { Selector } from 'testcafe';
import log from 'npmlog';
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

  async clickBackButton(t) {
    await t.click(this.backButton);
    log.info('Back button clicked');
  }

  async clickDeclarationCheckBox(t) {
    await t.click(this.checkbox);
    log.info('Declaration Checkbox clicked');

  }

  async singDeclaration(t,signatureText) {
    await t.typeText(this.signField, signatureText);
    log.info('Declaration Signature Entered');
  }

  async clickSubmitButton(t) {
    await t.click(this.submitButton).wait(2000);
    log.info('Declaration Submit Button Clicked');
  }

  async submitButtonIsDisabled(t) {
    await t.expect(this.submitButton.hasAttribute('disabled')).ok();
    log.info('Next button is disabled');
  }

  async submitButtonIsEnabled(t) {
    await t.expect(this.submitButton.hasAttribute('disabled')).notOk();
    log.info('Next button is enabled');
  }


}
export default PageDeclaration;
