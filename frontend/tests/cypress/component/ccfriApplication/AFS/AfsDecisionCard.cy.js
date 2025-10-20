import AfsDecisionCard from '@/components/ccfriApplication/AFS/AfsDecisionCard.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

function mountWithPinia(initialState = {}, readOnly = false) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(AfsDecisionCard, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        readonly: readOnly,
      },
    });
  });
}

describe('<AfsDecisionCard />', () => {
  it('should render card text and radio buttons', () => {
    mountWithPinia();

    cy.contains('div', 'Please select one of the following options regarding the approvable fee schedule:');
    cy.get('input').should('have.length', 3);
    cy.get('label').should('have.length', 3);
    cy.get('label').eq(0).should('have.text', 'I accept');
    cy.get('label').eq(1).should('have.text', 'I want to upload supporting documents');
    cy.get('label').eq(2).should('have.text', 'I decline');
  });

  it('should enable the radio group', () => {
    mountWithPinia();
    cy.get('.v-radio-group').should('not.have.css', 'pointer-events', 'none');
  });

  it('should disable the radio group', () => {
    mountWithPinia({}, true);
    cy.get('.v-radio-group').should('have.css', 'pointer-events', 'none');
  });

  it('should display accept message when `I accept` radio selected', () => {
    mountWithPinia();
    cy.get('input').eq(0).click();
    cy.contains(
      'After submission please wait to receive notification confirming your approval to participate in CCFRI.',
    );
  });

  it('should display decline message when `I decline` radio selected', () => {
    mountWithPinia();
    cy.get('input').eq(2).click();
    cy.contains(
      'After submission please wait to receive confirmation from the ministry on the results of your CCFRI application.',
    );
  });

  it('should not render `I decline` radio button', () => {
    mountWithPinia({
      navBar: {
        currentUrl: PATHS.PREFIX.CHANGE_REQUEST,
      },
    });

    cy.get('input').should('have.length', 2);
    cy.contains('I decline').should('not.exist');
  });
});
