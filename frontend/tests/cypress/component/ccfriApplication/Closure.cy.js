import Closures from '@/components/ccfriApplication/Closures.vue';
import vuetify from '@/plugins/vuetify';
import { CCFRI_FEE_CORRECT_TYPES } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(Closures, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<Closures />', () => {
  it('should render default content', () => {
    mountWithPinia();

    cy.contains('h2', 'Child Care Fee Reduction Initiative (CCFRI)');
    cy.contains('p', 'It is important to tell us your planned closures for the');
  });

  it('should render card with content and radio group', () => {
    mountWithPinia();
    cy.contains('.v-card', 'Do you charge parent fees at this facility for any closures on business days?');
    cy.get('input[type="radio"]').should('have.length', 2);
    cy.get('.v-radio').eq(0).find('label').should('have.text', 'Yes');
    cy.get('.v-radio').eq(1).find('label').should('have.text', 'No');
  });

  it('should render application closure card', () => {
    mountWithPinia({
      ccfriApp: {
        CCFRIFacilityModel: {
          hasClosureFees: CCFRI_FEE_CORRECT_TYPES.YES,
        },
      },
    });
    cy.contains('button', 'Add New Closure');
  });

  it('should render navigation buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
