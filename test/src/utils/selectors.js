import { Selector } from 'testcafe';
const fs = require('fs');
const path = require('path');


function getButton(buttonName) {
  return Selector('button', {timeout: 10000}).child('span').withExactText(buttonName).parent();
}

function getTextField(labelName) {
  return Selector('label', {timeout: 10000}).withExactText(labelName).nextSibling();
}

function getTextFieldWithDivHeading(labelName, heading) {
  return Selector('div', {timeout: 10000}).withExactText(heading).nextSibling().find('label').withExactText(labelName).nextSibling();
}

function getRadioOption(labelName, selectedName) {
  // return Selector('div.v-input--radio-group__input').find('label').withText(labelName).prevSibling().child('input');
  return Selector('label').withExactText(labelName).nextSibling().find('label').withExactText(selectedName);
}

function getErrorMessage(element, message){
  return element.parent().parent().nextSibling().find('div').withExactText(message);
}

async function removeContent(t, element){
  await t.typeText(element, 'a', { replace: true })
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
  const date_arr = date_data.split('-');
  const date_year = date_arr[0];
  const date_month = date_arr[1];
  const date_day = date_arr[2]; 

  const year_title = Selector('div.v-date-picker-title__year');
  await t.click(year_title);
  const year_option = Selector('ul.v-date-picker-years').find('li').withText(date_year);
  await t.click(year_option);
  const month_option = Selector('div.v-date-picker-table--month').find('div').withText(convertToMonth(date_month));
  await t.click(month_option);
  const day_option = Selector('div.v-date-picker-table--date').find('div').withText(date_day.replace(/^0+/, '')); //remove the leading zero
  await t.click(day_option);
} 

async function mapFieldsFromFile(t, fields, fileName, callback) {
  let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
  let lines =data.split('\n');
  let index = 0;
  for (index; index < fields.length; index ++) {
    if (fields[index].heading) {
      const fieldElement = getTextFieldWithDivHeading(fields[index].label, fields[index].heading);
      await t.expect(fieldElement.exists).ok({timeout:50000});
      if(lines[index]=== ""){
        await removeContent(t, fieldElement);
        await t.expect(await getErrorMessage(fieldElement, 'This field is required').exists || await getErrorMessage(fieldElement, 'A valid postal code is required').exists).ok();
      }else{
        await t.typeText(fieldElement, lines[index], { replace: true });
      }
    } else if (fields[index].radio) {
      if(fields[index].addedField){
        const option = lines[index].split('/')[0];
        const field = lines[index].split('/')[1];
        await t.click(getRadioOption(fields[index].radio, option));
        await t.typeText(getTextField(fields[index].addedField), field, {replace: true});
      }else{
        await t.click(getRadioOption(fields[index].radio, lines[index]));
      }
    } else if (fields[index].date){
      const date_picker = getTextField(fields[index].date);
      await t.click(date_picker);
      await selectDate(t, lines[index]);
    } else {
      const fieldElement = getTextField(fields[index]);
      await t.expect(fieldElement.exists).ok({timeout:50000});
      if(lines[index]=== ""){
        await removeContent(t, fieldElement);
        await t.expect(await getErrorMessage(fieldElement, 'This field is required').exists || await getErrorMessage(fieldElement, 'A valid postal code is required').exists).ok();
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
  getRadioOption
};

module.exports = selectors;
