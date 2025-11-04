import ClosureConfirmationDialog from '@/components/closure/ClosureConfirmationDialog.vue';
import vuetify from '@/plugins/vuetify';

const changeRequestReferenceId = '43321';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onClose = cy.spy().as('closeDialogSpy');
    cy.mount(ClosureConfirmationDialog, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      data() {
        return {
          isDisplayed: true,
        };
      },
      props: {
        changeRequestReferenceId,
      },
      attrs: {
        onClose,
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<ClosureConfirmationDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
    mountWithPinia();
  });

  it('should render confirmation dialog text', () => {
    cy.contains('Success');
    cy.contains('Your request has been submitted');
    cy.contains(`Reference: ${changeRequestReferenceId}`);
  });

  it('should render `Return to Closures` button', () => {
    cy.contains('button', 'Return to Closures').click();
    cy.get('@closeDialogSpy').should('have.been.calledOnce');
  });
});
