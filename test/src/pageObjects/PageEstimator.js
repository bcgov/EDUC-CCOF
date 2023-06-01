import log from "npmlog";
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

      async careSchedule (t, noCare, fourOrLess, moreThanFour) {
        const calendarTable = Selector('div').withAttribute('role', 'list');
        const noCareToSelectList = Selector('div').withAttribute('role', 'option').withExactText('No care');
        const fourHoursOrLessToSelectList = Selector('div').withAttribute('role', 'option').withExactText('4 hours or less');
        const moreThanFourToSelectList = Selector('div').withAttribute('role', 'option').withExactText('More than 4 hours');
        await t.expect(calendarTable.count).eql(7)
              .expect(noCareToSelectList.count).eql(7);

        const noCareColumns = noCare;
        for (let i = 0; i < noCareColumns; i++) {
          log.info(i, ' number of passes for no care.')
          const noCareToSelect = noCareToSelectList.nth(i);
          await t.click(noCareToSelect);
        }

        const addPartTimeColumns = noCare+fourOrLess;
        for (let i = noCare; i < addPartTimeColumns; i++) {
          log.info(i, ' number of passes for less than 4');
          const fourHoursOrLessToSelect = fourHoursOrLessToSelectList.nth(i);
          await t.click(fourHoursOrLessToSelect);
        }

        const addMoreThanFourColumns = addPartTimeColumns+moreThanFour;
        for (let i = addPartTimeColumns ; i < addMoreThanFourColumns; i++) {
          log.info(i, ' number of passes for More than 4.');
          const moreThanFourToSelect = moreThanFourToSelectList.nth(i);
          await t.click(moreThanFourToSelect);
        }
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

      async estiamteSavings (t, childCareSavings, parentFeeReduction) {
        await t.click(this.estimateYourSavingsBtn)
        .expect(Selector('div').withExactText(childCareSavings)).ok({ timeout: 1000 })
        .expect(Selector('div').withExactText(parentFeeReduction)).ok({ timeout: 1000 });
      }

      async fullTimeParentFee (t, value) {
        await t.typeText(this.fullTimeParentFeeField, value.toString(), {replace: true})
        .expect(this.fullTimeParentFeeField.value).eql('1000');
      }

      async partTimeFee (t, value) {
        await t.typeText(this.partTimeFeeField, value.toString(), {replace: true})
        .expect(this.partTimeFeeField.value).eql('500');
      }
}

export default PageEstimator;