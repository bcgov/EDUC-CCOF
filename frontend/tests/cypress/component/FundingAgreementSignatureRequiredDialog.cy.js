import FundingAgreementSignatureRequiredDialog from '@/components/FundingAgreementSignatureRequiredDialog.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants.js';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const closeStub = cy.stub();
    cy.mount(FundingAgreementSignatureRequiredDialog, {
      props: { onClose: closeStub },
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
    cy.wrap(closeStub).as('close');
  });
}

describe('<FundingAgreementSignatureRequiredDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });

  it('should render dialog', () => {
    mountWithPinia();
    cy.contains('You have a Funding Agreement ready to review and sign.').should('be.visible');
    cy.contains('Would you like to take action now?').should('be.visible');
  });

  it('should contain dialog buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Not now').should('be.visible');
    cy.contains('button', 'Yes, take me to my Funding Agreement').should('be.visible');
  });

  it('should route to the Funding Agreement tab', () => {
    mountWithPinia();
    cy.contains('button', 'Yes, take me to my Funding Agreement').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`,
    );
  });

  it('should close dialog and emit close', () => {
    mountWithPinia();
    cy.contains('button', 'Not now').click();
    cy.contains('You have a Funding Agreement ready to review and sign.').should('not.be.visible');
    cy.get('@close').should('have.been.calledOnce');
  });
});
