import { setActivePinia } from 'pinia';

import { createTestingPinia } from '@pinia/testing';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

/**
 * Sets up a Pinia testing instance with customizable options.
 *
 * @param {Object} [options] - Configuration options for the Pinia testing instance.
 * @param {Object} [options.initialState={}] - Initial state to preload into the Pinia stores.
 * @param {Function|null} [options.createSpy=cy.spy] - Function to spy on store actions/getters.
 *   Defaults to `cy.spy`
 * @param {boolean|null} [options.stubActions=false] - Whether to replace store actions with no-op stubs.
 *   When `true`, actions are stubbed and spied on instead of running their real implementations.
 *   Pass `null` to omit this option
 *   Defaults to `false`
 * @returns {Cypress.Chainable<Pinia>} - Chainable Cypress wrapper around the Pinia instance.
 */
Cypress.Commands.add('setupPinia', ({ initialState = {}, createSpy = cy.spy, stubActions = false } = {}) => {
  const options = { initialState };
  if (createSpy !== null) options.createSpy = createSpy;
  if (stubActions !== null) options.stubActions = stubActions;

  const pinia = createTestingPinia(options);
  setActivePinia(pinia);
  return cy.wrap(pinia);
});

Cypress.Commands.add('mockJwt', () => {
  globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
});

Cypress.Commands.add('clearJwt', () => {
  globalThis.localStorage.removeItem('jwtToken');
});
