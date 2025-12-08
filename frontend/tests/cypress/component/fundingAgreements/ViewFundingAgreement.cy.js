import ViewFundingAgreement from '@/components/fundingAgreements/ViewFundingAgreement.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, PATHS } from '@/utils/constants.js';

const fundingAgreement = {
  fundingAgreementId: '542356',
  fundingAgreementOrderNumber: 2,
  fundingAgreementNumber: 'FA-1234',
  consentCheck: true,
};

function mountWithPinia({ initialState = {}, dataOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    cy.mount(ViewFundingAgreement, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
          $route: {
            params: {
              fundingAgreementId: fundingAgreement.fundingAgreementId,
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
  });
}

function interceptAPI(FA = fundingAgreement) {
  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreement.fundingAgreementId}`, {
    statusCode: 200,
    body: FA,
  }).as('getFundingAgreement');

  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}/${fundingAgreement.fundingAgreementId}/pdf`, {
    statusCode: 200,
    body: [],
  }).as('getFundingAgreementPDF');

  cy.intercept('GET', `${ApiRoutes.LICENCES}?${`fundingAgreementId=${fundingAgreement.fundingAgreementId}`}`, {
    statusCode: 200,
    body: [],
  }).as('getFundingAgreementPDF');
}

describe('<ViewFundingAgreement />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    cy.viewport(1080, 1080);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render general component content', () => {
    interceptAPI();
    mountWithPinia();
    cy.contains(`Funding Agreement ${fundingAgreement.fundingAgreementNumber}`).should('exist');
    cy.contains('p', 'Carefully review your funding agreement.').should('exist');
    cy.contains('h4', 'Declaration').should('exist');
  });

  it('should render declrationB content', () => {
    interceptAPI();
    mountWithPinia();
    cy.contains('I do hereby certify that I am the authorized signing authority').should('exist');
  });

  it('should not render declrationB content if fundingAgreementOrderNumber is < 0', () => {
    const FA = { ...fundingAgreement, fundingAgreementOrderNumber: -1 };
    interceptAPI(FA);
    mountWithPinia();
    cy.contains('I do hereby certify that I am the authorized signing authority').should('not.exist');
  });

  it('should render signing of funding agreement section', () => {
    interceptAPI();
    mountWithPinia();
    cy.get('.v-checkbox').within(() => {
      cy.contains('I agree, consent and certify').should('exist');
    });
    cy.get('.v-text-field').within(() => {
      cy.contains("Your Organization's Authorized Signing Authority").should('exist');
    });
  });

  it('should render app dialog for submission confirmation', () => {
    interceptAPI();
    mountWithPinia({ dataOverride: { showSubmissionConfirmationDialog: true } });

    cy.contains('Submission Complete').should('exist');
    cy.contains(
      'Your funding agreement has been signed. Refer to the Funding Agreements in Account Management for updates to your agreement.',
    ).should('exist');
    cy.contains('button', 'Return to Funding Agreements').click();
  });

  it('should render `Return to Funding Agreements` on app dialog', () => {
    interceptAPI();
    mountWithPinia({ dataOverride: { showSubmissionConfirmationDialog: true } });

    cy.contains('button', 'Return to Funding Agreements').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`,
    );
  });

  it('should navigate back when clicking `Back` button', () => {
    interceptAPI();
    mountWithPinia();
    cy.contains('button', 'Submit').should('exist');
    cy.contains('button', 'Back').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.MANAGE_ORG_FACILITIES}?tab=funding-agreement-tab`,
    );
  });
});
