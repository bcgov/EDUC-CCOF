const { defineConfig } = require('cypress');
const fs = require('fs')

module.exports = defineConfig({
  defaultCommandTimeout: 60000,
  numTestsKeptInMemory: 0,
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
      on ('task', {
        countFiles(folderName) {
          return new Promise((resolve, reject) => {
            fs.readdir(folderName, (err, files) => {
              if (err) {
                return reject(err)
              }
              let names = []
              files.forEach(fileName => {
                names.push(fileName)
              })
              resolve(names)
            })
          })
        },
      })
      return config;
    },
    screenshotOnRunFailure: true,
    video: true,
  },
});
