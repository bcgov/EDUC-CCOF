import EceweFacilities from '@/components/eceweApplication/EceweFacilities.vue';
import vuetify from '@/plugins/vuetify';
import {
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  OPT_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
} from '@/utils/constants.js';

const changeRecGuid = '44434';
const programYearId = '1234';
const organizationName = 'TEST_ORG_NAME';

const fundingModelTypeList = [
  { description: 'TestDesc1', id: 1 },
  { description: 'TestDesc2', id: 2 },
  { description: 'TestDesc3', id: 3 },
];

const getAuthState = () => ({
  auth: {
    userInfo: {
      organizationName,
    },
  },
});

const getApplicationState = () => ({
  application: {
    programYearId,
  },
});

const getAppState = () => ({
  app: {
    programYearId,
    programYearList: {
      list: [],
    },
    fundingModelTypeList,
  },
});

const getOrganizationState = (type = ORGANIZATION_PROVIDER_TYPES.GROUP) => ({
  organization: {
    organizationProviderType: type,
  },
});

const getEceweAppState = (overrides = {}) => ({
  eceweApp: {
    isStarted: true,
    facilities: [{}],
    ...overrides,
  },
});

const getNavBarState = (navBarList = [{}]) => ({
  navBar: {
    navBarList,
  },
});

function mountWithPinia(initialState, routeParams) {
  initialState = initialState || {};
  routeParams = routeParams || { urlGuid: changeRecGuid };
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(EceweFacilities, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: { params: routeParams },
        },
      },
    });
  });
}

describe('<EceweFacilities />', () => {
  it('should render component basic header information', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getApplicationState(),
      ...getAppState(),
    });

    cy.contains('Child Care Operating Funding Program - Program Confirmation Form');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)');
    cy.contains(organizationName);
  });

  context('GROUP Organization Provider content', () => {
    it('should show the "Please select each facility" for union question', () => {
      mountWithPinia({
        ...getAuthState(),
        ...getApplicationState(),
        ...getAppState(),
        ...getOrganizationState(),
        ...getEceweAppState({
          eceweModel: {
            fundingModel: true,
            publicSector: ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES,
            describeOrgCSSEA: ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA,
          },
        }),
      });

      cy.contains('Please select each facility you would like to opt-in to ECE-WE and indicate if they are unionized.');
    });

    it('should show the "Please select each facility" for non union question', () => {
      mountWithPinia({
        ...getAuthState(),
        ...getApplicationState(),
        ...getAppState(),
        ...getOrganizationState(),
        ...getEceweAppState({
          eceweModel: {
            fundingModel: true,
          },
        }),
      });

      cy.contains('Please select each facility you would like to opt-in to ECE-WE:');
    });
  });

  it('should render family facility opt-in message', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getApplicationState(),
      ...getAppState(),
      ...getEceweAppState({
        eceweModel: {
          fundingModel: true,
        },
      }),
    });

    cy.contains('span', 'On the previous page, you indicated that you would like to opt-in to ECE-WE');
  });

  it('should render `Opt-In All Facilities` button', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getApplicationState(),
      ...getAppState(),
      ...getOrganizationState(),
      ...getEceweAppState({
        eceweModel: { fundingModel: true },
      }),
    });

    cy.contains('button', 'Opt-In All Facilities');
  });

  it('should render facility id, name, licence number', () => {
    const facilityAccountNumber = '43243';
    const licenseNumber = '9876';
    const facilityName = 'TEST_FAC_NAME';

    mountWithPinia({
      ...getAuthState(),
      ...getApplicationState(),
      ...getAppState(),
      ...getOrganizationState(),
      ...getNavBarState([
        {
          facilityAccountNumber,
          facilityName,
          facilityId: '32323',
          licenseNumber,
          update: false,
          optInOrOut: OPT_STATUSES.OPT_IN,
        },
      ]),
      ...getEceweAppState({
        facilities: [{ changeReqestId: changeRecGuid }],
        eceweModel: { fundingModel: true },
      }),
    });

    cy.contains(`Facility ID: ${facilityAccountNumber}`);
    cy.contains(`Facility Name: ${facilityName}`);
    cy.contains(`Licence Number: ${licenseNumber}`);
  });

  it('should render facility `Update` button', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getApplicationState(),
      ...getAppState(),
      ...getOrganizationState(),
      ...getNavBarState([
        {
          facilityName: 'TEST_FAC_NAME',
          facilityId: '32323',
          optInOrOut: OPT_STATUSES.OPT_IN,
        },
      ]),
      ...getEceweAppState({
        facilities: [
          {
            changeReqestId: changeRecGuid,
            facilityId: '32323',
            optInOrOut: OPT_STATUSES.OPT_IN,
          },
        ],
        eceweModel: { fundingModel: true },
      }),
    });

    cy.contains('Status: Opt-In');
    cy.contains('button', 'Update');
  });

  it('should render radio inputs for optInOrOut', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getAppState(),
      ...getNavBarState(),
      ...getEceweAppState(),
    });

    cy.get('.v-radio').eq(0).should('have.text', 'Opt-In');
    cy.get('.v-radio').eq(1).should('have.text', 'Opt-Out');
  });

  it('should render unionized and non-unionized radio inputs when opt in', () => {
    mountWithPinia({
      ...getAuthState(),
      ...getAppState(),
      ...getNavBarState(),
      ...getEceweAppState({
        eceweModel: {
          publicSector: ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES,
          describeOrgCSSEA: ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA,
        },
      }),
    });

    cy.get('.v-radio').eq(0).click();
    cy.contains('.v-radio', 'Unionized');
    cy.contains('.v-radio', 'Non-Unionized');
  });
});
