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
    // jest.spyOn(console, 'log').mockImplementation(() => {});

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
    let results = [];
    let counter = 0;
    let errors = 0;

    wrapper.vm.form.typeOfCare = 'Licensed Group';
    wrapper.vm.children[0].childAgeCategory = '0 - 18 Months';
    wrapper.vm.children[0].careSchedule = 'Part Time';
    wrapper.vm.children[0].parentFeeFrequency = 'Monthly';
    wrapper.vm.children[0].approvedFee = 400;
    wrapper.vm.children[0].partTimeFee = 331;
    wrapper.vm.children[0].selectedCareType = [];
    addPartimeDays(0, wrapper.vm.children[0]);
    addFulltimeDays(7, wrapper.vm.children[0]);
    wrapper.vm.estimateTheBenefit();
    let result = {
      typeOfCare: wrapper.vm.form.typeOfCare,
      childAgeCategory: wrapper.vm.children[0].childAgeCategory,
      parentFeeFrequency: 'Monthly',
      approvedFee: wrapper.vm.children[0].approvedFee,
      partTimeFee: wrapper.vm.children[0].partTimeFee,
      halfDays: 2,
      fullDays: 3,
      reductionAmt: wrapper.vm.results[0].reductionAmountPerChild,
      expectedReduction: 331,
      parentFeeAmt: wrapper.vm.results[0].actualParentFeePerChild,
      expectedParentFee: 0,
      column: 1,
      row: 5
    };
    if (hasFailed(result)) {
      results.push(result);
      errors ++;
    } else {
      results.push(result);
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
