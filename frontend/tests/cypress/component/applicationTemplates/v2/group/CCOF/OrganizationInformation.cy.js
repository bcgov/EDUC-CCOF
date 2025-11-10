import OrganizationInformation from '@/components/applicationTemplates/v2/group/CCOF/OrganizationInformation.vue';
import vuetify from '@/plugins/vuetify';
import { ORGANIZATION_TYPES } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const fullPathStub = cy.stub();
    cy.mount(OrganizationInformation, {
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

describe('<OrganizationInformation /> -- V2', () => {
  it('should render default text', () => {
    mountWithPinia();
    cy.contains('h3', 'Organization Information');
    cy.contains('p', 'Type of Organization');
  });

  it('should render change request in progress card', () => {
    mountWithPinia({
      reportChanges: {
        changeRequestStore: [{ externalStatus: 2, changeActions: [{ changeType: '' }] }],
      },
      application: {
        applicationStatus: 'SUBMITTED',
      },
    });
    cy.contains('You have a change request in progress.');
    cy.contains(
      'We will complete the assessment of your Program Confirmation Form once your change has been processed.',
    );
  });

  it('should render type of organization radio group', () => {
    const n1 = 'n1';
    const n2 = 'n2';
    const n3 = 'n3';
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      app: {
        organizationTypeList: [
          { name: n1, id: '1' },
          { name: n2, id: '2' },
          { name: n3, id: '2' },
        ],
      },
    });

    cy.contains('Type of Organization')
      .closest('div')
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.contains(n1);
        cy.contains(n2);
        cy.contains(n3);
      });
  });

  context('Partnership Card', () => {
    it('should render default inputs for two partners', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
        organization: {
          organizationModel: {
            organizationType: ORGANIZATION_TYPES.PARTNERSHIP,
          },
        },
      });

      cy.contains('label', 'First Name');
      cy.contains('Middle Name (if applicable)');
      cy.contains('label', 'Last Name');
      cy.contains('label', 'Doing Business As');
    });

    it('should render add another partner button', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
        organization: {
          organizationModel: {
            organizationType: ORGANIZATION_TYPES.PARTNERSHIP,
          },
        },
      });

      cy.contains('button', 'Add Additional Partner');
    });

    it('should not render add another partner button', () => {
      mountWithPinia({
        auth: {
          userInfo: {
            userName: 'TEST-USERNAME',
          },
        },
        organization: {
          organizationModel: {
            organizationType: ORGANIZATION_TYPES.PARTNERSHIP,
          },
        },
      });

      cy.contains('button', 'Add Additional Partner').click();
      cy.contains('button', 'Add Additional Partner').click();
      cy.contains('button', 'Add Additional Partner').should('not.exist');
    });
  });

  it('should render sole proprietorship inputs', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP,
        },
      },
    });
    cy.contains('label', 'Full Legal Name of Sole Proprietor (Licensee)');
    cy.contains('label', 'Business Phone');
    cy.contains('label', 'Email Address');
  });

  it('should render inputs for neither partnership nor sole proprietorship', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.NON_PROFIT_SOCIETY,
        },
      },
    });
    cy.contains('label', 'Legal Organization Name (as it appears in BC Registries and Online Services)');
  });

  it('should render incorporation number input', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.NON_PROFIT_SOCIETY,
        },
      },
    });
    cy.contains('label', 'Incorporation Number (as it appears in BC Registries and Online Services)');
  });

  it('should render org address same as mailing address', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.NON_PROFIT_SOCIETY,
        },
      },
    });
    cy.contains('label', 'Organization Street Address same as Mailing Address');
  });

  it('should not render organization contact info if sole proprietorship', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP,
        },
      },
    });
    cy.contains('label', 'Organization Contact Information').should('not.exist');
  });

  it('should render organization contact info if not sole proprietorship', () => {
    mountWithPinia({
      auth: {
        userInfo: {
          userName: 'TEST-USERNAME',
        },
      },
      organization: {
        organizationModel: {
          organizationType: ORGANIZATION_TYPES.NON_PROFIT_SOCIETY,
        },
      },
    });
    cy.contains('Organization Contact Information');
    cy.contains('label', 'Business Phone');
    cy.contains('label', 'Email Address');
  });
});
