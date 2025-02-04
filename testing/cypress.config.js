const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
    defaultCommandTimeout: 10000,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      charts: true,
      html: true,
      json: true,
    },
    setupNodeEvents(on, config) {},
  },
})
