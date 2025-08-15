const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,
    experimentalModifyObstructiveThirdPartyCode: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      charts: true,
      html: true,
      json: true,
    },
    baseUrl: 'https://qa.mychildcareservices.gov.bc.ca/',  // So you can use relative URLs like '/login'
    
    setupNodeEvents(on, config) {
      // Add Node event listeners here if needed
      return config;
    },
  },
});




