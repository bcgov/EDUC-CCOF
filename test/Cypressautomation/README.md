1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd Cypressautomation
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run tests:**
   `bash
    npx cypress open
    `
   or for headless mode:
   `bash
    npx cypress run
    `
   NOTE:- Before running the test fill username and password in Cypress.env.json

## Project Structure

- `cypress/`
  - `e2e/` - End-to-end test specifications
  - `fixtures/` - Test data files
  - `support/` - Custom commands and support utilities
- `cypress.config.js` - Cypress configuration file
- `package.json` - Project dependencies and scripts
- `cypress.env.json` - Environment variables for Cypress tests (e.g., credentials, URLs). This file is optional and can be used to store sensitive or environment-specific data. Do not commit sensitive information to version control.

cp cypress.env.example.json cypress.env.json
Update the values inside cypress.env.json with your real credentials and environment details.

Ignored Files

The following are ignored in .gitignore:

cypress/videos/

cypress/screenshots/

cypress/reports/

cypress.env.json

## Writing Tests

Test files are located in the `cypress/e2e/` directory. Each test file should follow the `.cy.js` naming convention. Example test:

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.
