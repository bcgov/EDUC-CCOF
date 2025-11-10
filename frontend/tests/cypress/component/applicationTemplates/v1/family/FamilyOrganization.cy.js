import FamilyOrganization from '@/components/applicationTemplates/v1/family/FamilyOrganization.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const fullPathStub = cy.stub();
    cy.mount(FamilyOrganization, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            fullPath: {
              includes: fullPathStub,
            },
          },
        },
      },
    });
  });
}

describe('<FamilyOrganization />', () => {
  it('should render default inputs', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
    });

    cy.contains('label', 'Legal Name (first, middle and last) or Organization');
    cy.contains('label', 'Incorporation Number (as it appears in BC Corporate Registry)');
    cy.contains('label', 'Name of Care Provider (if registered company)');
    cy.contains('label', 'Mailing Address');
    cy.contains('label', 'City/Town');
    cy.contains('label', 'Province');
    cy.contains('label', 'Postal Code');
    cy.contains('label', 'Year Facility began Operation (YYYY)');
    cy.contains('label', 'E-mail Address of Signing Authority');
    cy.contains('label', 'Business Phone');
    cy.contains('label', 'Business BCeID');
  });

  context('Checkbox functionality for Org and Mailing', () => {
    it('should render checkbox to check org address same as mailing', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
      });

      cy.contains('label', 'Organization Street Address same as Mailing Address')
        .closest('.v-input')
        .within(() => {
          cy.get('input[type="checkbox"');
        });
    });

    it('should not render additional address inputs when org address is same as mailing', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
      });

      cy.contains('label', 'Organization Street Address same as Mailing Address')
        .closest('.v-input')
        .within(() => {
          cy.get('input[type="checkbox"').click();
        });

      cy.contains('label', /^Street Address$/).should('not.exist');
    });

    it('should render additional address inputs when org address is same as mailing', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
      });

      cy.contains('label', /^Street Address$/).should('exist');
    });
  });
});
