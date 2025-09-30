// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'vuetify/styles';

import './commands';

import { mount } from 'cypress/vue';
import { h } from 'vue';

// HACK: The first test file often fails on a cold start after an `npm i`,
// but all other tests pass without issues. After the initial test run, the problem
// does not reoccur. This temporary fix mounts a hidden dummy component to warm up
// the environment - needed for CI/CD until a proper solution is found.
before(() => {
  cy.mount({
    render() {
      return h('div', { style: 'display: none' }, 'Warmup');
    },
  });
});

Cypress.Commands.add('mount', mount);
