Selenium Testing

Instructions on how to install and run selenium tests

Environment Setup - Eclipse IDE

`Step 1` Download JDK 21

`Step 2` Download the Eclipse IDE

`Step 3` On the Eclipse marketplace, install the TestNG for Eclipse plugin

# Selenium Test Automation Project

This project contains automated test scripts built using Selenium WebDriver, Java, and TestNG.
It follows the Page Object Model (POM) design pattern and integrates with Extent Reports for detailed test reporting.

## Setup Instructions

1. **Clone the repository**

   git clone https://github.com/bcgov/EDUC-CCOF.git

   cd EDUC-CCOF

2. copy config.sample.properties config.properties

3. Open config.properties and update values for:

   qa_crm_url=

   uat_crm_url=

   crm_username=

   crm_password=

   browser=

4. Run Tests

   Add any test class tag names to testNG.xml that you would like to run

   From Eclipse: Right-click your TestNG runner → Run As → TestNG Suite

5. Reports & Logs

   Extent Reports: /extent-reports/

   Logs: /logs/

   TestNG default: /test-output/

Note: config.properties, logs, extent-reports and test-output are ignored from Git.
Each developer must maintain their own local config.properties file.
Run tests from testng in order to generate reports
Delete application test will work if we have any organization linked .
