import RenewOrganization from '@/components/ccofApplication/RenewOrganization.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(RenewOrganization, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      data() {
        return {
          ...dataOverride,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
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

  it('should render funding agreement radio selection', () => {
    mountWithPinia();
    cy.contains('Do your current licence and service details match the information')
      .closest('.v-row')
      .within(() => {
        cy.contains('.v-radio', 'Yes');
        cy.contains('.v-radio', 'No');
      });
  });

  it('should render `Do not continue` card if not funding group', () => {
    mountWithPinia({}, { fundingGroup: 'false' });
    cy.contains('Do not continue.');
    cy.contains('router-link', 'Go to Report a Change');
  });

  it('should render change in banking information inputs', () => {
    mountWithPinia();
    cy.contains('Has your banking information change')
      .closest('.v-row')
      .within(() => {
        cy.contains('.v-radio', 'Yes');
        cy.contains('.v-radio', 'No');
      });
  });

  it('should render card if banking group', () => {
    mountWithPinia({}, { bankingGroup: 'true' });
    cy.contains('Once these changes have been processed, you may complete your');
    cy.get('a')
      .contains('Direct Deposit Application')
      .should(
        'have.attr',
        'href',
        'https://www2.gov.bc.ca/assets/gov/british-columbians-our-governments/services-policies-for-government/internal-corporate-services/finance-forms/fin-312-direct-deposit-application.pdf',
      );
  });

  it('should render card if banking group', () => {
    mountWithPinia();
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
  });
});
