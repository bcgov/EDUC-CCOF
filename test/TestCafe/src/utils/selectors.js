import { Selector } from 'testcafe';
const fs = require('fs');
const path = require('path');


function getButton(buttonName) {
  return Selector('button', {timeout: 10000}).child('span').withText(buttonName).parent();
}

function getTextField(labelName) {
  return Selector('label', {timeout: 10000}).withText(labelName).nextSibling();
}

function getTextFieldWithDivHeading(labelName, heading) {
  return Selector('div', {timeout: 10000}).withText(heading).nextSibling().find('label').withText(labelName).nextSibling();
}

function getRadioOption(labelName, selectedName) {
  // return Selector('div.v-input--radio-group__input').find('label').withText(labelName).prevSibling().child('input');
  return Selector('label').withText(labelName).nextSibling().find('label').withText(selectedName);
}

async function mapFieldsFromFile(t, fields, fileName, callback) {
  let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
  let lines =data.split('\n').filter(Boolean);
  let index = 0;
  for (index; index < fields.length; index ++) {
    if (fields[index].heading) {
      await t.typeText(getTextFieldWithDivHeading(fields[index].label, fields[index].heading), lines[index], { replace: true });
    } else if (fields[index].radio) {
      await t.click(getRadioOption(fields[index].radio, lines[index]));
    } else {
      await t.typeText(getTextField(fields[index]), lines[index], { replace: true });
    }
  }
  if (typeof callback == 'function') {
    console.log('calling callback');
    callback(index, lines);
  }
}

const selectors = {
  getButton,
  getTextField,
  getTextFieldWithDivHeading,
  mapFieldsFromFile,
  getRadioOption
};

module.exports = selectors;
