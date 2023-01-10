const { getTextField, mapFieldsFromFile, getButton, getTextFieldWithDivHeading, removeContent, getErrorMessage } = require('../utils/selectors');


class PageOrganization {

  constructor() {
    this.fieldNames = [
      'Legal Name (first, middle and last) or Organization (as it appears in BC corporate Registry)',
      { heading: 'Organization Mailing Address', label: 'Mailing Address' },
      { heading: 'Organization Mailing Address', label: 'City/Town' },
      { heading: 'Organization Mailing Address', label: 'Postal Code' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Street Address' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'City/Town' },
      { heading: 'Organization Street Address, if different from the Mailing Address (Optional)', label: 'Postal Code' },
      'Organization Contact Name',
      'Position',
      'Business Phone',
      'E-mail Address of Signing Authority',
      'Incorporation Number (as it appears in BC Corporate Registry)',
      { radio: 'Type of Orgnization'} //TODO fix spelling
    ];

    this.backButton = getButton('Back');
    this.nextButton = getButton('Next');
    this.saveButton = getButton('Save');
  }

  async updateField(t, fieldLabel, value) {
    await t.typeText(getTextField(fieldLabel), value, { replace: true });
  }

  async loadFieldsFromFile(t, fileName) {
    await mapFieldsFromFile(t, this.fieldNames, fileName);
  }

  async validateAllInput(t){
    let i = 0;
    for(i; i < this.fieldNames.length; i++){
      let fieldElement = null;
      if(this.fieldNames[i].radio){
        continue;
      }else if(this.fieldNames[i].heading){
        if(this.fieldNames[i].heading.toLowerCase().includes("optional")){
          continue;
        }
        fieldElement = getTextFieldWithDivHeading(this.fieldNames[i].label, this.fieldNames[i].heading);
      }else{
        fieldElement = getTextField(this.fieldNames[i])
      }
      await removeContent(t, fieldElement);
      await t.expect(await getErrorMessage(fieldElement, 'This field is required').exists).ok();
    }
  }

  async validateOneInput(t, fieldLabel, value, message){
    const fieldElement = getTextField(fieldLabel);
    await removeContent(t, fieldElement);
    await t.typeText(fieldElement, value, { replace: true });
    await t.expect(await getErrorMessage(fieldElement, message).exists).ok();
  }
}
export default PageOrganization;
