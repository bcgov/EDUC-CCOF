import ManageFundingAgreements from '@/components/fundingAgreements/ManageFundingAgreements.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes, FUNDING_AGREEMENTS_STATUS, PATHS } from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';
import { formatUTCDate } from '@/utils/format';

const organizationId = '54321';

const fundingAgreements = [
  {
    fundingAgreementId: '542356',
    fundingAgreementTerm: 'ABCDEFG',
    fundingAgreementNumber: 'FA-1234',
    externalStatusText: FUNDING_AGREEMENTS_STATUS.APPROVED,
    actions: '',
    fundingAgreementStartDate: new Date('2025-12-12'),
    endDate: new Date('2025-12-19'),
  },
];

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    cy.mount(ManageFundingAgreements, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });
  });
}

function interceptAPI() {
  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}?organizationId=${organizationId}`, {
    statusCode: 200,
    body: fundingAgreements,
  }).as('getFundingAgreements');
}

describe('<ManageFundingAgreements />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    cy.viewport(1080, 1080);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render component alert message', () => {
    mountWithPinia();
    cy.contains('You must notify the Child Care Operating Funding Program within two business days of any change');
    cy.contains('Submit a change request to notify the Child Care Operating Funding Program.');
  });

  it('should render `Request a Change` button', () => {
    mountWithPinia({
      auth: {
        permissions: [PERMISSIONS.VIEW_A_CR],
      },
    });
    cy.contains('button', 'Request a Change').click();
    cy.get('@routerPush').should('have.been.calledWith', { name: 'Report Change' });
  });

  it('should not render `Request a Change` button without view change request permissions', () => {
    const permWithoutViewCR = Object.values(PERMISSIONS).filter((permission) => permission !== PERMISSIONS.VIEW_A_CR);

    mountWithPinia({
      auth: {
        permissions: permWithoutViewCR,
      },
    });
    cy.contains('button', 'Request a Change').should('not.exist');
  });

  it('should render funding agreement', () => {
    const fundingAgreement = fundingAgreements[0];
    interceptAPI();
    mountWithPinia({
      organization: {
        organizationId,
      },
    });
    cy.wait('@getFundingAgreements');
    cy.contains(fundingAgreement.fundingAgreementTerm.slice(0, -3));
    cy.contains(fundingAgreement.externalStatusText);
    cy.contains(fundingAgreement.fundingAgreementNumber);
    cy.contains(formatUTCDate(fundingAgreement.fundingAgreementStartDate));
    cy.contains(formatUTCDate(fundingAgreement.endDate));
  });

  it('should render `View` button', () => {
    const fundingAgreement = fundingAgreements[0];
    interceptAPI();
    mountWithPinia({
      organization: {
        organizationId,
      },
    });
    cy.wait('@getFundingAgreements');

    cy.contains('button', 'View').click();
    cy.get('@routerPush').should(
      'have.been.calledWith',
      `${PATHS.ROOT.FUNDING_AGREEMENTS}/${fundingAgreement.fundingAgreementId}`,
    );
  });

  it('should render `Download` button', () => {
    interceptAPI();
    mountWithPinia({
      organization: {
        organizationId,
      },
      auth: {
        permissions: [PERMISSIONS.DOWNLOAD_FUNDING_AGREEMENT],
      },
    });
    cy.wait('@getFundingAgreements');
    cy.contains('button', 'Download').should('exist');
  });

  it('should not render `Download` button without download permissions', () => {
    const permWithoutDownloadFA = Object.values(PERMISSIONS).filter(
      (permission) => permission !== PERMISSIONS.DOWNLOAD_FUNDING_AGREEMENT,
    );
    interceptAPI();
    mountWithPinia({
      organization: {
        organizationId,
      },
      auth: {
        permissions: permWithoutDownloadFA,
      },
    });
    cy.wait('@getFundingAgreements');
    cy.contains('button', 'Download').should('not.exist');
  });
});
