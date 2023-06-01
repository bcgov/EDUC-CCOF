import { Selector } from 'testcafe';
import log from "npmlog";
const config = require('../utils/configLoader');
const { getTextFieldById, mapFieldsFromFile, getButton } = require('../utils/selectors');

class PageEstimator {
    constructor() {
        this.parentBtn = getButton('Parent');
        this.totNumberOfChildren = getTextFieldById('#totNumberOfChildren');
        //this.typeOfCare = getTextFieldById('#typeOfCare');
        //this.parentFeeFrequency = Selector('#parentFeeFrequency');
      }

      async parentSelect (t) {
        await t.click(this.parentBtn)
        .expect(Selector('#totNumberOfChildren').exists).ok({ timeout: 10000 });
      }

      async addChildren (t, value) {
        await t.typeText(this.totNumberOfChildren, value.toString(), {replace: true})
        .expect(this.totNumberOfChildren.value).eql('2');
      }

      async typeOfCare (t, option) {
        const typeOfCare = Selector('#typeOfCare');
        const typeOfCareSelect = Selector('#list-39');
        await t.click(typeOfCare).wait(1000)
        .expect(typeOfCareSelect.exists).ok();
      }
      
      async childAgeCategory (t, option) {
        const childAgeCategory = Selector('#typeOfCare');
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
}

export default PageEstimator;