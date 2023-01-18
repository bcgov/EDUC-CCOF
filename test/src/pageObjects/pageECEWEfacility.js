import { findSourceMap } from 'module';
import { Selector } from 'testcafe';
const {getButton} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');

class pageECEWEfacility {

    constructor() {
      this.ECEWEButton = Selector('div').withExactText('ECE-WE');
      this.facilityButton = Selector('div').withExactText('Facility');
      this.backButton = getButton('Back');
      this.nextButton = getButton('Next');
      this.saveButton = getButton('Save');
    }
  
    async updateOptFromFile(t, fileName){
        let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
        let lines = data.split('\n');
        const length = lines.length;
        for(let index = 0; index < length; index++){
          if(await getButton('Update').exists){
            await t.click(Selector('button', {timeout: 10000}).child('span').withText('Update').nth(index).parent()).wait(1000);
            await t.click(Selector('label').withText(lines[index].trim()).nth(0)).wait(1000);
          }else{
            await t.click(Selector('label').withText(lines[index].trim()).nth(index));
          }
        }
      }
  }
  export default pageECEWEfacility;