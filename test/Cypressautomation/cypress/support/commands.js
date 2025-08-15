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

///<reference types="Cypress" />

// <reference types="Cypress-xpath"/>

//<reference types="cypress" />
// cypress/support/commands.js

const CONTROL_SELECTOR = [
  'input',
  'textarea',
  '[contenteditable="true"]',
  'select',
  '[role="textbox"]',
  '[role="combobox"]',
  '[role="checkbox"]',
  '[role="radio"]'
].join(', ')

Cypress.Commands.add('getByLabel', (labelText) => {
  // 1) find the label by text (case-insensitive)
  return cy.contains('label, [aria-label], [data-label]', labelText, { matchCase: false })
    .should('be.visible')
    .then(($label) => {
      const labelEl = $label[0]
      const body = labelEl.ownerDocument.body

      // 2) if label is connected via for="id"
      const forId = labelEl.getAttribute && labelEl.getAttribute('for')
      if (forId) {
        const byFor = body.querySelector(`#${CSS.escape(forId)}`)
        if (byFor) return cy.wrap(byFor)
      }

      // 3) control inside the label
      let inside = labelEl.querySelector(CONTROL_SELECTOR)
      if (inside) return cy.wrap(inside)

      // 4) Vuetify structure: climb to closest v-field/v-input, then find the real control
      const fieldContainer = labelEl.closest('.v-field, .v-input, .v-text-field') ||
                             labelEl.parentElement?.querySelector?.('.v-field, .v-input, .v-text-field') ||
                             labelEl.parentElement?.nextElementSibling
      if (fieldContainer) {
        const realControl =
          fieldContainer.querySelector('.v-field__input input, .v-field__input textarea, .v-field__input [contenteditable="true"]') ||
          fieldContainer.querySelector(CONTROL_SELECTOR)
        if (realControl) return cy.wrap(realControl)
      }

      // 5) aria-labelledby
      if (!labelEl.id) labelEl.id = `lbl-${Date.now()}-${Math.random().toString(36).slice(2)}`
      const aria = body.querySelector(`[aria-labelledby="${CSS.escape(labelEl.id)}"]`)
      if (aria) return cy.wrap(aria)

      // 6) last resort: return the label itself (caller can .click())
      return cy.wrap(labelEl)
    })
})


Cypress.Commands.add('selectByLabel', (labelText, optionText) => {
  cy.getByLabel(labelText).click({ force: true })
  return cy
    .get('.v-overlay-container .v-list-item__content', { timeout: 10000 })
    .contains(optionText)
    .should('be.visible')
    .click({ force: true })
})


Cypress.Commands.add('clickByText', (text, selector = 'button') => {
  cy.contains(selector, text, { matchCase: false })
    .should('be.visible')
    
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
    .click() 
})



Cypress.Commands.add('cancelApplicationIfPresent', () => {
  // Query the DOM synchronously via jQuery to avoid failing if not found
  //cy.wait(10000);
   cy.document({ timeout: 15000 }).should((doc) => {
    const btn = Array.from(doc.querySelectorAll('button')).find(
      (el) => el.textContent.trim() === 'Cancel Application'
    );
    // Fail the should if not found yet → Cypress retries until timeout
    // eslint-disable-next-line no-unused-expressions
    expect(btn, 'Cancel Application button').to.exist;
  });
  cy.document().then((doc) => {
    // Prefer data-cy when available: $body.find('[data-cy="cancel-application"]')
    const btn = Array.from(doc.querySelectorAll('button')).find(
      (el) => el.textContent.trim() === 'Cancel Application'
    )

    if (btn) {
      cy.wrap(btn).click({ force: true })
      cy.get('#cancel-application-button .text-wrap', { timeout: 15000 })
        .should('be.visible')
        .click({ force: true })
      cy.contains('What would you like to do?', { timeout: 10000 })
        .should('be.visible')
    }
    // If not found, do nothing — start state is already clean
  })
})


/*Cypress.Commands.add('typeAndAssert', { prevSubject: true }, (subject, value) => {
  return cy.wrap(subject).clear().type(value).should('have.value', value)
})**/
// stronger type+assert that re-queries after typing
Cypress.Commands.add('typeAndAssert', { prevSubject: true }, (subject, value) => {
  const v = String(value)
  return cy.wrap(subject).then($el => {
    const id = $el.attr('id')
    // type (force helps with masked/transparent inputs)
    cy.wrap($el).clear({ force: true }).type(v, { force: true }).blur()

    // re-query the element for the assertion (prevents detached subject)
    if (id) {
      return cy.get(`#${CSS.escape(id)}`).should('have.value', v)
    }
    // fallback: find the current input in the same field container
    return cy.wrap($el)
      .closest('.v-field, .v-input, .v-text-field')
      .find('input, textarea, [contenteditable="true"]')
      .first()
      .should('have.value', v)
  })
})


// cypress/support/commands.js

// Base command: checks a single label for a non-empty value
Cypress.Commands.add('assertAutoFilled', (label) => {
  cy.getByLabel(label) // use your existing getByLabel command
    .invoke('val')
    .then((val) => {
      expect(val && val.trim(), `Value for ${label}`).to.not.be.empty
    })
})

// Wrapper: checks multiple labels at once
Cypress.Commands.add('assertAutoFilledNotEmpty', (labels) => {
  labels.forEach((l) => cy.assertAutoFilled(l))
})


