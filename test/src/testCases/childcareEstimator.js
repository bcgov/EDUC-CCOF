import log from "npmlog";
const fs = require('fs');
const path = require('path');

const config = require('../utils/configLoader');
const validation = require('../utils/validation');
import PageEstimator from '../pageObjects/PageEstimator';

const pageEstimator = new PageEstimator();

fixture `Child Care Estimator Test`
  .page(`${config.get('url')}/ccfri-estimator`).after(async t => {
});


  test ('Childcare Estimator Test (Daily)', async t => {
    const lines = await loadFile('estimatorData.csv'); 
    log.info(lines.length, ' is the the number of lines.');
    
    for (let i = 0 ; i < lines.length; i ++) {
      let values = lines[i].split(',');

      for (let fd = 0; fd <= 7; fd ++) {
        let childAgeCategory = String(values[1]).trim();
        let isPreschool = childAgeCategory == 'Preschool';
        let columnOffset = 6;
        if (isPreschool && fd > 0) {
          continue;
        }
        for (let hd = 0; (hd + fd) <= 7; hd ++) {
          let correctCell = values[columnOffset ++];
          if (fd === 0 && hd === 0) { // in the spreadsheet there is no fd=0, hd=-, so test the FT rate.
            continue;
          }
          let correctValues = correctCell.split(' ');

          log.info(correctValues[0], ' is the expected reduction.')
          log.info(correctValues[1], ' is the expected parent fee.')

          //await pageEstimator.parentSelect(t);
          log.info('Parent Selected.');

          let totChildren = 1;
          //await pageEstimator.addChildren(t, totChildren);
          log.info(totChildren, ' children added.');

          let typeOfCare = String(values[0]).trim();;
          //await pageEstimator.typeOfCare(t, typeOfCare);
          log.info(typeOfCare, ' selected');
          
          //await pageEstimator.childAgeCategory(childAgeCategory);
          log.info(childAgeCategory, ' selected');

          let noCare = 0 ;
          let fourOrLess = hd;
          let moreThanFour = fd;
          //await pageEstimator.careSchedule(t, noCare, fourOrLess, moreThanFour);
          log.info(noCare, ' is the number of No care.')
          log.info(fourOrLess, ' is the number of Four hours or less.')
          log.info(moreThanFour, ' is the number of Four hours or more.')

          let feeFrequency = 'Daily';
          //await pageEstimator.parentFeeFrequency(t, feeFrequency);
          log.info(feeFrequency, ' selected.');

          let fullTimeParentFee = values[3];
          //await pageEstimator.fullTimeParentFee(t, fullTimeParentFee);
          log.info(fullTimeParentFee, ' dollars.')

          let partTimeFee = values[5];
          //await pageEstimator.partTimeFee(t, partTimeFee);
          log.info(partTimeFee, ' dollars.')

          let childCareSavings = '$0/month';
          let parentFeeReduction = '$500/month';
          //await pageEstimator.estiamteSavings(t, childCareSavings, parentFeeReduction);
          log.info('Estimate your savings selected.');
        
        }
      }
    }
  });

  async function loadFile(fileName) {
    let data = fs.readFileSync(path.join(__dirname, '..', 'data', `${fileName}`), { encoding: "utf8" });
    let lines = data.split('\n');
    lines.shift(); // remove the first 2 lines which are headers
    lines.shift();

    return lines;
  }