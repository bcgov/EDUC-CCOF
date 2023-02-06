import { Selector } from 'testcafe';
import log from 'npmlog';
const {getRadioOption, getButton} = require('../utils/selectors');
const fs = require('fs');
const path = require('path');
const optionList = ["All of our facilities have provincially funded ECEs and receive Low-Wage Redress Funding.",
                    "All of our facilities have only non-provincially funded ECEs and do not receive Low-Wage Redress Funding.",
                    "Some of our facilities have both non-provincially funded ECEs that do not receive Low-Wage Redress Funding AND provincially funded ECEs receiving Low-Wage Redress Funding."
                    ]


class PageECEWEEligibility {

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
        await t.click(getRadioOption('For the 2023/24 FY funding term, would you like to opt-in to ECE-WE for any facility in your organization?', lines[0].trim()));
        if(lines[0].trim() === 'Yes'){
            await t.click(getRadioOption('Do any of the ECE Employees at any facility in your organization belong to a union?', lines[1].trim()));
            if(lines[2]){
              await t.click(getRadioOption('Select the applicable sector:', lines[2].trim()));
            }
            if(lines[1] && lines[2] && lines[1].trim() === 'Yes'&& lines[2] === 'Community Social Services Employers\' Association (CSSEA) Member'){
                const option = lines[2].trim();
                log.info('Option selected: ' + option);
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
            }else if(lines[1] && lines[2] && lines[1].trim() === 'Yes'&& lines[2] === 'Other Unionized Employer'){
              await t.click(Selector('input').withAttribute('role', 'checkbox'));
            }
        }
    }

  async clickSaveButton(t) {
    await t.click(this.saveButton).wait(3000);
    log.info('Save button clicked');
    await t.expect(alert.success.exists).ok();
    log.info('Save Successful clicked');
  }

  async clickBackButton(t) {
    await t.click(this.backButton);
    log.info('Back button clicked');
  }

  async clickNextButton(t) {
    await t.click(this.nextButton);
    log.info('Next button clicked');
  }

  async clickSaveAndNextButton(t) {
    this.clickSaveButton(t);
    this.clickNextButton(t);
  }

  async nextButtonIsDisabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).ok();
    log.info('Next button is disabled');
  }

  async nextButtonIsEnabled(t) {
    await t.expect(this.nextButton.hasAttribute('disabled')).notOk();
    log.info('Next button is enabled');
  }
  }
  export default PageECEWEEligibility;
