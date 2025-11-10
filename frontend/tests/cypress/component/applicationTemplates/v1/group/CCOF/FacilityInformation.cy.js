import FacilityInformationV1 from '@/components/applicationTemplates/v1/group/CCOF/FacilityInformation.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(FacilityInformationV1, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<FacilityInformationV1 />', () => {
  it('should render component header', () => {
    mountWithPinia();
    cy.contains('h3', 'Facility Information');
  });

  it('should render all required fields', () => {
    mountWithPinia();

    cy.contains('label', 'Facility Name (as it appears on the Community Care and Assisted Living Act Licence)');
    cy.contains('label', 'Year Facility Began Operation (YYYY)').should('exist');
    cy.contains('label', 'Facility Street Address').should('exist');
    cy.contains('label', 'City/Town').should('exist');
    cy.contains('label', 'Postal Code').should('exist');
    cy.contains('label', 'Facility Contact Name').should('exist');
    cy.contains('label', 'Position').should('exist');
    cy.contains('label', 'Business Phone').should('exist');
    cy.contains('label', 'Facility Email Address').should('exist');
    cy.contains('label', 'Facility Licence Number').should('exist');
    cy.contains('label', 'Effective Date of Current Licence').should('exist');
  });

  it('should render radio group', () => {
    mountWithPinia();

    cy.get('.v-radio-group')
      .eq(0)
      .within(() => {
        cy.get('.v-radio').should('have.length', 3);
        cy.contains(
          'Has this facility or you as the applicant ever received funding under the Child Care Operating Funding Program?',
        );
        cy.contains('No');
        cy.contains('Yes');
        cy.contains('Yes, as facility');
      });
  });
});
