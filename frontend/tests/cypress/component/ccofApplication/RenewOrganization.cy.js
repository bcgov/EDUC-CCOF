import RenewOrganization from '@/components/ccofApplication/RenewOrganization.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(RenewOrganization, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<RenewOrganization />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });
  it('should render component header', () => {
    mountWithPinia();
    cy.contains('div', 'Child Care Operating Funding Program -');
  });

  it('should contain banking information changed inputs', () => {
    mountWithPinia();

    cy.contains('p', 'Has your banking information changed?');
    cy.get('.v-radio-group').within(() => {
      cy.get('.v-radio').should('have.length', 2);
      cy.get('.v-radio').eq(0).should('have.text', 'Yes');
      cy.get('.v-radio').eq(1).should('have.text', 'No');
    });
  });

  it('should render `Do not continue` text if banking info changes', () => {
    mountWithPinia();

    cy.get('.v-radio-group').within(() => {
      cy.get('.v-radio').eq(0).click();
    });

    cy.contains('Do not continue.');
    cy.contains('Update your banking information by submitting the');
    cy.get('a')
      .contains('Direct Deposit Application')
      .should(
        'have.attr',
        'href',
        'https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf',
      );
  });

  it('should render navigation buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
  });
});
