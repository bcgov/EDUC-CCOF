import { Selector } from 'testcafe';
const fs = require('fs');
const path = require('path');


function getButton(buttonName) {
  return Selector('button', {timeout: 10000}).child('span').withText(buttonName).parent();
}

function getTextField(labelName) {
  return Selector('label', {timeout: 10000}).withExactText(labelName).nextSibling();
}

function getTextFieldWithDivHeading(labelName, heading) {
  return Selector('div', {timeout: 10000}).withExactText(heading).nextSibling().find('label').withExactText(labelName).nextSibling();
}

function getRadioOption(labelName, selectedName) {
  // return Selector('div.v-input--radio-group__input').find('label').withText(labelName).prevSibling().child('input');
  return Selector('legend').withExactText(labelName).nextSibling().find('label').withExactText(selectedName);
}


function getRadioTextField(fieldName){
  return Selector('div.v-input--radio-group').parent().parent().nextSibling().find('label').withExactText(fieldName).nextSibling();
}

function getErrorMessage(element, message){
  return element.parent().parent().nextSibling().find('div').withExactText(message);
}

async function removeContent(t, element){
  await t.typeText(element, 'a', { replace: true, speed:0.5 })
          .pressKey('backspace');
}

function convertToMonth(date_month){
  let month = ""
  switch (date_month) {
    case "01":
      month = "Jan";
      break;
    case "02":
      month = "Feb";
      break;
    case "03":
      month = "Mar";
      break;
    case "04":
      month = "Apr";
      break;
    case "05":
      month = "May";
      break;
    case "06":
      month = "Jun";
      break;
    case "07":
      month = "Jul";
      break;
    case "08":
      month = "Aug";
      break;
    case "09":
      month = "Sep";
      break;
    case "10":
      month = "Oct";
      break;
    case "11":
      month = "Nov";
      break;
    case "12":
      month = "Dec"
      break;
  }
  return month;
}

async function selectDate(t, date_data){
  const date_arr = date_data.trim().split('-');
  const date_year = date_arr[0];
  const date_month = date_arr[1];
  const date_day = date_arr[2]; 

  const year_title = Selector('div.v-date-picker-title__year').filterVisible();
  await t.click(year_title);
  const year_option = Selector('ul.v-date-picker-years').find('li').withText(date_year).filterVisible();
  await t.click(year_option);
  const month_option = Selector('div.v-date-picker-table--month').find('div').withText(convertToMonth(date_month)).filterVisible();
  await t.click(month_option);
  const day_option = Selector('div.v-date-picker-table--date').find('div').withText(date_day.replace(/^0+/, '')).filterVisible(); //remove the leading zero
  await t.click(day_option);
} 


function getSelectOption(labelName, selectedName) {
  return Selector('label').withText(labelName).parent().parent().nextSibling().find('label').withText(selectedName).prevSibling();
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
        await t.click(getRadioOption(fields[index].radio, lines[index]));
      }
    } else if (fields[index].date){
      const date_picker = getTextField(fields[index].date);
      await t.click(date_picker).wait(1000);
      await selectDate(t, lines[index]);
    } else if (fields[index].select) {
      let n = 0;
      let options = lines[index].split(",");

      for (n; n < options.length; n++){
        await t.click(getSelectOption(fields[index].select, options[n]));
      }
    } else {
      const fieldElement = getTextField(fields[index]);
      await t.expect(fieldElement.exists).ok({timeout:50000});
      if(lines[index]=== ""){
        await removeContent(t, fieldElement);
      }else{
        await t.typeText(fieldElement, lines[index], { replace: true });
      }
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
  getRadioOption,
  getErrorMessage,
  removeContent,
  selectDate
};

module.exports = selectors;
