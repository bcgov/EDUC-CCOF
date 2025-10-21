import CcofApplicationTypeSelector from '@/components/ccofApplication/CcofApplicationTypeSelector.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS, pcfUrl } from '@/utils/constants.js';

const programYearId = '1234';

function verifyExternalLink(linkText, expectedHref) {
  cy.contains(linkText).should('have.prop', 'href').and('eq', expectedHref);
  cy.contains(linkText).should('have.attr', 'target', '_blank');
}

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
    verifyExternalLink(
      'Family Form',
      'https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1320_ccof_family_application.pdf',
    );
  });

  it('should render the Group Form link correctly', () => {
    verifyExternalLink(
      'Group Form',
      'https://www2.gov.bc.ca/assets/gov/family-and-social-supports/child-care/childcarebc-programs/ccof/cf1321_ccof_group_application.pdf',
    );
  });

  it('should render the Base Funding eligibility link correctly', () => {
    verifyExternalLink(
      'Child Care Operating Funding - Base Funding',
      'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/base-funding',
    );
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
