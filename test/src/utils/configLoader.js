const nconf = require('nconf');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const env = process.env.NODE_ENV || 'local';

nconf.argv()
  .env()
  .file({ file: path.join(__dirname, '..', 'config', `${env}-test.json`) });
//injects environment variables into the json file
nconf.overrides({
  environment: env,
});

nconf.defaults({
  environment: env,
});
module.exports = nconf;
