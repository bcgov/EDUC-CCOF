const { defineConfig } = require("cypress");

module.exports = defineConfig({
    defaultCommandTimeout: 10000,
    experimentalModifyObstructiveThirdPartyCode: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports/mocha',
      overwrite: false,
      charts: true,
      html: true,
      json: true,
    },
    e2e:{
    setupNodeEvents(on, config) {
      config.baseUrl = config.env.CCOF_PORTAL_URL;
      return config;
    },
  },
});




