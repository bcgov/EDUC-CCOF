import OrganizationInformationV1 from '@/components/applicationTemplates/v1/group/CCOF/OrganizationInformation.vue';
import vuetify from '@/plugins/vuetify';

const createAuthStore = () => {
  return {
    auth: {
      userInfo: { userName: 'TEST-USERNAME' },
    },
  };
};

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(OrganizationInformationV1, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<OrganizationInformationV1 />', () => {
  it('should render default inputs', () => {
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('h3', 'Organization Information');
    cy.contains('label', 'Legal Name (first, middle and last) or Organization');
    cy.contains('label', 'Incorporation Number (as it appears');
    cy.contains('label', 'Mailing Address');
    cy.contains('label', 'City/Town');
    cy.contains('label', 'Province');
    cy.contains('label', 'Postal Code');
  });

  it('should render change request in progress card', () => {
    mountWithPinia({
      ...createAuthStore(),
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

  it('should render contact information inputs', () => {
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('Contact Information');
    cy.contains('label', 'Organization Contact Name');
    cy.contains('label', 'Business Phone');
    cy.contains('label', 'E-mail Address of Signing Authority');
  });

  it('should render type of organization radio group', () => {
    const n1 = 'n1';
    const n2 = 'n2';
    const n3 = 'n3';
    mountWithPinia({
      ...createAuthStore(),
      app: {
        organizationTypeList: [
          { name: n1, id: '1' },
          { name: n2, id: '2' },
          { name: n3, id: '2' },
        ],
      },
    });

    cy.contains('Type of Organization')
      .closest('.v-row')
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.contains(n1);
        cy.contains(n2);
        cy.contains(n3);
      });
  });
});
