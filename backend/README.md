## CCOF Backend
The Node.js backend for the CCOF application that handles authentication, authorization, and session management.
This project was built using the EDUC-EDX project as a template.  
You may see references to the EDX project until we  get this properly cleaned up.

### Local Setup
 **`Step 1`**. make sure you have Node.js installed in your local machine. if not download from here https://nodejs.org/en/ 
 
 **`Step 2`**. Add NODE_ENV=local as environment variable.
 
 **`Step 3`**. Ask for local.json file which contains all the configs from teammate, or create it by following config maps from oc console.
 
 **`Step 4`**. run `npm install` in command line from backend folder, to install required dependencies.
 
 **`Step 5`**. run `npm run serve` in command line from backend folder, to run the app.

 **`NOTE`**. SSO not built out yet - try localhost:8082/fri-calculator to see if local build works without authentication.
`Unit Tests`
    run `npm run test` in command line from backend folder, to execute unit tests.

