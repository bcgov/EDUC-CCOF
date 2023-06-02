import log from "npmlog";
const config = require('../utils/configLoader');
const validation = require('../utils/validation');
import PageEstimator from '../pageObjects/PageEstimator';

const pageEstimator = new PageEstimator();

fixture `Child Care Estimator Test`
  .page(`${config.get('url')}/ccfri-estimator`).after(async t => {
});

  test ('Childcare Estimator Test', async t => {
    await pageEstimator.parentSelect(t);
    log.info('Parent Selected.');

    let totChildren = 1;
    await pageEstimator.addChildren(t, totChildren);
    log.info(totChildren, ' children added.');

    let typeOfCareToSelect = 'Licensed Group';
    await pageEstimator.typeOfCare(t, typeOfCareToSelect);
    log.info(typeOfCareToSelect, ' selected.');

    let childAgeCategory = '0 - 18 Months';
    await pageEstimator.childAgeCategory(t, childAgeCategory);
    log.info(childAgeCategory, ' selected.')

    let noCare = 2;
    let fourOrLess = 2;
    let moreThanFour = 3;
    await pageEstimator.careSchedule(t, noCare, fourOrLess, moreThanFour);
    log.info(noCare, ' is the number of No care.')
    log.info(fourOrLess, ' is the number of Four hours or less.')
    log.info(moreThanFour, ' is the number of Four hours or more.')

    let feeFrequency = 'Daily';
    await pageEstimator.parentFeeFrequency(t, feeFrequency);
    log.info(feeFrequency, ' selected.');

    let fullTimeParentFee = 1000;
    await pageEstimator.fullTimeParentFee(t, fullTimeParentFee);
    log.info(fullTimeParentFee, ' dollars.')

    let partTimeFee = 500;
    await pageEstimator.partTimeFee(t, partTimeFee);
    log.info(partTimeFee, ' dollars.')

    let childCareSavings = '$0/month';
    let parentFeeReduction = '$500/month';
    await pageEstimator.estiamteSavings(t, childCareSavings, parentFeeReduction);
    log.info('Estimate your savings selected.');
  });