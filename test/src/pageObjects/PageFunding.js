const { getTextField, mapFieldsFromFile, getButton } = require('../utils/selectors');

class PageFunding {

  constructor() {
    this.fieldNames = [
      'Maximum number of days per week you provide child care',
      'Maximum of weeks per year you provide child care',
      { radio: 'Are there months when ALL of the programs at this facility are closed for the entire month?'},
      { select: 'If YES, check all the applicable months:'},
      'Facility hours of operation From',
      'Facility hours of operation To',
      'Maximum Licensed Capacity',
      'Maximum Number for Group Child Care (under 36 months)',
      'Maximum Number for Group Child Care (36 months to School Age)',
      'Maximum Number for Preschool',
      'Maximum Number for Group Child Care (School Age/ School Age care on School Grounds)',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
      { radio: 'Is the facility located on school Property?'},
      { select: 'Please indicate each service that your facility offers'},
      { radio: 'Do you regularly offer extended daily hours of child care (before 6 am, after 7pm or overnight)?'},
      'Maximum number of days per week you offer extended hours of child care?',
      'Maximum number of weeks per year you offer extended hours of child care?',
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
}

export default PageFunding;