import ChangeNotificationDialogue from '@/components/requestChanges/ChangeNotificationDialogue.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, CHANGE_TYPES, ORGANIZATION_PROVIDER_TYPES, PATHS, changeUrlGuid } from '@/utils/constants.js';

const organizationName = 'TEST_ORG_NAME';
const changeRequestId = '000';
const changeActionId = '111';

const createAuthStore = (extras) => {
  return {
    auth: {
      userInfo: {
        organizationName,
      },
      ...extras,
    },
  };
};

function interceptAPI() {
  cy.intercept('POST', `${ApiRoutes.CHANGE_REQUEST_DOCUMENTS}`, {
    statusCode: 200,
    payload: [],
    body: { changeRequestId, changeActionId },
  }).as('postChangeRequest');
}

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    cy.mount(ChangeNotificationDialogue, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });
  });
}

describe('<ChangeNotificationDialogue />', () => {
  beforeEach(() => {
    cy.mockJwt();
  });

  afterEach(() => {
    cy.clearJwt();
  });
  it('should render default component content', () => {
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('div', 'Child Care Operating Funding Program');
    cy.contains('h2', 'Funding Agreement Change Notification');
    cy.contains(organizationName);
  });

  it('should render link to CCOF website', () => {
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('visit the Child Care Operating Funding Website').should(
      'have.attr',
      'href',
      'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/report-changes ',
    );
  });

  it('should render group change dialog', () => {
    mountWithPinia({
      ...createAuthStore(),
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
    });
    cy.contains('li', 'Preschool age programs');
    cy.contains('li', 'School age programs');
  });

  it('should render family change dialog', () => {
    mountWithPinia({
      ...createAuthStore(),
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.FAMILY,
      },
    });
    cy.contains('Report Changes');
    cy.contains('li', 'Preschool age programs').should('not.exist');
  });

  it('should render `Next` button', () => {
    interceptAPI();
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('button', 'Next').click();
    cy.wait('@postChangeRequest');
    cy.get('@routerPush').should(
      'have.been.calledWith',
      changeUrlGuid(PATHS.CHANGE_NOTIFICATION_FORM, changeRequestId, changeActionId, CHANGE_TYPES.CHANGE_NOTIFICATION),
    );
  });

  it('should render `Back` button', () => {
    mountWithPinia({
      ...createAuthStore(),
    });

    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING);
  });
});
