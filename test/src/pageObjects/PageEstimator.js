import log from "npmlog";
import { Selector } from 'testcafe';
const config = require('../utils/configLoader');
const { getTextFieldById, getButton } = require('../utils/selectors');

class PageEstimator {
  constructor() {
    this.parentBtn = getButton('Parent');
    this.totNumberOfChildren = getTextFieldById('#totNumberOfChildren');
    this.typeOfCareSelector = getTextFieldById('#typeOfCare');
    this.childAgeCategorySelector = getTextFieldById('#childAgeCategory');
    this.parentFeeFrequencySelector = getTextFieldById('#parentFeeFrequency');
    this.fullTimeParentFeeField = getTextFieldById('#approvedFee');
    this.partTimeFeeField = getTextFieldById('#partTimeFee');
    this.estimateYourSavingsBtn = getButton('Estimate your savings');
    this.fourHoursOrLessToSelectList = Selector('div').withAttribute('role', 'option').withExactText('4 hours or less');
    this.moreThanFourToSelectList = Selector('div').withAttribute('role', 'option').withExactText('More than 4 hours');
  }

  async parentSelect(t) {
    await t.click(this.parentBtn)
      .expect(Selector('#totNumberOfChildren').exists).ok({ timeout: 1000 });
  }

  async addChildren(t, value) {
    await t.typeText(this.totNumberOfChildren, value.toString(), { replace: true })
      .expect(this.totNumberOfChildren.value).eql(value.toString());
  }

  async typeOfCare(t, option) {
    const typeOfCareSelect = Selector('div').withAttribute('tabindex', '-1');
    const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
    await t.click(this.typeOfCareSelector)
      .expect(typeOfCareSelect.exists).ok()
      .expect(optionToSelect.exists).ok()
      .click(optionToSelect);
  }

  async childAgeCategory(t, option) {
    const childAgeCategorySelect = Selector('div').withAttribute('tabindex', '-1');
    const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
    await t.click(this.childAgeCategorySelector)
      .expect(childAgeCategorySelect.exists).ok()
      .expect(optionToSelect.exists).ok()
      .click(optionToSelect.withText(option));
  }

  async careSchedule(t, fourOrLess, moreThanFour) {
    const noCareToSelectList = Selector('div').withAttribute('role', 'option').withExactText('No care');
    for (let i = 0; i < 7; i++) {
      const noCareToSelect = noCareToSelectList.nth(i);
      await t.click(noCareToSelect);
    }
    for (let i = 0; i < 7; i++) {
      const noCareToSelect = noCareToSelectList.nth(i);
      await t.click(noCareToSelect);
    }

    const partTimeColumns = fourOrLess;
    for (let i = 0; i < partTimeColumns; i++) {
      const fourHoursOrLessToSelect = this.fourHoursOrLessToSelectList.nth(i);
      await t.click(fourHoursOrLessToSelect);
    }

    const moreThanFourColumns = partTimeColumns + moreThanFour;
    for (let i = partTimeColumns; i < moreThanFourColumns; i++) {
      const moreThanFourToSelect = this.moreThanFourToSelectList.nth(i);
      await t.click(moreThanFourToSelect);
    }
  }

  async parentFeeFrequency(t, option) {
    const parentFeeFrequencySelect = Selector('div').withAttribute('tabindex', '-1');
    const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
    await t.click(this.parentFeeFrequencySelector)
      .expect(parentFeeFrequencySelect.exists).ok()
      .expect(optionToSelect.exists).ok()
      .click(optionToSelect.withText(option));
  }

  async fullTimeParentFee(t, value) {
    await t.typeText(this.fullTimeParentFeeField, value.toString(), { replace: true })
      .expect(this.fullTimeParentFeeField.value).eql(value.toString());
  }

  async partTimeFee(t, value) {
    await t.typeText(this.partTimeFeeField, value.toString(), { replace: true })
      .expect(this.partTimeFeeField.value).eql(value.toString());
  }

  async estimateSavings(t, childCareSavings, parentFeeReduction) {
    log.info('Expected values: ', childCareSavings, parentFeeReduction);

    const savings = Selector('div').withText(childCareSavings);
    log.info (savings.innerText, savings.textContent);

    await t.click(this.estimateYourSavingsBtn)
      .expect(Selector('div').withText(childCareSavings).exists).ok()
      .expect(Selector('div').withText(parentFeeReduction).exists).ok();
  }

}

export default PageEstimator;