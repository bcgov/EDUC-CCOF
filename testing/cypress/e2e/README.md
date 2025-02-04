# Cypress E2E testing

Instructions on how to install and run Cypress tests in headless mode as well as the GUI test runner.

## Prerequisites

1. Copy cypress.env.json.template and name cypress.env.json
2. Fill in the blanks (see team leads for values)

## Local Cypress Setup

**`Step 1`** Open a new terminal window and navigate to the root of testing folder.

**`Step 2`** Issue the command `npm install`

## Run tests in headless mode

**`Step 1`** Determine the test or test files you want to run. For this example we'll run cypress\e2e\1-portal-and-crm-login-and-security\portal_login.cy.js

**`Step 2`** If your terminal prompt is not alraedy in the root of the testing folder, cd to ECC-OFM\testing

**`Step 3`** Issue the command:
`npm run cy:run-one cypress\e2e\1-portal-and-crm-login-and-security\portal_login.cy.js`

## Run tests in Cypress GUI

**`Step 1`** If your terminal prompt is not already in the root of the testing folder, cd to ECC-OFM\testing

**`Step 2`** Issue the command: `nm run cy:open`

**`Step 3`** After the Cypress Test Runner GUI opens, you’ll be presented with the option to select ‘E2E Testing’ or ‘Component Testing’. Click on ‘E2E Testing’.

**`Step 4`** You’ll now be presented with selecting the browser of your choice. Select ‘Chrome’ and then ‘Start E2E Testing in Chrome’. This will open the Cypress Test Runner in Chrome.

**`Step 5`** NOTE: The Cypress Test Runner by default opens to ‘Specs’, i.e. ‘Specs’ is selected in the left vertical nav bar and appears as the main content. A ‘Spec’ is a test file that contains one or more test cases or individual test specifications.

**`Step 6`** To run a spec, simply click on the spec name. For this example, click on the 1-portal-and-crm-login-and-security spec listed under the examples ‘1-getting-started’. Upon doing so the spec will run… notice how the presentation displays the spec execution in the left split window pane and displays a real time presentation of the browser GUI in the right. For this example, you can see 6 out of 6 testing steps passed and the spec executed with no errors.

## Data Requirements

### Portal (BCeID)

- At least one "Test Message" System Message must exist in CRM
- Organization Test-1088 Organization must exist in CRM
- User must be an Account Manager
- User must have at least 2 Facilities.
- User must have at least 2 Notifications. The latest should be read
- User must have at least 1 Application
- User must have at least 1 Funding Agreement
- User must have at least 1 Historical Payment
- User must have at least 1 Scheduled Payment
- User must have at least 1 Pending Report
- User must have at least 1 Historical Report

### CRM (IDIR)

- Must be a service account that's doesn't require MFA
