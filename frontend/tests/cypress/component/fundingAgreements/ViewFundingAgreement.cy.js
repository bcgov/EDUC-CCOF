import ViewFundingAgreement from '@/components/fundingAgreements/ViewFundingAgreement.vue';
import vuetify from '@/plugins/vuetify';
import { APPLICATION_STATUSES, ApiRoutes, FUNDING_AGREEMENTS_STATUS, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions.js';

const fundingAgreement = {
  fundingAgreementId: '542356',
  fundingAgreementOrderNumber: 2,
  fundingAgreementNumber: 'FA-1234',
  consentCheck: true,
};

const programYearId = 'py-2026';

const renewalFundingAgreement = {
  ...fundingAgreement,
  fundingAgreementOrderNumber: 0,
  programYearId,
  externalStatusText: FUNDING_AGREEMENTS_STATUS.DRAFTED_PROVIDER_ACTION_REQUIRED,
};

function renewalState(applicationMap = new Map()) {
  return {
    auth: { isAuthenticated: true, permissions: [PERMISSIONS.SIGN_FUNDING_AGREEMENT] },
    application: { applicationMap },
  };
}

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
  const faId = fundingAgreement.fundingAgreementId;

  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}/${faId}`, {
    statusCode: 200,
    body: FA,
  }).as('getFundingAgreement');

  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}/${faId}/pdf`, {
    statusCode: 200,
    body: [],
  }).as('getFundingAgreementPDF');

  cy.intercept('GET', `${ApiRoutes.LICENCES}?fundingAgreementId=${faId}`, {
    statusCode: 200,
    body: [],
  }).as('getLicences');
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

  it('should render declarationB content', () => {
    interceptAPI();
    mountWithPinia();
    cy.contains('I do hereby certify that I am the authorized signing authority').should('exist');
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

  describe('version 00 funding agreement', () => {
    const renewalMessage = 'This funding agreement must be signed as part of your renewal application.';

    function assertSigningBlocked() {
      cy.contains(renewalMessage).should('exist');
      cy.contains('button', 'Submit').should('not.exist');
      cy.get('.v-checkbox input').should('be.disabled');
      cy.get('.v-text-field input').should('be.disabled');
    }

    it('should block signing when there is no application for the program year', () => {
      interceptAPI(renewalFundingAgreement);
      mountWithPinia({ initialState: renewalState() });
      assertSigningBlocked();
    });

    it('should block signing when the application for the program year is still a draft', () => {
      interceptAPI(renewalFundingAgreement);
      mountWithPinia({
        initialState: renewalState(new Map([[programYearId, { applicationStatus: APPLICATION_STATUSES.DRAFT }]])),
      });
      assertSigningBlocked();
    });

    it('should block signing even when the application for the program year is submitted', () => {
      interceptAPI(renewalFundingAgreement);
      mountWithPinia({
        initialState: renewalState(new Map([[programYearId, { applicationStatus: APPLICATION_STATUSES.SUBMITTED }]])),
      });
      assertSigningBlocked();
    });

    it('should block signing a suspended version 00 agreement without showing the renewal notice', () => {
      interceptAPI({ ...renewalFundingAgreement, externalStatusText: FUNDING_AGREEMENTS_STATUS.SUSPENDED });
      mountWithPinia({ initialState: renewalState() });
      cy.get('.v-checkbox input').should('be.disabled');
      cy.get('.v-text-field input').should('be.disabled');
      cy.contains('button', 'Submit').should('not.exist');
      cy.contains(renewalMessage).should('not.exist');
    });

    it('should allow signing a non-00 version without an application for the program year', () => {
      interceptAPI({ ...renewalFundingAgreement, fundingAgreementOrderNumber: 1 });
      mountWithPinia({ initialState: renewalState() });
      cy.contains('button', 'Submit').should('exist');
      cy.contains(renewalMessage).should('not.exist');
    });
  });
});
