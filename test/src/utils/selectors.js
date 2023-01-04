import { Selector } from 'testcafe';
const fs = require('fs');
const path = require('path');


function getButton(buttonName) {
  return Selector('button', {timeout: 10000}).child('span').withText(buttonName).parent();
}

function getTextField(labelName) {
  return Selector('label', {timeout: 10000}).withExactText(labelName).nextSibling();
}

function getTextFieldById(idName) {
  return Selector(idName);
}

function getTextFieldWithDivHeading(labelName, heading) {
  return Selector('div', {timeout: 10000}).withExactText(heading).nextSibling().find('label').withExactText(labelName).nextSibling();
}

function getRadioOption(labelName, selectedName) {
  // return Selector('div.v-input--radio-group__input').find('label').withText(labelName).prevSibling().child('input');
  return Selector('legend').withExactText(labelName).nextSibling().find('label').withExactText(selectedName);
}

function getSelectOption(labelName, selectedName) {
  return Selector('label').withText(labelName).nextSibling().find('label').withText(selectedName);
}

async function mapFieldsFromFile(t, fields, fileName, callback) {
  let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
  let lines = data.split('\n');
  let index = 0;
  for (index; index < fields.length; index ++) {
    if (fields[index].heading) {
      const fieldElement = getTextFieldWithDivHeading(fields[index].label, fields[index].heading);
      await t.expect(fieldElement.exists).ok({timeout:50000});
      if(lines[index]=== ""){
        await removeContent(t, fieldElement);
      }else{
        await t.typeText(fieldElement, lines[index], { replace: true });
      }
    } else if (fields[index].radio) {
      if(fields[index].addedField){
        const option = lines[index].split('/')[0];
        const field = lines[index].split('/')[1];
        await t.click(getRadioOption(fields[index].radio, option));
        if(field){
          await t.typeText(getRadioTextField(fields[index].addedField), field, {replace: true});
        }
      }else{
        await t.typeText(fieldElement, lines[index], { replace: true });
      }
    } else if (fields[index].radio) {
      
      await t.click(getRadioOption(fields[index].radio, lines[index]));
    
    } else if (fields[index].select) {
    
      let n = 0;
      let options = lines[index].split(",");

      for (n; n < options.length; n++){
        await t.click(getSelectOption(fields[index].select, options[n]))
      }

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
  getTextFieldById,
  getTextFieldWithDivHeading,
  mapFieldsFromFile,
  getRadioOption,
  getErrorMessage,
  removeContent
};

module.exports = selectors;
