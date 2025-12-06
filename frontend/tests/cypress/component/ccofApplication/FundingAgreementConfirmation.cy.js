import FundingAgreementConfirmation from '@/components/ccofApplication/FundingAgreementConfirmation.vue';
import vuetify from '@/plugins/vuetify';
import { APPLICATION_STATUSES, PATHS, YES_NO_VALUES } from '@/utils/constants.js';

const defaultOrgState = {
  organization: { organizationName: 'TEST_ORG_NAME' },
};

function mountWithPinia(initialState = {}, data = {}) {
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
        },
      },
      data: () => ({ ...data }),
    });
  });
}

const radioGroup = (index = 0) => cy.get('.v-radio-group').eq(index);
const clickRadio = (label) => cy.contains('label', label).click();

describe('<FundingAgreementConfirmation />', () => {
  it('should render header with organization name', () => {
    mountWithPinia();

    cy.contains('Child Care Operating Funding Program');
    cy.contains(defaultOrgState.organization.organizationName);
  });

  it('should render static confirmation text', () => {
    mountWithPinia();

    cy.contains('p', 'The Funding Agreement outlines the legal terms and conditions');
    cy.contains('p', 'Review the Funding Agreement below in full');
    cy.get('ul li').should('have.length', 3);
  });

  it('should navigate when clicking Request a Change', () => {
    mountWithPinia();

    cy.contains('button', 'Request a Change').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_LANDING);
  });

  context('Funding Agreement Card', () => {
    it('should render confirmation list items', () => {
      mountWithPinia({}, { fundingAgreement: {} });

      cy.contains('I confirm I have read the Funding Agreement');
      cy.contains('li', 'the organization information on the first page is correct;');
      cy.contains('li', 'no licence needs to be added to');
      cy.contains('li', 'the information in each Schedule A is correct.');
    });

    it('should disable radio group when application is SUBMITTED', () => {
      mountWithPinia(
        { application: { applicationStatus: APPLICATION_STATUSES.SUBMITTED } },
        { fundingAgreement: { pdfFile: '' }, licences: [] },
      );

      radioGroup().within(() => {
        cy.get('.v-radio').should('have.length', 2);
        cy.contains('label', 'Yes').should('have.css', 'pointer-events', 'none');
        cy.contains('label', 'No').should('have.css', 'pointer-events', 'none');
      });
    });

    it('should show alert when selecting No', () => {
      mountWithPinia(
        { application: { applicationStatus: APPLICATION_STATUSES.DRAFT } },
        { fundingAgreement: { pdfFile: 'test' }, licences: ['test'] },
      );

      radioGroup().within(() => clickRadio('No'));

      cy.contains('Do not continue.');
    });

    it('should show licence records when selecting `Yes`', () => {
      mountWithPinia(
        { application: { applicationStatus: APPLICATION_STATUSES.DRAFT } },
        { fundingAgreement: { pdfFile: 'test' }, licences: ['test'] },
      );

      radioGroup().within(() => clickRadio('Yes'));

      cy.contains('Licence and Service Details Record(s)');
      cy.contains('Click each licence to expand');
      cy.get('button:contains("Request a Change")').should('have.length', 2);
    });

    it('should render licence confirmation radio group', () => {
      mountWithPinia(
        {
          application: { applicationStatus: APPLICATION_STATUSES.DRAFT },
        },
        {
          isFundingAgreementConfirmed: YES_NO_VALUES.YES,
          areLicenceDetailsConfirmed: YES_NO_VALUES.NO,
          fundingAgreement: { pdfFile: 'test' },
          licences: ['test'],
        },
      );

      radioGroup().within(() => clickRadio('Yes'));
      cy.contains('I confirm all Licence and Service Details Records are correct.');
      radioGroup(1).within(() => clickRadio('No'));
      cy.contains('Do not continue.');
    });
  });

  it('should render navigation buttons', () => {
    mountWithPinia();
    cy.contains('button', 'Back');
    cy.contains('button', 'Next');
    cy.contains('button', 'Save');
  });
});
