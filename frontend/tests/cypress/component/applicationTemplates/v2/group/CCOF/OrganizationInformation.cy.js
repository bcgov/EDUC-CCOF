import OrganizationInformation from '@/components/applicationTemplates/v2/group/CCOF/OrganizationInformation.vue';
import vuetify from '@/plugins/vuetify';
import { ORGANIZATION_TYPES } from '@/utils/constants.js';

const mountWithOrgType = (type) => {
  mountWithPinia({
    organization: {
      organizationModel: { organizationType: type },
    },
  });
};

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

  context('Partnership Card', () => {
    beforeEach(() => {
      mountWithOrgType(ORGANIZATION_TYPES.PARTNERSHIP);
    });
    it('should render default inputs for two partners', () => {
      mountWithPinia({
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

  context('Sole Proprietorship', () => {
    beforeEach(() => {
      mountWithOrgType(ORGANIZATION_TYPES.SOLE_PROPRIETORSHIP);
    });
    it('should render sole proprietorship inputs', () => {
      cy.contains('label', 'Full Legal Name of Sole Proprietor (Licensee)');
      cy.contains('label', 'Business Phone');
      cy.contains('label', 'Email Address');
    });

    it('should not render organization contact info if sole proprietorship', () => {
      cy.contains('label', 'Organization Contact Information').should('not.exist');
    });
  });

  context('Non Profit Society', () => {
    beforeEach(() => {
      mountWithOrgType(ORGANIZATION_TYPES.NON_PROFIT_SOCIETY);
    });
    it('should render inputs for neither partnership nor sole proprietorship', () => {
      cy.contains('label', 'Legal Organization Name (as it appears in BC Registries and Online Services)');
    });

    it('should render incorporation number input', () => {
      cy.contains('label', 'Incorporation Number (as it appears in BC Registries and Online Services)');
    });

    it('should render org address same as mailing address', () => {
      cy.contains('label', 'Organization Street Address same as Mailing Address');
    });

    it('should render organization contact info if not sole proprietorship', () => {
      cy.contains('Organization Contact Information');
      cy.contains('label', 'Business Phone');
      cy.contains('label', 'Email Address');
    });
  });
});
