import log from "npmlog";
import PageEstimator from '../pageObjects/PageEstimator';

const fs = require('fs');
const path = require('path');
const config = require('../utils/configLoader');
const validation = require('../utils/validation');
const pageEstimator = new PageEstimator();
const data = loadFile('local_estimatorData.csv');

fixture`Child Care Estimator Test`
  .page(`${config.get('url')}/ccfri-estimator`).after(async t => {
  });

data.forEach(line => {
  let values = line.split(',');
  let columnOffset = 6;
  test('Childcare Estimator Test (Monthly) ', async t => {
    for (let fd = 0; fd <= 7; fd++) {
      let childAgeCareCategory = String(values[1]).trim();
      let isPreschool = childAgeCareCategory === 'Preschool' ? true : false;
      if (isPreschool && fd > 0) {
        continue;
      }

      for (let hd = 0; (hd + fd) <= 7; hd++) {
        //log.info(`full time days = ${fd} and part time days = ${hd}`);
        let correctCell = values[columnOffset++];
        let correctValues = correctCell.split(' ');
        if (fd === 0 && hd === 0) { // in the spreadsheet there is no fd=0, hd=-, so test the FT rate.
          continue;
        }

        await pageEstimator.parentSelect(t);

        let totChildren = 1;
        await pageEstimator.addChildren(t, totChildren);

        let typeOfCare = String(values[0]).trim();;
        await pageEstimator.typeOfCare(t, typeOfCare);

        await pageEstimator.childAgeCategory(t, childAgeCareCategory);

        await pageEstimator.careSchedule(t, hd, fd);

        await pageEstimator.parentFeeFrequency(t, 'Monthly');

        let approvedFee = values[2];
        await pageEstimator.fullTimeParentFee(t, approvedFee);

        let actualFee = values[4];
        await pageEstimator.partTimeFee(t, actualFee);

        // * number of days of care * 4 (number of weeks in a month)
        let dailychildCareSavings = correctValues[0];
        // let monthlyChildCareSavingsHD = dailychildCareSavings * hd * 4;
        // let monthlyChildCareSavingsFD = dailychildCareSavings * fd * 4;
        // let totalSavings = monthlyChildCareSavingsFD + monthlyChildCareSavingsHD;
        // let childCareSavings = '$' + dailychildCareSavings + '/day ($' + totalSavings + '/month)';

        let estimatedParentFee = correctValues[1];
        // let monthlysEtimatedParentFeeHD = estimatedParentFee * hd * 4;
        // let monthlyEtimatedParentFeeFD = estimatedParentFee * fd * 4;
        // let totalEstimatedFees = monthlysEtimatedParentFeeHD + monthlyEtimatedParentFeeFD;
        // let parentFeeReduction = '$' + estimatedParentFee + '/day ($' + totalEstimatedFees + '/month)';
        await pageEstimator.estimateSavings(t, dailychildCareSavings, estimatedParentFee);
      }
    }
  })
});

function loadFile(fileName) {
  let file = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), { encoding: "utf8" });
  let lines = file.split('\n');
  lines.shift(); // remove the first 2 lines which are headers
  lines.shift();
  return lines;
}
