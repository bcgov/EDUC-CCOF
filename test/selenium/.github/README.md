# CCOF Selenium Test Automation Pipeline

This repository contains GitHub Actions workflows for automating the CCOF Selenium test suite execution.

## Pipeline Features

### 🚀 Automated Test Execution
- **Multi-browser support**: Chrome, Firefox, Edge
- **Environment flexibility**: QA and UAT environments
- **TestNG integration**: Parallel test execution with detailed reporting
- **Scheduled and on-demand execution**

### 📊 Comprehensive Reporting
- **TestNG HTML reports**: Detailed test execution results
- **ExtentReports**: Rich visual test reports with screenshots
- **Artifact storage**: Test reports, logs, and screenshots
- **PR comments**: Automatic test result summaries on pull requests

### 🔧 Pipeline Configuration

#### Triggers
- **Push events**: Automatically runs on pushes to main, develop, and feature branches
- **Pull requests**: Validates changes before merging
- **Manual dispatch**: On-demand execution with custom parameters

#### Parameters (Manual Execution)
- **Test Suite**: Choose which test suite to run
  - `TestLoginSuite.xml` (Login tests only)
  - `TestNG.xml` (All tests)
  - `all` (Run all available suites)
- **Environment**: Select target environment
  - `qa` (QA environment)
  - `uat` (UAT environment)
- **Browser**: Choose browser for testing
  - `chrome` (Default)
  - `firefox`
  - `edge`

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Environment URLs
```
QA_CRM_URL=https://mychildcareservicestest.crm3.dynamics.com/
UAT_CRM_URL=https://mychildcareservicesuat.crm3.dynamics.com/
```

### Authentication
```
CRM_USERNAME=your-test-username@gov.bc.ca
CRM_PASSWORD=your-secure-password
```

### Optional Notifications
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## Pipeline Jobs

### 1. Selenium Tests (`selenium-tests`)
- Sets up Java 17 and Maven
- Installs browsers and drivers
- Configures test environment
- Executes TestNG test suites
- Generates and uploads reports

### 2. Security Scan (`security-scan`)
- Scans for potential security vulnerabilities
- Checks for exposed credentials in source code
- Runs on pull requests only

### 3. Docker Tests (`docker-tests`)
- Builds containerized test environment
- Runs tests in isolated Docker container
- Executes on main branch pushes only

### 4. Notifications (`notify`)
- Sends Slack notifications on test completion
- Includes success/failure status
- Runs after all other jobs complete

## Local Development

### Prerequisites
- Java 17+
- Maven 3.9+
- Chrome/Firefox browser
- Git

### Setup
1. Clone the repository
2. Copy `config.sample.properties` to `config.properties`
3. Update configuration with your test credentials
4. Run tests locally:
   ```bash
   cd test/selenium
   mvn clean test -Dsuite=TestLoginSuite.xml
   ```

## Test Execution Examples

### Run Login Tests Only
```bash
# Manual trigger via GitHub UI
# Or via GitHub CLI:
gh workflow run selenium-tests.yml \
  -f test_suite=TestLoginSuite.xml \
  -f environment=qa \
  -f browser=chrome
```

### Run All Tests
```bash
gh workflow run selenium-tests.yml \
  -f test_suite=all \
  -f environment=uat \
  -f browser=firefox
```

## Artifacts and Reports

### Generated Artifacts
- **TestNG Reports**: `target/surefire-reports/`
- **ExtentReports**: `extent-reports/extent-report.html`
- **Test Logs**: `logs/selenium.log`
- **Screenshots**: `screenshots/` (on test failures)

### Report Access
1. Navigate to the workflow run in GitHub Actions
2. Download artifacts from the "Artifacts" section
3. Extract and open HTML reports in your browser

## Troubleshooting

### Common Issues

#### Tests Not Running
- Check that the test suite XML file exists
- Verify browser drivers are compatible
- Ensure all required secrets are configured

#### Authentication Failures
- Validate CRM_USERNAME and CRM_PASSWORD secrets
- Check environment URLs (QA_CRM_URL, UAT_CRM_URL)
- Verify account permissions

#### Browser Issues
- Update browser versions in pipeline
- Check WebDriverManager compatibility
- Review headless mode configuration

### Debug Mode
Enable debug logging by adding this to your test execution:
```bash
mvn test -Dsuite=TestLoginSuite.xml -X
```

## Contributing

1. Create feature branch from `develop`
2. Make your changes
3. Ensure tests pass locally
4. Create pull request
5. Pipeline will automatically validate changes

## Monitoring

### Success Metrics
- Test execution time
- Pass/fail rates by browser
- Environment-specific success rates

### Alerts
- Slack notifications for critical failures
- Email alerts for pipeline issues
- GitHub status checks for PR validation

---

For more information about the CCOF Selenium framework, see the main [README.md](../../README.md) file.