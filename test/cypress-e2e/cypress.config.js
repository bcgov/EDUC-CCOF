const { defineConfig } = require('cypress');

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports/mocha",
    overwrite: false,
    charts: true,
    html: true,
    json: true,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      config.baseUrl = config.env.PORTAL_BASE_URL;
      return config;
    },
    screenshotOnRunFailure: true,
    video: true,
  },
});
