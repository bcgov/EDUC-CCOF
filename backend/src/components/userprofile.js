'use strict';
const { getUserProfile } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');



//mapping of front end values to ugly backend values goes here 

//i think BCeID.ccof_userid is the right GUID to use? But i'm not 100 percent sure -- follow up on this 

//application status is not yet implemented in the Dynamics -- so that will change 
// const GetUserProfileKeyMap = {
//   //organizationList: [

//   organizationName : 'Organization.name',
//   organizationId : 'BCeID.ccof_userid',
//   applicationStatus : 'APPROVED',

// //]
// };

// const GetUserProfileKeyMap = {
//   organizationId: 'BCeID.ccof_userid',

// };

const GetUserProfileKeyMap = {
  'BCeID.ccof_userid' : 'organizationId',

};

async function getProfile(req, res) {
  try {
    let currentUserProfile = await getUserProfile(req, res);
    //log.info('from User PRofile componenet! ');
    // let facility = await getOperationWithObjectId('accounts', req.params.facilityId);
    // if (100000001 != facility?.ccof_accounttype) {
    //   return res.status(HttpStatus.NOT_FOUND).json({message: 'Account found but is not facility.'});
    // }
    currentUserProfile = currentUserProfile.value;
    // currentUserProfile = currentUserProfile.map((fac) => {
    //   //log.info(fac);
    //   let hi = ( _(fac).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];}));
    //   //log.info(hi);
    // });
    // currentUserProfile = _(currentUserProfile).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];});
    
    //log.info(currentUserProfile);
    
    return res.status(HttpStatus.OK).json(currentUserProfile);
    // return res.status(HttpStatus.OK).json();
  } catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  getProfile
};


