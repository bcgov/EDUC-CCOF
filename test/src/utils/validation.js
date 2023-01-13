const { getTextField, getTextFieldWithDivHeading, removeContent, getErrorMessage } = require('./selectors');


async function validateAllInput(t, fieldNames){
    for(let i = 0; i < fieldNames.length; i++){
      let fieldElement = null;
      if(fieldNames[i].radio){
        continue;
      }else if(fieldNames[i].heading){
        if(fieldNames[i].heading.toLowerCase().includes("optional")){
          continue;
        }
        fieldElement = getTextFieldWithDivHeading(fieldNames[i].label, fieldNames[i].heading);
      }else{
        fieldElement = getTextField(fieldNames[i])
      }
      await removeContent(t, fieldElement);
      await t.expect(await getErrorMessage(fieldElement, 'This field is required').exists).ok();
    }
}

async function validateOneInput(t, fieldLabel, value, message){
    const fieldElement = getTextField(fieldLabel);
    await removeContent(t, fieldElement);
    await t.typeText(fieldElement, value, { replace: true });
    await t.expect(await getErrorMessage(fieldElement, message).exists).ok();
}

const validations = {
    validateAllInput,
    validateOneInput
};
  
module.exports = validations;