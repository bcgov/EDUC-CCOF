import EceweFacilities from '@/components/eceweApplication/EceweFacilities.vue';
import vuetify from '@/plugins/vuetify';
import {
  CHANGE_REQUEST_EXTERNAL_STATUS,
  ECEWE_DESCRIBE_ORG_TYPES,
  ECEWE_IS_PUBLIC_SECTOR_EMPLOYER,
  OPT_STATUSES,
  ORGANIZATION_GOOD_STANDING_STATUSES,
  ORGANIZATION_PROVIDER_TYPES,
  PATHS,
  pcfUrl,
  pcfUrlGuid,
} from '@/utils/constants.js';
import { PERMISSIONS } from '@/utils/constants/permissions';

const changeRecGuid = '44434';

function mountWithPinia(initialState = {}, routeParams = { urlGuid: changeRecGuid }) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(EceweFacilities, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
          $route: {
            params: routeParams,
          },
        },
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<EceweFacilities />', () => {
  it('should render component basic header information', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
              order: 1,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
    });

    cy.contains('Child Care Operating Funding Program - Program Confirmation Form');
    cy.contains('Early Childhood Educator Wage Enhancement (ECE-WE)');
    cy.contains(organizationName);
  });

  context('GROUP Organization Provider content', () => {
    it('should show the "Please select each facility" for union question', () => {
      const organizationName = 'TEST_ORG_NAME';
      const programYearId = '1234';
      const desc1 = 'TestDesc1';
      const desc2 = 'TestDesc2';
      const desc3 = 'TestDesc3';
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        application: {
          programYearId,
        },
        app: {
          programYearId,
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
          fundingModelTypeList: [
            { description: desc1, id: 1 },
            { description: desc2, id: 2 },
            { description: desc3, id: 3 },
          ],
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        eceweApp: {
          isStarted: true,
          facilities: [{}, {}],
          eceweModel: {
            fundingModel: true,
            publicSector: ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES,
            describeOrgCSSEA: ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA,
          },
        },
      });
      cy.contains('Please select each facility you would like to opt-in to ECE-WE and indicate if they are unionized.');
      cy.contains(
        'Note: if any of your facilities are located in the Vancouver Coastal Health Authority, you must opt-in to ECE-WE for each licence located at the same physical address.',
      );
    });

    it('should show the "Please select each facility" for non union question', () => {
      const organizationName = 'TEST_ORG_NAME';
      const programYearId = '1234';
      const desc1 = 'TestDesc1';
      const desc2 = 'TestDesc2';
      const desc3 = 'TestDesc3';
      mountWithPinia({
        auth: {
          userInfo: {
            organizationName,
          },
        },
        application: {
          programYearId,
        },
        app: {
          programYearId,
          programYearList: {
            list: [
              {
                programYearId,
              },
            ],
          },
          fundingModelTypeList: [
            { description: desc1, id: 1 },
            { description: desc2, id: 2 },
            { description: desc3, id: 3 },
          ],
        },
        organization: {
          organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
        },
        eceweApp: {
          eceweModel: {
            fundingModel: true,
          },
        },
      });
      cy.contains('Please select each facility you would like to opt-in to ECE-WE:');
    });
  });

  it('should render familiy facility opt in message', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      eceweApp: {
        eceweModel: {
          fundingModel: true,
        },
      },
    });
    cy.contains(
      'span',
      'On the previous page, you indicated that you would like to opt-in to ECE-WE for any facility in your',
    );
  });

  it('should render `Opt-In All Facilities` button', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      eceweApp: {
        eceweModel: {
          fundingModel: true,
        },
      },
    });
    cy.contains('button', 'Opt-In All Facilities');
  });

  it('should render facility id, name, licence number', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    const facilityAccountNumber = '43243';
    const facilityName = 'TEST_FAC_NAME';
    const licenseNumber = '9876';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      navBar: {
        navBarList: [
          {
            facilityAccountNumber,
            facilityName: 'TEST_FAC_NAME',
            facilityId: '32323',
            licenseNumber,
            update: false,
            optInOrOut: OPT_STATUSES.OPT_IN,
          },
        ],
      },
      eceweApp: {
        isStarted: true,
        eceweModel: {
          fundingModel: true,
        },
        facilities: [{ changeReqestId: changeRecGuid }, { p: 'z' }],
      },
    });
    cy.contains(`Facility ID: ${facilityAccountNumber}`);
    cy.contains(`Facility Name: ${facilityName}`);
    cy.contains(`Licence Number: ${licenseNumber}`);
  });

  it('should render facility `Update` button', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    const facilityAccountNumber = '43243';
    const facilityName = 'TEST_FAC_NAME';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      navBar: {
        navBarList: [
          {
            facilityAccountNumber,
            facilityName: 'TEST_FAC_NAME',
            facilityId: '32323',
            update: false,
            optInOrOut: OPT_STATUSES.OPT_IN,
          },
        ],
      },
      eceweApp: {
        isStarted: true,
        eceweModel: {
          fundingModel: true,
        },
        facilities: [
          { changeReqestId: changeRecGuid, facilityId: '32323', optInOrOut: OPT_STATUSES.OPT_IN },
          { p: 'z' },
        ],
      },
    });
    cy.contains('Status: Opt-In');
    cy.contains('button', 'Update');
  });

  it('should render radio inputs for optInOrOut', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    const facilityAccountNumber = '43243';
    const facilityName = 'TEST_FAC_NAME';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      navBar: {
        navBarList: [
          {
            facilityAccountNumber,
            facilityName: 'TEST_FAC_NAME',
            facilityId: '32323',
            update: true,
          },
        ],
      },
      eceweApp: {
        isStarted: true,
        eceweModel: {
          fundingModel: true,
        },
        facilities: [{ changeReqestId: changeRecGuid, facilityId: '32323' }, { p: 'z' }],
      },
    });
    cy.get('.v-radio').eq(0).should('have.text', 'Opt-In');
    cy.get('.v-radio').eq(1).should('have.text', 'Opt-Out');
  });

  it('should render ionized and non-ionized radio inputs when opt in', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    const facilityAccountNumber = '43243';
    const facilityName = 'TEST_FAC_NAME';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      navBar: {
        navBarList: [
          {
            facilityAccountNumber,
            facilityName: 'TEST_FAC_NAME',
            facilityId: '32323',
          },
        ],
      },
      eceweApp: {
        isStarted: true,
        eceweModel: {
          fundingModel: true,
          publicSector: ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES,
          describeOrgCSSEA: ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA,
        },
        facilities: [{ changeReqestId: changeRecGuid, facilityId: '32323' }, { p: 'z' }],
      },
    });
    cy.get('.v-radio').eq(0).click();
    cy.contains('.v-radio', 'Unionized');
    cy.contains('.v-radio', 'Non-Unionized');
  });

  it('should render license number', () => {
    const organizationName = 'TEST_ORG_NAME';
    const programYearId = '1234';
    const desc1 = 'TestDesc1';
    const desc2 = 'TestDesc2';
    const desc3 = 'TestDesc3';
    const facilityAccountNumber = '43243';
    const facilityName = 'TEST_FAC_NAME';
    mountWithPinia({
      auth: {
        userInfo: {
          organizationName,
        },
      },
      application: {
        programYearId,
      },
      app: {
        programYearId,
        programYearList: {
          list: [
            {
              programYearId,
            },
          ],
        },
        fundingModelTypeList: [
          { description: desc1, id: 1 },
          { description: desc2, id: 2 },
          { description: desc3, id: 3 },
        ],
      },
      organization: {
        organizationProviderType: ORGANIZATION_PROVIDER_TYPES.GROUP,
      },
      navBar: {
        navBarList: [
          {
            facilityAccountNumber,
            facilityName: 'TEST_FAC_NAME',
            facilityId: '32323',
          },
        ],
      },
      eceweApp: {
        isStarted: true,
        eceweModel: {
          fundingModel: true,
          publicSector: ECEWE_IS_PUBLIC_SECTOR_EMPLOYER.YES,
          describeOrgCSSEA: ECEWE_DESCRIBE_ORG_TYPES.MEMBER_OF_CSSEA,
        },
        facilities: [{ changeReqestId: changeRecGuid, facilityId: '32323' }, { p: 'z' }],
      },
    });
  });
});
