import ReportChanges from '@/components/requestChanges/ReportChanges.vue';
import vuetify from '@/plugins/vuetify';
import { ORGANIZATION_PROVIDER_TYPES } from '@/utils/constants';
import { ApiRoutes, PATHS } from '@/utils/constants.js';

const programYearId = '1234';
const programYearName = '2023-2024';
const applicationIds = ['1'];

const changeRequest = {
  changeRequestId: '000001',
  changeActionId: '100001',
  changeActions: [],
  programYearId,
  changeTypeString: 'changeTypeString',
  fiscalYear: '2025',
  firstSubmissionDate: '2025-01-01T01:01:01Z',
  facilityNames: 'TESt_FAC_NAME',
};

function fetchChangeReq(changeRequest) {
  cy.intercept('GET', ApiRoutes.APPLICATION_CHANGE_REQUEST + '/' + applicationIds, {
    statusCode: 200,
    body: [changeRequest],
  }).as('fetchChangeReq');
}

function mountWithPinia({ initialState = {}, dataOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub().as('routerPush');
    const backStub = cy.stub().as('routerBack');
    cy.mount(ReportChanges, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
            back: backStub,
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

describe('<ReportChanges />', () => {
  beforeEach(() => {
    globalThis.localStorage.setItem('jwtToken', 'mocked-jwt-token');
    cy.viewport(1050, 1050);
  });

  afterEach(() => {
    globalThis.localStorage.removeItem('jwtToken');
  });

  it('should render group provider specific column', () => {
    mountWithPinia({
      initialState: {
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
      },
    });

    cy.contains('Add a new facility to an existing organization');
    cy.contains('This will lead you through the CCOF application process. Please have your facility, CCFRI and ECE-WE');
    cy.contains('You will need to attach a Community Care and Assisted Living Act licence.');
  });

  it('should render `Add new facility` button', () => {
    mountWithPinia({
      initialState: {
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
      },
    });

    cy.contains('button', 'Add new facility').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.ROOT.CHANGE_NEW_FACILITY);
  });

  it('should render `Upload a Change Notification Form` button', () => {
    mountWithPinia();
    cy.contains('Report changes to your Licence or service');
    cy.contains('button', 'Upload a Change Notification Form').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.CHANGE_NOTIFICATION_DIALOGUE);
  });

  it('should render `Mtfi` column as disabled', () => {
    mountWithPinia();
    cy.contains('Mid-Term Fee Increase (MTFI)').should('have.css', 'pointer-events', 'none');
  });

  it('should render `Mtfi` column as enabled', () => {
    mountWithPinia({
      initialState: {
        navBar: {
          userProfileList: [
            {
              ccfriStatus: 'APPROVED',
              facilityStatus: 'NOT_CLOSED_OR_CANCELLED',
            },
          ],
        },
      },
    });
    cy.contains('Mid-Term Fee Increase (MTFI)').should('have.css', 'pointer-events', 'auto');
    cy.contains('Request a parent fee increase for a facility after you have received approval for the CCFRI.');
    cy.contains('You may need to provide details about your expenses.');
  });

  it('should render `Request change to parent fees` button', () => {
    mountWithPinia({
      initialState: {
        navBar: {
          userProfileList: [
            {
              ccfriStatus: 'APPROVED',
              facilityStatus: 'NOT_CLOSED_OR_CANCELLED',
            },
          ],
        },
      },
    });
    cy.contains('button', 'Request change to parent fees').click();
    cy.get('@routerPush').should('have.been.calledWith', PATHS.MTFI_INFO);
  });

  context('Change Request table button tests', () => {
    const setUpDefaultState = () => {
      mountWithPinia({
        initialState: {
          app: {
            programYearList: {
              list: [{ programYearId, name: programYearName }],
            },
          },
          application: {
            programYearId,
            applicationMap: new Map([['key', { applicationId: '1' }]]),
          },
        },
      });
    };
    it('should render change request content', () => {
      const inEligibleCR = { ...changeRequest, externalStatus: 4 };
      fetchChangeReq(inEligibleCR);
      setUpDefaultState();

      cy.wait('@fetchChangeReq');

      cy.contains('New Category');
      cy.contains(programYearName);
      cy.contains('Ineligible');
      cy.contains('2024-12-31');
    });

    it('should render `Continue` and `Cancel` button for in progress change request', () => {
      const inProgressCR = { ...changeRequest, externalStatus: 1 };
      fetchChangeReq(inProgressCR);
      setUpDefaultState();

      cy.wait('@fetchChangeReq');
      cy.contains('button', 'Continue');
      cy.contains('button', 'Cancel');
    });

    it('should render `View` button', () => {
      const inProgressCR = { ...changeRequest, externalStatus: 2 };
      fetchChangeReq(inProgressCR);
      setUpDefaultState();

      cy.wait('@fetchChangeReq');
      cy.contains('button', 'View');
    });

    it('should render `Update` button for action required change request', () => {
      const inProgressCR = { ...changeRequest, externalStatus: 3 };
      fetchChangeReq(inProgressCR);
      setUpDefaultState();

      cy.wait('@fetchChangeReq');
      cy.contains('button', 'Update');
    });
  });

  it('should toggle between current and historical change requests', () => {
    mountWithPinia();
    cy.contains('button', 'View Older').click();
    cy.contains('h2', 'Change History Archive');
    cy.contains('button', 'View Current').click();
    cy.contains('h2', 'Change History');
  });

  it('should render app dialog for cancelling a change request', () => {
    mountWithPinia({ dataOverride: { dialog: true } });
    cy.contains('Are you sure you want to cancel this change request?');
    cy.contains('You will not be able to resume a cancelled request. They will be viewable in your change history.');
    cy.contains('button', 'Continue');
    cy.contains('button', 'Cancel').click();
    cy.contains('Cancel a change request').should('not.be.visible');
  });

  it('should render `Back` button', () => {
    mountWithPinia();
    cy.contains('button', 'Back').click();
    cy.get('@routerBack').should('have.been.calledOnce');
  });
});
