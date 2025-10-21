import AddNewFees from '@/components/ccfriApplication/group/AddNewFees.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS, pcfUrlGuid } from '@/utils/constants.js';

const ccfriApplicationId = 1234;

const baseAppState = {
  app: {
    programYearList: {
      list: [],
    },
  },
};

function mountWithPinia(initialState, routeParams, overrides = {}) {
  initialState = initialState || {};
  routeParams = routeParams || { urlGuid: ccfriApplicationId };

  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(AddNewFees, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: routeParams,
          },
          $router: {
            push: pushStub,
          },
        },
      },
      data() {
        return {
          ...overrides,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<AddNewFees />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });

  it('should render AddNewFeesV1', () => {
    mountWithPinia({ ...baseAppState });

    cy.contains('.v-card', 'Do you charge parent fees at this facility for any closures on business days?');
  });

  it('should render AddNewFeesV2', () => {
    mountWithPinia({
      ...baseAppState,
      application: {
        applicationTemplateVersion: 2,
      },
    });

    cy.contains('.v-card', 'Do you charge parent fees at this facility for any closures on business days?').should(
      'not.exist',
    );
  });

  it('should render rfi dialog', () => {
    mountWithPinia({ ...baseAppState }, {}, { showRfiDialog: true });

    cy.contains('h3', 'Request for Information');
    cy.contains('You have entered a parent fee above the parent fee increase limit for the following care categories:');
    cy.contains('button', 'Continue');
  });

  it('should not render rfi dialog', () => {
    mountWithPinia({ ...baseAppState }, {}, { showRfiDialog: false });

    cy.contains('h3', 'Request for Information').should('not.exist');
  });

  it('should render rfi percentage categories', () => {
    const rfi3percentCategories = ['Category1', 'Category2', 'Category3'];
    mountWithPinia({ ...baseAppState }, {}, { showRfiDialog: true, rfi3percentCategories });

    for (const category of rfi3percentCategories) {
      cy.contains(category).should('exist');
    }
  });

  it('should navigate to rfi on clicking `Continue`', () => {
    const programYearId = 2222;
    mountWithPinia(
      {
        ...baseAppState,
        navBar: {
          navBarList: [
            {
              facilityId: '3333',
            },
          ],
        },
        application: {
          programYearId,
        },
      },
      {},
      { showRfiDialog: true },
    );

    cy.contains('button', 'Continue').click();
    cy.get('@routerPush').should('have.been.calledWith', pcfUrlGuid(PATHS.CCFRI_RFI, programYearId));
  });

  it('should render navigation buttons', () => {
    mountWithPinia({ ...baseAppState });

    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
