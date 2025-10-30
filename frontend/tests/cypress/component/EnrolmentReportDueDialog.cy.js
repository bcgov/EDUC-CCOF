import EnrolmentReportDueDialog from '@/components/EnrolmentReportDueDialog.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(EnrolmentReportDueDialog, {
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

describe('<EnrolmentReportDueDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });

  it('should render dialog', () => {
    mountWithPinia();
    cy.contains('You have one or more Enrolment Report(s) that have not been submitted.');
  });

  it('should contain dialog buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Not now');
    cy.contains('button', 'Yes, take me to the Enrolment Report Dashboard');
  });

  it('should route to `Enrolment Report` dashboard', () => {
    mountWithPinia();
    cy.contains('button', 'Yes, take me to the Enrolment Report Dashboard').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
  });

  it('should close dialog', () => {
    mountWithPinia();
    cy.contains('You have one or more Enrolment Report(s) that have not been submitted.');
    cy.contains('button', 'Not now').click();
    cy.contains('You have one or more Enrolment Report(s)').should('not.be.visible');
  });
});
