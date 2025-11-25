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
  it('should display default dialog information', () => {
    mountWithPinia();
    cy.contains('Confirm Full Month Closure or No Enrolment');
    cy.contains('You will be redirected to a declaration page to ');
    cy.contains('If your facility opens or enrolment begins during this month, you must');
    cy.contains('If your facility is permanently closed, or remains closed');
  });

  it('should not display dialog', () => {
    mountWithPinia({ propOverride: { show: false } });
    cy.contains('Confirm Full Month Closure or No Enrolment').should('not.exist');
  });

  it('should render `Cancel` and `Proceed` buttons', () => {
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
