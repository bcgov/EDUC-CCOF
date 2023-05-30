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

function hasFailed(result) {
  // if (result.column > 37) {
  //   return false;
  // }
  return (Math.abs(result.reductionAmt - result.expectedReduction) > 1) || (Math.abs(result.parentFeeAmt - result.expectedParentFee) > 1);
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
        message: () => 'Pass',
        pass: true
      };
    } else {
      return {
        message: () =>
          `******************************************\n
              RESULTS DID NOT PASS\n
              Row/Col             [${received.row}/${received.column}]\n
              typeOfCare          [${received.typeOfCare}]\n
              childAgeCategory    [${received.childAgeCategory}]\n
              approvedFee         [${received.approvedFee}]\n
              partTimeFee         [${received.partTimeFee}]\n
              halfDays            [${received.halfDays}]\n
              fullDays            [${received.fullDays}]\n
              feeFrequency        [${received.parentFeeFrequency}]\n
              reductionAmt/Exp    [${received.reductionAmt}] / [${received.expectedReduction}]\n
              parentFeeAmt/Exp    [${received.parentFeeAmt}] / [${received.expectedParentFee}]`,
        pass: false
      };
    }
  }
});

describe('CcfriEstimator.js', () => {
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);
    jest.spyOn(console, 'log').mockImplementation(() => {});

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
    // const lines = await loadFile('estimatorPreschool.csv');
    const lines = await loadFile('estimatorData.csv');
    let results = [];
    let counter = 0;
    let errors = 0;
    for (let i = 0 ; i < lines.length; i ++) {
      let values = lines[i].split(',');
      wrapper.vm.form.typeOfCare = String(values[0]).trim();
      wrapper.vm.children[0].childAgeCategory = String(values[1]).trim();
      wrapper.vm.children[0].careSchedule = 'Part Time';
      wrapper.vm.children[0].parentFeeFrequency = 'Monthly';
      wrapper.vm.children[0].approvedFee = values[2];
      wrapper.vm.children[0].partTimeFee = values[4];
      const isPreschool = wrapper.vm.children[0].childAgeCategory == 'Preschool';
      let columnOffset = 6;
      for (let fd = 0; fd <= 7; fd ++) {
        if (isPreschool && fd > 0) {
          continue;
        }
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
            column: (columnOffset -1),
            row: i + 5
          };
          if (hasFailed(result)) {
            results.push(result);
            errors ++;
          }

          // expect(result).toBeCorrect();
          counter++;
          // expect(wrapper.vm.results[0].reductionAmountPerChild, JSON.stringify(result)).toBe(correctValues[0]);
          // expect(wrapper.vm.results[0].actualParentFeePerChild, JSON.stringify(result)).toBe(correctValues[1]);
        }
      }
    }
    // results.forEach(i => console.log(JSON.stringify(i)));
    console.info(`Tested [${counter}] number of records with [${errors}] tests failing.`);
    const excelFormat = true;
    if (excelFormat) {
      console.info('ROW, COLUMN, TYPE_OF_CARE, CHILD_AGE_CATEGORY, APPROVED_FEE, YOUR_FEE, FREQUENCY, HALF_DAYS, FULL_DAYS, REDUCTION_AMNT, REDUCTION_EXPECTED_AMT, PARENT_FEE, EXPECTED_PARENT_FEE');
      results.forEach(received => {
        console.info(`${received.row},${received.column},${received.typeOfCare},${received.childAgeCategory},${received.approvedFee},${received.partTimeFee},${received.parentFeeFrequency},${received.halfDays},${received.fullDays},${received.reductionAmt},${received.expectedReduction},${received.parentFeeAmt},${received.expectedParentFee}`);
      });
    } else {
      results.forEach(received => {
        console.info(`Row/Col  [${received.row}/${received.column}]   typeOfCare [${received.typeOfCare}]    AgeCat [${received.childAgeCategory}]  approvedFee [${received.approvedFee}]  partTimeFee [${received.partTimeFee}]   feeFrequency [${received.parentFeeFrequency}]\n
        halfDays [${received.halfDays}]   fullDays [${received.fullDays}]  reductionAmt/Exp [${received.reductionAmt}] / [${received.expectedReduction}]  parentFeeAmt/Exp [${received.parentFeeAmt}] / [${received.expectedParentFee}]`);
      });

    }
    await flushPromises();
  });

});