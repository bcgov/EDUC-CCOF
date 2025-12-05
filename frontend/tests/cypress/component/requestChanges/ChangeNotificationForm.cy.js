import ChangeNotificationForm from '@/components/requestChanges/ChangeNotificationForm.vue';
import vuetify from '@/plugins/vuetify';
import { CHANGE_TYPES, PATHS, changeUrl } from '@/utils/constants.js';

const changeRecGuid = '01010';

function mountWithPinia({ initialState = {}, dataOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(ChangeNotificationForm, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
          $route: {
            params: {
              changeRecGuid,
            },
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

describe('<ChangeNotificationForm />', () => {
  it('should render `Download a Change Notifcation Form``', () => {
    mountWithPinia();
    cy.contains('Change Notification Form');
    cy.contains('a', 'Download a Change Notification Form').should(
      'have.attr',
      'href',
      'https://www2.gov.bc.ca/assets/download/E7A1C3009EA24111A7EFB93554D08428',
    );
  });

  it('should render `ChangeFileUpload` components', () => {
    mountWithPinia();
    cy.contains('Upload supporting documents for your requested changes.');
    cy.contains('div', 'Upload Change Notification Form (Required)');
    cy.contains('div', 'Upload supporting documents');
  });

  it('should render `visit the CCOF website` button', () => {
    mountWithPinia();
    cy.contains('a', 'visit the Child Care Operating Funding website').should(
      'have.attr',
      'href',
      'https://www2.gov.bc.ca/gov/content/family-social-supports/caring-for-young-children/childcarebc-programs/child-care-operating-funding/report-changes',
    );
  });

  it('should render `Back` button and navigate to change landing page', () => {
    mountWithPinia();
    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING);
  });

  it('should render `Next` button and navigate to summary decleration', () => {
    mountWithPinia({ dataOverride: { isChangeNotificationFormComplete: true } });
    cy.contains('button', 'Next').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      changeUrl(PATHS.SUMMARY_DECLARATION, changeRecGuid, CHANGE_TYPES.CHANGE_NOTIFICATION),
    );
  });
});
