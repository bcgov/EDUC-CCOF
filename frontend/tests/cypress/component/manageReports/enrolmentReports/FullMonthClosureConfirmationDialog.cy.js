import FullMonthClosureConfirmationDialog from '@/components/manageReports/enrolmentReports/FullMonthClosureConfirmationDialog.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const updateModelValue = cy.spy().as('updateModelValue');
    const onProceed = cy.spy().as('proceedDialogSpy');
    cy.mount(FullMonthClosureConfirmationDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        modelValue: true,
        'onUpdate:modelValue': updateModelValue,
        ...propOverride,
      },
      attrs: {
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
    mountWithPinia({ propOverride: { modelValue: false } });
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

  it('should close dialog when clicking `Cancel`', () => {
    mountWithPinia();
    cy.contains('button', 'Cancel').click();
    cy.get('@updateModelValue').should('have.been.calledWith', false);
  });
});
