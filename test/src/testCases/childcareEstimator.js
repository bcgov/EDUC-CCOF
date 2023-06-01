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

    let totChildren = 2;
    await pageEstimator.addChildren(t, totChildren);
    log.info(totChildren, ' children added.');

    let typeOfCare = 'Licensed Group';
    await pageEstimator.typeOfCare(t, typeOfCare);
    log.info(typeOfCare, ' selected.');

    let childAgeCategory = '0 - 18 Months';
    await pageEstimator.childAgeCategory(t, childAgeCategory);
    log.info(childAgeCategory, ' selected.')

    let feeFrequency = 'Daily';
    await pageEstimator.parentFeeFrequency(t, feeFrequency);
    log.info(feeFrequency, ' selected.');

  });