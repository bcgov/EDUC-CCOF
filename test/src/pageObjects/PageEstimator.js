import { Selector } from 'testcafe';
import log from "npmlog";
const config = require('../utils/configLoader');
const { getTextFieldById, mapFieldsFromFile, getButton } = require('../utils/selectors');

class PageEstimator {
    constructor() {
        this.parentBtn = getButton('Parent');
        this.totNumberOfChildren = getTextFieldById('#totNumberOfChildren');
        this.fullTimeParentFeeField = getTextFieldById('#approvedFee');
        this.partTimeFeeField = getTextFieldById('#partTimeFee');
      }

      async parentSelect (t) {
        await t.click(this.parentBtn)
        .expect(Selector('#totNumberOfChildren').exists).ok({ timeout: 1000 });
      }

      async addChildren (t, value) {
        await t.typeText(this.totNumberOfChildren, value.toString(), {replace: true})
        .expect(this.totNumberOfChildren.value).eql('2');
      }

      async typeOfCare (t, option) {
        const typeOfCare = Selector('#typeOfCare');
        const typeOfCareSelect = Selector('#list-39');
        await t.click(typeOfCare).wait(10000)
        .expect(typeOfCareSelect.exists).ok();
      }
      
      async childAgeCategory (t, option) {
        const childAgeCategory = Selector('#childAgeCategory');
        const childAgeCategorySelect = Selector('#list-62');
        await t.click(childAgeCategory).wait(1000)
        .expect(childAgeCategorySelect.exists).ok();
      }

      async parentFeeFrequency (t, option) {
        const parentFeeFrequency = Selector('#parentFeeFrequency');
        const parentFeeFrequencySelect = Selector('#list-138');
        await t.click(parentFeeFrequency).wait(1000)
              .expect(parentFeeFrequencySelect.exists).ok();
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