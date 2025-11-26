import BackConfirmationDialog from '@/components/manageReports/enrolmentReports/BackConfirmationDialog.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    const onClose = cy.spy().as('closeDialogSpy');
    cy.mount(BackConfirmationDialog, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      attrs: {
        onClose,
      },
    }).then(async ({ wrapper }) => {
      await wrapper.setProps({ ...propOverride });
      await wrapper.vm.$nextTick();
    });
  });
}

describe('<BackConfirmationDialog />', () => {
  beforeEach(() => {
    cy.viewport(1500, 1500);
  });
  it('should not render dialog if isDisplay is false', () => {
    mountWithPinia({ propOverride: { show: false } });
    cy.contains('p', 'Leave this page?').should('not.exist');
  });

  it('should render default dialog content', () => {
    mountWithPinia({ propOverride: { show: true } });
    cy.contains('p', 'Leave this page?');
    cy.contains('p', 'You may have unsaved changes.');
    cy.contains('p', 'Make sure to save your work before returning to the Enrolment Report Dashboard.');
  });

  it('should render dialog buttons', () => {
    mountWithPinia({ propOverride: { show: true } });
    cy.contains('button', 'Stay on this page');
    cy.contains('button', 'Go back to Dashboard');
  });

  it('should close dialog when clicking `Stay on this page`', () => {
    mountWithPinia({ propOverride: { show: true } });
    cy.contains('button', 'Stay on this page').click();
    cy.get('@closeDialogSpy').should('have.been.calledOnce');
  });

  it('should navigate to enrolments page when clicking `Go back to Dashboard`', () => {
    mountWithPinia({ propOverride: { show: true } });
    cy.contains('button', 'Go back to Dashboard').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.ENROLMENT_REPORTS);
  });
});
