Test Suite: groupProviderApp
This Robot Framework test suite automates Group Provider Application in the My ChildCare BC portal flow starting from login up to the Licence Upload page. This includes navigating multiple forms and validating inputs as a user would.
Using Robot Framework, SeleniumLibrary, and Python.

**Project Structure**

PythonProject/
│
├── Keywords/
│   ├── common_keywords.robot         # Shared utilities across test suites
│
├── Tests/
│   └── groupProviderApp/
│       ├── facility_info.robot       # Facility Info form automation
│
├── resources/
│   └── locators.robot                # Page elements (xpaths, ids, etc.)
│   └── variables.robot               # Global or test-specific data
│
├── libraries/                        # Custom Python-based libraries (if needed)
│
├── results/                          # Output logs and reports (after execution)
│
├── requirements.txt                  # Python package dependencies
├── log.html                          # Execution log (auto-generated)
├── report.html                       # Test execution report (auto-generated)
├── output.xml                        # Robot Framework output file
├── README.md                         # This documentation file


**Setup Instructions**
1. Create & Activate Virtual Environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
2. Install Dependencies
pip install -r requirements.txt

_Your requirements.txt should include:_
robotframework==7.0
robotframework-seleniumlibrary==6.1.0
selenium==4.20.0
python-dotenv==1.0.1

**Running the Tests**
robot -d results Tests/


_Run all test cases:_

_Run by tag (e.g., facilityinfo):_

robot --include facilityinfo -d results Tests/

**Reports**
After execution, check the results/ directory for:

report.html – high-level test report

log.html – detailed step-by-step execution trace


**Notes**

The portal uses Vue.js/Vuetify, requiring custom JS for interacting with hidden/overlayed elements.

Many actions (e.g., clicking checkboxes, dropdowns) are handled using Execute JavaScript.

Credentials needs to be added in variables.robot before running the test case


**Screenshot Upload**
The uploaded file (img.png) is located under:

resources/img.png
Make sure this file exists before running the test.

