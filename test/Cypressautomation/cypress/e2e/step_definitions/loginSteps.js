import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given('the user is on the login page', () => {
  cy.visit('https://qa.mychildcareservices.gov.bc.ca/login');
});
When ('the user click on login', () => {
    cy.get('button[id="login-button"]').click();
});
 /*
When('the user enters valid credentials', () => {
  cy.get('#username').type('testuser');
  cy.get('#password').type('Password123');
  cy.get('form').submit();
});*/
Then('the user should be redirected to the login credentials page ', () => {
  cy.contains('Log in to sfstest7.gov.bc.ca')    // Or some dashboard text
    .should('be.visible');
});

