import FullMonthClosureConfirmationDialog from '@/components/manageReports/enrolmentReports/FullMonthClosureConfirmationDialog.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const onClose = cy.spy().as('closeDialogSpy');
    const onProceed = cy.spy().as('proceedDialogSpy');
    cy.mount(FullMonthClosureConfirmationDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        show: true,
        ...propOverride,
      },
      attrs: {
        onClose,
        onProceed,
      },
    });
  });
}

describe('<FullMonthClosureConfirmationDialog />', () => {
  beforeEach(() => {
    cy.viewport(1500, 1500);
  });
  it('should not render dialog if show is false', () => {
    mountWithPinia({ propOverride: { show: false } });
    cy.contains('p', 'Confirm Full Month Closure or No Enrolment').should('not.exist');
  });

  it('should render default dialog content', () => {
    mountWithPinia();
    cy.contains('p', 'Confirm Full Month Closure or No Enrolment');
    cy.contains('p', 'You are reporting that your facility was closed');
    cy.contains('p', 'You will be redirected to a declaration page to ');
    cy.contains('p', 'If your facility opens or enrolment begins during this month, you must');
    cy.contains('p', 'If your facility is permanently closed, or remains closed');
  });

  it('should render dialog buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel');
    cy.contains('button', 'Proceed');
  });

  it('should emit `proceed` event when clicking `Proceed`', () => {
    mountWithPinia();
    cy.contains('button', 'Proceed').click();
    cy.get('@proceedDialogSpy').should('have.been.calledOnce');
  });

  it('should emit `close` event when clicking `Cancel`', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel').click();
    cy.get('@closeDialogSpy').should('have.been.calledOnce');
  });
});
