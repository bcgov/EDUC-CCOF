import { createLocalVue, shallowMount } from '@vue/test-utils';
import CcfriEstimator from '@/components/CcfriEstimator';
import Vuetify from 'vuetify';
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer');

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
  if (result.parentFeeFrequency == 'Monthly') {
    return (Math.abs(result.reductionAmt - result.expectedReduction) > 1) || (Math.abs(result.parentFeeAmt - result.expectedParentFee) > 1);
  } else {
    return (Math.abs(result.reductionAmt - result.expectedReduction) > 1) || (Math.abs(result.parentFeeAmt - result.expectedParentFee) > 1);
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

  let results = [];
  let counter = 0;
  let errors = 0;

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

    const CHILD_CATEGORY_MAP = {
      '0-18':'0 - 18 Months',
      '18-36': '18 - 36 Months',
      '3-k': '3 Years to Kindergarten',
      'Before and After Kinder':  'Before & After School (Kindergarten Only)',
      'OOSC-G': 'Before & After School (Grade 1+)',
      'Preschool': 'Preschool'
    };

    const CARE_TYPE_MAP = {
      'Group': 'Licensed Group',
      'Family': 'Licensed Family'
    };
    // wrapper.vm.$refs.form.validate = true;
    // const lines = await loadFile('estimatorPreschool.csv');
    const lines = await loadFile('estimator-data-v2.csv');
    // const lines = await loadFile('testData.csv');

    for (let i = 0 ; i < lines.length; i ++) {
      processOneLine(lines[i], 'Monthly', i);
      processOneLine(lines[i], 'Daily', i);
    }

    function getChildCategory(childCat) {
      childCat = String(childCat).trim();
      const retVal = CHILD_CATEGORY_MAP[childCat];
      if (!retVal) {
        throw `Cannot find child category for value: [${childCat}]`;
      }
      return retVal;
    }

    function getCareType(careType) {
      careType = String(careType).trim();
      const retVal = CARE_TYPE_MAP[careType];
      if (!retVal) {
        throw `Cannot find Care Type for value: [${careType}]`;
      }
      return retVal;
    }

    function processOneLine(line, frequency, index) {
      let values = line.split(',');
      wrapper.vm.form.typeOfCare = getCareType(values[0]);
      wrapper.vm.children[0].childAgeCategory = getChildCategory(values[1]);
      wrapper.vm.children[0].careSchedule = 'Part Time';
      wrapper.vm.children[0].parentFeeFrequency = frequency;
      wrapper.vm.children[0].approvedFee = frequency === 'Monthly' ? values[2] : values[3];
      wrapper.vm.children[0].partTimeFee = frequency === 'Monthly' ? values[4] : values[5];
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
            parentFeeFrequency: frequency,
            approvedFee: wrapper.vm.children[0].approvedFee,
            partTimeFee: wrapper.vm.children[0].partTimeFee,
            halfDays: hd,
            fullDays: fd,
            days: (hd + fd),
            reductionAmt: wrapper.vm.results[0].reductionAmountMonthly,
            reductionAmtDaily: wrapper.vm.results[0].reductionAmountDaily,
            expectedReduction: correctValues[0],
            parentFeeAmt: wrapper.vm.results[0].parentFeeMonthly,
            parentFeeAmtDaily: wrapper.vm.results[0].parentFeeDaily,
            expectedParentFee: correctValues[1],
            column: (columnOffset -1),
            row: index + 5,
          };
          if (hasFailed(result)) {
            result.result = 'FAIL',
            results.push(result);
            errors ++;
          } else {
            result.result = 'PASS',
            results.push(result);
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
    const writer = csvWriter.createObjectCsvWriter({
      path: path.join(__dirname, '../../../results.csv'),
      header: [
        { id: 'column', title: 'COLUMN'},
        { id: 'row', title: 'ROW'},
        { id: 'typeOfCare', title: 'TYPE_OF_CARE'},
        { id: 'childAgeCategory', title: 'AGE_CATEGORY'},
        { id: 'parentFeeFrequency', title: 'FREQUENCY'},
        { id: 'approvedFee', title: 'APPROVED_FREE'},
        { id: 'partTimeFee', title: 'PARENT_FEE'},
        { id: 'halfDays', title: 'HD'},
        { id: 'fullDays', title: 'FD'},
        { id: 'reductionAmt', title: 'REDUCTION_AMT_MONTHLY'},
        { id: 'reductionAmtDaily', title: 'REDUCTION_AMT_DAILY'},
        { id: 'expectedReduction', title: 'EXP_REDUCTION_AMT'},
        { id: 'parentFeeAmt', title: 'PARENT_FEE_MONTHLY'},
        { id: 'parentFeeAmtDaily', title: 'PARENT_FEE_DAILY'},
        { id: 'expectedParentFee', title: 'EXP_PARENT_FEE'},
        { id: 'result', title: 'RESULT'},
        { id: 'days', title: 'DAYS'},
      ],
    });
    writer.writeRecords(results).then(() => {
      console.info('Done!: ', path.join(__dirname, '../../../results.csv'));
    });
    // const excelFormat = true;
    // if (excelFormat) {
    //   console.info('ROW, COLUMN, TYPE_OF_CARE, CHILD_AGE_CATEGORY, APPROVED_FEE, YOUR_FEE, FREQUENCY, HALF_DAYS, FULL_DAYS, REDUCTION_AMNT, REDUCTION_EXPECTED_AMT, PARENT_FEE, EXPECTED_PARENT_FEE');
    //   results.forEach(received => {
    //     console.info(`${received.row},${received.column},${received.typeOfCare},${received.childAgeCategory},${received.approvedFee},${received.partTimeFee},${received.parentFeeFrequency},${received.halfDays},${received.fullDays},${received.reductionAmt},${received.expectedReduction},${received.parentFeeAmt},${received.expectedParentFee}`);
    //   });
    // } else {
    //   results.forEach(received => {
    //     console.info(`Row/Col  [${received.row}/${received.column}]   typeOfCare [${received.typeOfCare}]    AgeCat [${received.childAgeCategory}]  approvedFee [${received.approvedFee}]  partTimeFee [${received.partTimeFee}]   feeFrequency [${received.parentFeeFrequency}]\n
    //     halfDays [${received.halfDays}]   fullDays [${received.fullDays}]  reductionAmt/Exp [${received.reductionAmt}] / [${received.expectedReduction}]  parentFeeAmt/Exp [${received.parentFeeAmt}] / [${received.expectedParentFee}]`);
    //   });

    // }
    await flushPromises();
  });

});
