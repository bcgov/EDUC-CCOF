import { createLocalVue, shallowMount } from '@vue/test-utils';
import CcfriEstimator from '@/components/CcfriEstimator';
import Vuetify from 'vuetify';
const fs = require('fs');
const path = require('path');

import flushPromises from 'flush-promises';

function addPartimeDays(days, child) {
  for (let i = 0; i < days ; i++) {
    child.selectedCareType.push(1);
  }
}
function addFulltimeDays(days, child) {
  for (let i = 0; i < days ; i++) {
    child.selectedCareType.push(2);
  }
}

async function loadFile(fileName) {
  let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), 'utf-8');
  let lines = data.split('\n');
  lines.shift(); // remove the first 2 lines which are headers
  lines.shift();
  return lines;
}

expect.extend({
  toBeCorrect(received) {
    if (received.reductionAmt == received.expectedReduction && received.parentFeeAmt == received.expectedParentFee) {
      return {
        message: () => `Results ${JSON.stringify(received)} should be valid`,
        pass: true
      };
    } else {
      return {
        message: () => `Results ${JSON.stringify(received)} is not valid`,
        pass: false
      };
    }
  }
});

describe('CcfriEstimator.js', () => {
  beforeEach(() => {

    const localVue = createLocalVue();
    localVue.use(Vuetify);
  });
  afterEach(() => {
  });

  it('Test CCfri Estimator', async () => {
    const formStub = {
      render: () => {},
      methods: {
        validate: () => true,
      }
    };
    const wrapper = shallowMount(CcfriEstimator, {
      stubs: {
        'v-form': formStub,
      }
    });
    // wrapper.vm.$refs.form.validate = true;
    const lines = await loadFile('estimatorData.csv');
    let results = [];
    let counter = 0;
    for (let i = 0 ; i < 2; i ++) {
      let values = lines[i].split(',');
      wrapper.vm.form.typeOfCare = String(values[0]).trim();
      wrapper.vm.children[0].childAgeCategory = String(values[1]).trim();
      wrapper.vm.children[0].careSchedule = 'Part Time';
      wrapper.vm.children[0].parentFeeFrequency = 'Monthly';
      wrapper.vm.children[0].approvedFee = values[2];
      wrapper.vm.children[0].partTimeFee = values[4];
      let columnOffset = 6;
      for (let fd = 0; fd <= 7; fd ++) {
        for (let hd = 0; (hd + fd) <= 7; hd ++) {
          let correctCell = values[columnOffset ++];
          if (fd === 0 && hd === 0) { // in the spreadsheet there is no fd=0, hd=-, so test the FT rate.
            continue;
          }
          let correctValues = correctCell.split(' ');
          wrapper.vm.children[0].selectedCareType = [];
          addPartimeDays(hd, wrapper.vm.children[0]);
          addFulltimeDays(fd, wrapper.vm.children[0]);
          wrapper.vm.estimateTheBenefit();
          let result = {
            typeOfCare: wrapper.vm.form.typeOfCare,
            childAgeCategory: wrapper.vm.children[0].childAgeCategory,
            parentFeeFrequency: 'Monthly',
            approvedFee: values[2],
            partTimeFee: values[4],
            halfDays: hd,
            fullDays: fd,
            reductionAmt: wrapper.vm.results[0].reductionAmountPerChild,
            expectedReduction: correctValues[0],
            parentFeeAmt: wrapper.vm.results[0].actualParentFeePerChild,
            expectedParentFee: correctValues[1],
            index: (columnOffset -1)
          };
          results.push(result);
          expect(result).toBeCorrect();
          counter++;
          // expect(wrapper.vm.results[0].reductionAmountPerChild, JSON.stringify(result)).toBe(correctValues[0]);
          // expect(wrapper.vm.results[0].actualParentFeePerChild, JSON.stringify(result)).toBe(correctValues[1]);
        }
      }
    }
    // results.forEach(i => console.log(JSON.stringify(i)));
    console.log(`Tested [${counter}] number of records and are all correct.`);
    await flushPromises();
  });

});
