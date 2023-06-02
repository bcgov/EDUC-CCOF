import { Selector } from 'testcafe';
const config = require('../utils/configLoader');
const { getTextFieldById, mapFieldsFromFile, getButton } = require('../utils/selectors');

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
      }

      async parentSelect (t) {
        await t.click(this.parentBtn)
        .expect(Selector('#totNumberOfChildren').exists).ok({ timeout: 1000 });
      }

      async addChildren (t, value) {
        await t.typeText(this.totNumberOfChildren, value.toString(), {replace: true})
        .expect(this.totNumberOfChildren.value).eql(value.toString());
      }

      async typeOfCare (t, option) {
        const typeOfCareSelect = Selector('#list-39');
        const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
        await t.click(this.typeOfCareSelector)
        .expect(typeOfCareSelect.exists).ok()
        .expect(optionToSelect.exists).ok()
        .click(optionToSelect);
      }
      
      async childAgeCategory (t, option) {
        const childAgeCategorySelect = Selector('#list-62');
        const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
        await t.click(this.childAgeCategorySelector)
        .expect(childAgeCategorySelect.exists).ok()
        .expect(optionToSelect.exists).ok()
        .click(optionToSelect.withText(option));
      }

      async parentFeeFrequency (t, option) {
        const parentFeeFrequencySelect = Selector('#list-138');
        const optionToSelect = Selector('div').withAttribute('role', 'option').withExactText(option)
        await t.click(this.parentFeeFrequencySelector)
              .expect(parentFeeFrequencySelect.exists).ok()
              .expect(optionToSelect.exists).ok()
              .click(optionToSelect.withText(option));
      }

      async fullTimeParentFee (t, value) {
        await t.typeText(this.fullTimeParentFeeField, value.toString(), {replace: true})
        .expect(this.fullTimeParentFeeField.value).eql(value.toString());
      }

      async partTimeFee (t, value) {
        await t.typeText(this.partTimeFeeField, value.toString(), {replace: true})
        .expect(this.partTimeFeeField.value).eql(value.toString());
      }

      async estiamteSavings (t) {
        await t.click(this.estimateYourSavingsBtn)
        .expect(Selector('div').withExactText('$0/month')).ok({ timeout: 1000 })
        .expect(Selector('div').withExactText('$500/month')).ok({ timeout: 1000 });
      }
}

export default PageEstimator;