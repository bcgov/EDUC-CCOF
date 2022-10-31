'use strict';
const { getUserProfile } = require('./utils');
const HttpStatus = require('http-status-codes');
const log = require('./logger');
const _ = require ('lodash');



//mapping of front end values to ugly backend values goes here 

//i think BCeID.ccof_userid is the right GUID to use? But i'm not 100 percent sure -- follow up on this 

//application status is not yet implemented in the Dynamics -- so that will change 
const GetUserProfileKeyMap = {
  //organizationList: [
  'Organization.name':   'orgName',
  'Organization.accountid': 'orgId',

//]
};

// const GetUserProfileKeyMap = {
//   organizationId: 'BCeID.ccof_userid',

// };

// const GetUserProfileKeyMap = {
//   'BCeID.ccof_userid' : 'organizationId',

// };

async function getProfile(req, res) {
  try {
    let currentUserProfile = await getUserProfile(req, res);
    //log.info('from User PRofile componenet! ');

    currentUserProfile = currentUserProfile.value;

    let x = currentUserProfile.map(item => {
      return  _(item).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => GetUserProfileKeyMap[key]);
    });
    // currentUserProfile = currentUserProfile.map ((facility) => {
    //   currentUserProfile = _(facility).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];});
    // });
    
    //currentUserProfile =  _(currentUserProfile).pick(Object.keys(GetUserProfileKeyMap)).mapKeys((value,key) => {return GetUserProfileKeyMap[key];});

    return res.status(HttpStatus.OK).json(x);
    
  }
    
  catch (e) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(e.data? e.data : e?.status );
  }
}


module.exports = {
  getProfile
};


