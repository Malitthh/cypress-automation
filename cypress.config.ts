import { config } from "chai";

const { defineConfig } = require("cypress");
const xlsx = require('node-xlsx').default; //to read excel files
const fs = require('fs'); // for file

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Content-test-report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false
  },

  e2e: {
    experimentalModifyObstructiveThirdPartyCode: true,
    chromeWebSecurity: true,
    experimentalInteractiveRunEvents: true,
    setupNodeEvents(on) {
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        parseCsv({ filePath }) {
          return new Promise((resolve, reject) => {
            try {
              const jsonData = xlsx.parse(fs.readFileSync(filePath));
              resolve(jsonData);
            } catch (e) {
              reject(e);
            }
          });
        }
      })
    },

    taskTimeout: 120000,
    specPattern: "cypress/e2e/**/*.{ts,tsx}",
    env: {
      hrmURL: "https://opensource-demo.orangehrmlive.com/",
      opencartURL: "https://demo.opencart.com/",
      mockAPIPOST: "https://petstore.swagger.io/POST",
      mockAPIGET: "https://petstore.swagger.io/GET"
    },
    retries: {
      runMode: 1,
      openMode: 1,
    },
  },

  defaultCommandTimeout: 90000,
  viewportWidth: 1440,
  viewportHeight: 900,
  requestTimeout: 90000,
  responseTimeout: 90000,
  pageLoadTimeout: 200000,
  waitForAnimations: true,
  numTestsKeptInMemory: 0,
  experimentalMemoryManagement: true
});