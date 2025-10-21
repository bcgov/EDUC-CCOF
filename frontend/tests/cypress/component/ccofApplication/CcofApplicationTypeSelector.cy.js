import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, FILE_REQUIREMENTS_TEXT, PATHS, pcfUrl } from '@/utils/constants.js';

const programYearId = '1234';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(CcofApplicationTypeSelector, {
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

describe('<CcofApplicationTypeSelector />', () => {
  beforeEach(() => {
    mountWithPinia({
      app: {
        programYearList: {
          newApp: {
            programYearId,
          },
        },
      },
    });
  });
  it('should render title and proper links', () => {
    cy.contains('p', 'Welcome to Child Care Operating Funding (CCOF)');
    cy.contains('a', 'Family Form');
  });

  it('should render the Family Form link correctly', () => {
    cy.contains('Family Form')
      .should('have.prop', 'href')
      .and(
        'eq',
        'https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1320_ccof_family_application.pdf',
      );

    cy.contains('Family Form').should('have.attr', 'target', '_blank');
  });

  it('should render the Group Form link correctly', () => {
    cy.contains('Group Form')
      .should('have.prop', 'href')
      .and(
        'eq',
        'https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1321_ccof_group_application.pdf',
      );

    cy.contains('Group Form').should('have.attr', 'target', '_blank');
  });

  it('should render the Base Funding eligibility link correctly', () => {
    cy.contains('Child Care Operating Funding - Base Funding')
      .should('have.prop', 'href')
      .and(
        'eq',
        'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/base-funding',
      );

    cy.contains('Child Care Operating Funding - Base Funding').should('have.attr', 'target', '_blank');
  });

  it('renders the Base Funding eligibility link correctly', () => {
    cy.contains('Child Care Operating Funding - Base Funding')
      .should('have.prop', 'href')
      .and(
        'eq',
        'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/base-funding',
      );

    cy.contains('Child Care Operating Funding - Base Funding').should('have.attr', 'target', '_blank');
  });

  it('should render both `Group Provider` and `Family Provider` cards', () => {
    cy.contains('.v-card-title', 'Group Provider');
    cy.contains('.v-card-title', 'Family Provider');
  });

  it('should render group `Start Application` and navigate on click', () => {
    cy.contains('Group Provider')
      .closest('.v-card')
      .within(() => {
        cy.contains('button', 'Start Application').click();
      });

    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.CCOF_GROUP_ORG, programYearId));
  });

  it('should render family `Start Application` and navigate on click', () => {
    cy.contains('Family Provider')
      .closest('.v-card')
      .within(() => {
        cy.contains('button', 'Start Application').click();
      });

    cy.get('@routerPush').should('have.been.calledWith', pcfUrl(PATHS.CCOF_FAMILY_ORG, programYearId));
  });
});
