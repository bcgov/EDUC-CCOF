import { Selector } from 'testcafe';
const {getRadioOption, getButton} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');
const optionList = ["All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding.", 
                    "All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.",
                    "Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding."
                    ]


class pageECEWEEligibility {

    constructor() {
      this.ECEWEButton = Selector('div').withExactText('ECE-WE');
      this.eligibilityButton = Selector('div').withExactText('Eligibility');
      this.backButton = getButton('Back');
      this.nextButton = getButton('Next');
      this.saveButton = getButton('Save');
    }
  
    async updateOptionFromFile(t, fileName) {
        let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
        let lines = data.split('\n');
        await t.click(getRadioOption('For the 2022/23 FY funding term, would you like to opt-in to ECE-WE for any facility in your organization?', lines[0].trim()));
        if(lines[0].trim() === 'Yes'){
            await t.click(getRadioOption('Do any of the ECE Employees at any facility in your organization belong to a union?', lines[1].trim()));
            if(lines[1] && lines[1].trim() === 'Yes'){
                const option = lines[2].trim();
                const title = Selector('div').withText('Select the applicable funding model:');
                const radioOption = title.parent().nextSibling().find('label').withText(option);
                await t.click(radioOption).wait(500);
                switch(option){
                    case optionList[0]:
                        await t.expect(Selector('div').withText('ECEs at these facilities are not eligible for ECE Wage Enhancement').exists).ok();
                        break;
                    case optionList[1]:
                        await t.expect(Selector('div').withText('ECEs in provincially funded programs are not eligible').exists).ok();
                        break;
                    case optionList[2]:
                        await t.expect(Selector('div').withText('Please confirm').exists).ok();
                        await t.click(Selector('input').withAttribute('role', 'checkbox'));
                        break;
                    default:
                        break;
                }
            }
        }
    }
  }
  export default pageECEWEEligibility;