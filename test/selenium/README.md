Selenium Testing

Instructions on how to install and run selenium tests

Environment Setup - Eclipse IDE

`Step 1` Download JDK 21

`Step 2` Download the Eclipse IDE

`Step 3` On the Eclipse marketplace, install the TestNG for Eclipse plugin

# Selenium Test Automation Project

## 🚀 Setup Instructions

1. **Clone the repository**

   git clone < repo - url >

   cd < project-folder >

2. cp config.sample.properties config.properties # Mac/Linux
   copy config.sample.properties config.properties # Windows

3. Open config.properties and update values for:

username / password → your login credentials

Any other settings as per your environment

4. Run Tests

From Eclipse: Right-click your TestNG runner → Run As → TestNG Suite

5. Reports & Logs

Extent Reports: /extent-reports/

Logs: /logs/

TestNG default: /test-output/

Note: config.properties, logs, extent-reports and test-output are ignored from Git.
Each developer must maintain their own local config.properties file.
Run tests from testng in order to generate reports
Delete application test will work if we have any organization linked .
