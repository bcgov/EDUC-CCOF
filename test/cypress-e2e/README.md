1. **Clone the repository:**

   ```bash
   git clone https://github.com/bcgov/EDUC-CCOF.git
   cd cypress-e2e
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
support/ # custom commands & global setup
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

Test files are located in the `cypress/e2e/` directory. Each test file should follow the `.cy.js` naming convention. Example test:

## Run tests:

For Interactive (GUI):
npx cypress open

or for headless mode:

      npx cypress run

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.
