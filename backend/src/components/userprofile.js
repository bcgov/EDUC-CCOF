'use strict';
const { getUserProfile } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');



//mapping of front end values to ugly backend values goes here 



async function getProfile(req, res) {
  try {
    let data = await getUserProfile(req, res);
    log.info('from User PRofile componenet! ');
    // let facility = await getOperationWithObjectId('accounts', req.params.facilityId);
    // if (100000001 != facility?.ccof_accounttype) {
    //   return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not facility.'});
    // }
    // facility = _(facility).pick(Object.keys(GetFacilityKeyMap)).mapKeys((value,key) => {return GetFacilityKeyMap[key];});
    return res.status(HttpStatus.OK).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  getProfile
};


