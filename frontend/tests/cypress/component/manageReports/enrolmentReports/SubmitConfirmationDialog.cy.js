import SubmitConfirmationDialog from '@/components/manageReports/enrolmentReports/SubmitConfirmationDialog.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    cy.mount(SubmitConfirmationDialog, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      props: {
        show: true,
        ...propOverride,
      },
    });
  });
}

describe('<SubmitConfirmationDialog />', () => {
  beforeEach(() => {
    cy.viewport(1250, 1250);
  });
  it('should not render dialog if show is false', () => {
    mountWithPinia({ propOverride: { show: false } });
    cy.contains('p', 'Submission Successful').should('not.exist');
  });

  it('should render default content', () => {
    mountWithPinia();
    cy.contains('p', 'Submission Successful');
    cy.contains('p', 'Your Enrolment Report has been submitted successfully.');
  });

  it('should render `Go back to Dashboard` button', () => {
    mountWithPinia();
    cy.contains('button', 'Go back to Dashboard');
  });

  it('should navigate to enrolment dashboard when clicking `Go back to Dashboard`', () => {
    mountWithPinia();
    cy.contains('button', 'Go back to Dashboard').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
  });
});
