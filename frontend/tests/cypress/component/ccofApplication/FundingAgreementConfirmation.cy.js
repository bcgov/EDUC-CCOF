import { StatusCodes } from 'http-status-codes';

import FundingAgreementConfirmation from '@/components/ccofApplication/FundingAgreementConfirmation.vue';
import vuetify from '@/plugins/vuetify';
import { buildQueryString } from '@/utils/common.js';
import { APPLICATION_STATUSES, ApiRoutes, PATHS, YES_NO_VALUES } from '@/utils/constants.js';

const ORGANIZATION_ID = '12435';
const PROGRAM_YEAR_GUID = '44432';

const defaultOrgState = {
  organization: { organizationName: 'TEST_ORG_NAME', organizationId: ORGANIZATION_ID },
};

function interceptLicences() {
  const queryLicences = buildQueryString({ organizationId: ORGANIZATION_ID });

  cy.intercept('GET', `${ApiRoutes.LICENCES}${queryLicences}`, {
    statusCode: StatusCodes.OK,
    body: [
      {
        recordStartDate: '2024-06-01',
      },
    ],
  });
}

const interceptFA = (FA = null) => {
  const queryFA = buildQueryString({
    organizationId: ORGANIZATION_ID,
    programYearId: PROGRAM_YEAR_GUID,
    fundingAgreementOrderNumber: 0,
    includePdf: true,
  });

  cy.intercept('GET', `${ApiRoutes.FUNDING_AGREEMENTS}${queryFA}`, {
    statusCode: StatusCodes.OK,
    body: [FA],
  });
};

function mountWithPinia({ initialState = {}, dataOverride = {} } = {}) {
  cy.setupPinia({
    initialState: { ...defaultOrgState, ...initialState },
    stubActions: false,
  }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');

    cy.mount(FundingAgreementConfirmation, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: { push: pushStub },
          $route: { params: { programYearGuid: PROGRAM_YEAR_GUID } },
        },
      },
      data: () => ({ ...dataOverride }),
    });
  });
}

const radioGroup = (index = 0) => cy.get('.v-radio-group').eq(index);
const clickRadio = (label) => cy.contains('label', label).click();

describe('<FundingAgreementConfirmation />', () => {
  beforeEach(() => {
    interceptLicences();
  });

  it('should render header with organization name', () => {
    interceptFA();
    mountWithPinia();

    cy.contains('Child Care Operating Funding Program');
    cy.contains(defaultOrgState.organization.organizationName);
  });

  it('should render static confirmation text', () => {
    interceptFA();
    mountWithPinia();

    cy.contains('p', 'The Funding Agreement outlines the legal terms and conditions');
    cy.contains('p', 'Review the Funding Agreement below in full');
    cy.get('ul li').should('have.length', 3);
  });

  it('should navigate when clicking Request a Change', () => {
    interceptFA();
    mountWithPinia();

    cy.contains('button', 'Request a Change').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING);
  });

  context('Funding Agreement Card', () => {
    it('should render confirmation list items', () => {
      interceptFA({});
      mountWithPinia();

      cy.contains('I confirm I have read the Funding Agreement');
      cy.contains('li', 'the organization information on the first page is correct;');
      cy.contains('li', 'no licence needs to be added to');
      cy.contains('li', 'the information in each Schedule A is correct.');
    });

    it('should disable radio group when application is SUBMITTED', () => {
      interceptFA({ pdfFile: '' });
      mountWithPinia({
        initialState: { application: { applicationStatus: APPLICATION_STATUSES.SUBMITTED } },
      });

      radioGroup().within(() => {
        cy.get('.v-radio').should('have.length', 2);
        cy.contains('label', 'Yes').should('have.css', 'pointer-events', 'none');
        cy.contains('label', 'No').should('have.css', 'pointer-events', 'none');
      });
    });

    it('should show alert when selecting No', () => {
      interceptFA({ pdfFile: 'test', fundingAgreementStartDate: '2025-01-01' });

      mountWithPinia({
        initialState: {
          application: { applicationStatus: APPLICATION_STATUSES.DRAFT },
        },
      });

      radioGroup().within(() => clickRadio('No'));

      cy.contains('Do not continue.');
    });

    it('should show licence records when selecting `Yes`', () => {
      interceptFA({ pdfFile: 'test', fundingAgreementStartDate: '2025-01-01' });

      mountWithPinia({
        initialState: {
          application: { applicationStatus: APPLICATION_STATUSES.DRAFT },
        },
      });

      radioGroup().within(() => clickRadio('Yes'));

      cy.contains('Licence and Service Details Record(s)');
      cy.contains('Click each licence to expand');
      cy.get('button:contains("Request a Change")').should('have.length', 2);
    });

    it('should render licence confirmation radio group', () => {
      interceptFA({ pdfFile: 'test', fundingAgreementStartDate: '2025-01-01' });
      mountWithPinia({
        initialState: {
          application: { applicationStatus: APPLICATION_STATUSES.DRAFT },
        },
        dataOverride: {
          isFundingAgreementConfirmed: YES_NO_VALUES.YES,
          areLicenceDetailsConfirmed: YES_NO_VALUES.NO,
        },
      });

      radioGroup().within(() => clickRadio('Yes'));
      cy.contains('I confirm all Licence and Service Details Records are correct.');
      radioGroup(1).within(() => clickRadio('No'));
      cy.contains('Do not continue.');
    });
  });

  it('should render navigation buttons', () => {
    interceptFA();
    mountWithPinia();

    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
