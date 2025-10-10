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
// ///<reference types="Cypress" />

// <reference types="Cypress-xpath"/>

//<reference types="cypress" />
// cypress/support/commands.js
// cypress/support/e2e.js  (or e2e.ts)

// Updated with new Cypress Version
Cypress.SelectorPlayground.defaults({
  selectorPriority: [
    'data-cy',       
    'data-test',
    'data-testid',
    'id',
    'class',
    'tag',
    'attributes',
    'nth-child',
  ],
})

const CONTROL_SELECTOR = [
  'input:not([type="hidden"])',
  'textarea',
  'select',
  '[contenteditable="true"]',
  '[role="textbox"]'
].join(', ');

/**
 * getByLabel(labelText, options?)
 *  - Finds a form control associated with a visual/accessible label.
 *  - Returns a Cypress chainable to the **real input** whenever possible.
 *  - If the label uses `for="id"`, returns `cy.get('#id')` (re-queries each time).
  */
 
Cypress.Commands.add('getByLabel', (labelText, options = {}) => {
  const {
    timeout = 20000,
    matchCase = false,
    includeShadowDom = true,
  } = options;

  return cy
    .contains('label, [aria-label], [data-label]', labelText, {
      timeout,
      matchCase,
      includeShadowDom,
    })
    
    .should('exist')
    .then(($label) => {
      const labelEl = $label[0];
      const doc = labelEl.ownerDocument;
      const body = doc.body;

      // 1) Label with for="id" → prefer re-queryable selector (survives rerenders)
      const forId = labelEl.getAttribute?.('for');
      if (forId) {
               return cy.get(`#${CSS.escape(forId)}`, { timeout });
      }

      // 2) Control nested inside the label (common HTML pattern)
      const nestedControl =
        labelEl.querySelector('.v-field__input input, .v-field__input textarea, .v-field__input [contenteditable="true"]') ||
        labelEl.querySelector(CONTROL_SELECTOR);
      if (nestedControl) {
        return cy.wrap(nestedControl);
      }

      // 3) Vuetify pattern: find the closest field container then the real control
      const fieldContainer =
        labelEl.closest('.v-field, .v-input, .v-text-field') ||
        labelEl.parentElement?.querySelector?.('.v-field, .v-input, .v-text-field') ||
        labelEl.parentElement?.nextElementSibling;

      if (fieldContainer) {
        const realControl =
          fieldContainer.querySelector('.v-field__input input, .v-field__input textarea, .v-field__input [contenteditable="true"]') ||
          fieldContainer.querySelector(CONTROL_SELECTOR);

        if (realControl) {
          return cy.wrap(realControl);
        }
      }

      // 4) aria-labelledby (support multiple IDs in the attribute)
      if (!labelEl.id) {
        labelEl.id = `lbl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }
      const targetViaAria = Array.from(body.querySelectorAll('[aria-labelledby]'))
        .find((el) => (el.getAttribute('aria-labelledby') || '')
          .split(/\s+/)
          .includes(labelEl.id));
      if (targetViaAria) {
        return cy.wrap(targetViaAria);
      }

      // 5) Last resort: return the label (caller may .click() to focus)
      return cy.wrap(labelEl);
    });
});



Cypress.Commands.add('selectByLabel', (labelText, optionText) => {
  cy.getByLabel(labelText).click({ force: true })
  return cy
    .get('.v-overlay-container .v-list-item__content', { timeout: 10000 })
    .contains(optionText)
    .should('be.visible')
    .click({ force: true })
})


Cypress.Commands.add('clickByText', (text, selector = 'button') => {
  cy.contains(selector, text, { matchCase: false }, {timeout: 10000})
    .should('be.visible', {timeout: 20000})
    
    .should(($btn) => {
      const el = $btn[0]
      const ariaBusy = el.getAttribute('aria-busy')
      const pointerEvents = getComputedStyle(el).pointerEvents
      const isLoadingClass = $btn.hasClass('v-btn--loading')
      expect(isLoadingClass, 'not loading class').to.eq(false)
      expect(ariaBusy === 'true', 'aria-busy true').to.eq(false)
      expect(pointerEvents, 'pointer-events').to.not.eq('none')
      expect(el.hasAttribute('disabled'), 'disabled attr').to.eq(false)
    })
    .click({force:true}) 
})


Cypress.Commands.add('startNewApp', () => {
  cy.url().should('eq', Cypress.env('CYPRESS_PORTAL_BASE_URL')).then(()=> {
      cy.contains('What would you like to do?').should('be.visible').clickByText('Start Application')
      cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)').should('be.visible').clickByText('Start Application')
      cy.contains('Group Provider').should('be.visible').clickByText('Start Application')
  })
});

/*
* Method to Cancel the application if the button is present
**/
Cypress.Commands.add('cancelApplicationIfPresent', () => {
  cy.wait(10000);
  cy.document({ timeout: 30000 }).then((doc) => {
    const btn = Array.from(doc.querySelectorAll('button')).find(
      (el) => el.textContent.trim() === 'Cancel Application'
    );

    if (btn) {
      cy.wrap(btn).click({ force: true });

      cy.get('#cancel-application-button .text-wrap', { timeout: 20000 })
        .should('be.visible')
        .click({ force: true });

      cy.contains('What would you like to do?', { timeout: 50000 })
        .should('be.visible');
    }
  });
});
/*
* Method to type a value into an input field and assert its value
**/
Cypress.Commands.add('typeAndAssert', { prevSubject: true }, (subject, value) => {
  const v = String(value);

  return cy.wrap(subject).then(($el) => {
    cy.wrap($el).clear({ force: true }).type(v, { force: true });
  });
});

/*
* Method to assert that an input field is auto-filled
**/
Cypress.Commands.add('assertAutoFilled', (label) => {
  cy.getByLabel(label)
    .invoke('val')
    .then((val) => {
      expect(val && val.trim(), `Value for ${label}`).to.not.be.empty
    })
})

/*
* Method to assert that an input field is auto-filled
**/
Cypress.Commands.add('assertAutoFilledNotEmpty', (labels) => {
  labels.forEach((l) => cy.assertAutoFilled(l))
})


/*
* Method to set a time value in a time input field
**/
Cypress.Commands.add('setTime', (hook, hhmm) => {
  const v = String(hhmm);
  cy.get(`[data-cy="${hook}"] input[type="time"], [data-cy="${hook}"] .v-field__input input`, { timeout: 20000 })
    .first()
    .as('timeInput');
  cy.get('@timeInput').then($input => {
    cy.wrap($input).invoke('val', v);
  });
  cy.get('@timeInput').then($input => {
    cy.wrap($input).trigger('input');
  });
  cy.get('@timeInput').then($input => {
    cy.wrap($input).trigger('change');
  });
  cy.get('@timeInput').then($input => {
    cy.wrap($input).blur();
  });
  cy.wait(1000);
  cy.get(`[data-cy="${hook}"] input[type="time"], [data-cy="${hook}"] .v-field__input input`)
    .first()
    .should('have.value', v);
})

/*
* Method to Continue the application if the button is present
**/
Cypress.Commands.add('continueApplicationIfPresent', () => {
  cy.wait(10000)
  cy.document({ timeout: 30000 }).then((doc) => {
    cy.get('.pb-12.text-h4.text-center').contains('What would you like to do?', {timeout: 10000}).should('be.visible')
    const btn = Array.from(doc.querySelectorAll('button')).find(
      (el) => el.textContent.trim() === 'Continue Application'
    );

    if (btn) {
      cy.wrap(btn).click({ force: true });
      cy.wait(10000)
    }
  });
});