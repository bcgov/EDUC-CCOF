1. **Clone the repository:**

   ```bash
   git clone https://github.com/bcgov/EDUC-CCOF.git
   cd /test/cypress-e2e
   ```

## Project Structure

test/cypress-e2e
cypress/
.gitignore # ignores test artifacts inside cypress/
downloads/ # files downloaded during tests (gitignored)
e2e/ # test specs
fixtures/ # test data files
reports/ # HTML/JSON reports (e.g., mochawesome) (gitignored)
screenshots/ # failure screenshots (gitignored)
scripts/ # helper scripts/utilities used by tests or CI
support/ # custom commands & global setup and constants
videos/ # test run videos (gitignored)
.gitignore # repo-level ignore rules
cypress.config.js # Cypress configuration
cypress.env.example.json # example env values (safe to commit)
cypress.env.json # local env values (DO NOT COMMIT)(gitignored)
package.json
package-lock.json
README.md

Note:
Update the values inside cypress.env.json with your real credentials and environment details.

## Ignored Files

The following are ignored in .gitignore:

cypress/videos/

cypress/screenshots/

cypress/reports/

cypress.env.json

## Writing Tests

Test files are located in the `cypress/e2e/` directory. Each test file should follow the `.cy.js` naming convention.

Currently, we have organized tests such that large e2e flows are broken down into respective page objects and added under "support > pages". This allows us to reuse these page components to minimize code duplication.

These components can then be called in the e2e tests to replicate a full user flow. Refer to any of the cy.js files for an example.

## Run tests:

For Interactive (GUI):
npx cypress open

or for headless mode:

      npx cypress run

NOTE: Headless mode run in the method above will run ALL the tests consecutively and this WILL fail. Due to the nature of these e2e tests, certain data will need to be setup in CMS for the flow to work properly.

To resolve the issue above, run headless mode as written below (file path uses test/cypress-e2e as root):
npx cypress run --spec path/to/file

### Tailoring Data to Test Cases

Running different test cases is a matter of editing the data files in cypress/e2e/fixtures. Currently there are 3 files that correspond to the different parts of the Application:

1. CCOF (org info, facility info, licence & SDD, other facilities)
2. CCFRI (parent fees & closures)
3. ECE-WE

The data in these files is represented as JSON which has a "Key": "Value" pair. When editing the data, ensure you ONLY edit the VALUE (right side of the colon).

For example, you can change the type of organization for an application by going to fixtures/ccofData.json -> and updating the key to "typeOfOrganization" from "Registered Company" to "Non-Profit Society".

All possible values for different keys are indicated by the wording "\_options". Please ensure you NEVER change the values listed under this key.

### Creating Applications (Template 1/2):

Each Application script requires your BCeID (assigned in .env) to have NO organization tied to it & a Portal Role assigned. This must be set up in CMS before running any of these scripts.

The 2025-26 FY uses Template 1, while anything past Feburary 15th, 2026 will use Template 2. Please be aware of this when running the scripts.

If updating the Program Year in CMS, please ensure you update the _ccfriData_ fixture file Parent Fee Dates to 2025-26 & 2026-27 AND update the closure dates to be between 05/01/2026 - 04/30/2027. These changes are also described as a comment in the fixture file.

### Adding Multiple Facilities

Currently, Multiple Facilities only works for Group Applications in Template 1. To create additional facilities, please do the following:

1. Create additional fixture .json files for EACH FACILITY under ccof-data/extra-facs-ccof, ccfri-data/extra-facs-ccfri, and ecewe-data/extra-facs-ecewe. This means, each facility needs 3 additional fixture files.
2. Each facility will need its own file under ccof-data/licence-files for the Licence Upload. If your organization has 3 facilities, you should have 3 files under ccof-data/licence-files.
3. The data edited for new facilities in ccof/ccfri/ecewe corresponds directly to the data you can edit in the portal. For example, new facilities may have different names, licence categories, etc. BUT they _cannot_ be under a different organization if this facility is being added onto an existing application. Therefore, you do NOT need to change anything under the 'orgData' key in your fixture file.

Please ensure ANY added files do NOT contain spaces within the name. Add dashes (-) to connect words if necessary.

For additional information on how to run a test with multiple facilities, please review the QA Automation Confluence page.

### Signing Funding Agreements

This script requires an application to have been submitted AND adjudicated on the CMS side. The Funding Agreement must also have been updated to "Pending Signing" as its status on CMS.

NOTE: This will NOT work in EFX as of November 21st, 2025. Funding Agreement signing as a functionality has not yet been implemented in that environment.

### Renewals (Template 2 only)

This script requires an application to have been submitted, adjudicated, and Funding Agreement signed in order to open the "Renewal" button on the portal.

NOTE: Current program year setup will NOT show the renewal button until January 2026. If wanting to run the renewal script, please ensure you update the program years accordingly.

### Add new facility change request (Version 2 only)

The group application in version 2 needs to be submitted and adjudicated and funding needs to be active in order to submit the change request . The test case currently is designed to add a single facility for group application version 2

### Automation Bugs & Enhancements

If you find any issues with the automation scripts and/or ideas on how to improve the scripts, please feel free to reach out!

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.
