import ExistingFacilityFees from '@/components/ccfriApplication/group/ExistingFacilityFees.vue';
import vuetify from '@/plugins/vuetify';

const ccfriApplicationId = 1234;

function mountWithPinia(
  initialState = {},
  routeParams = { urlGuid: ccfriApplicationId },
  dataOverride = { loading: false },
) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ExistingFacilityFees, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: {
            params: routeParams,
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

describe('<ExistingFacilityFees />', () => {
  it('should render PCF header', () => {
    mountWithPinia();
    cy.contains('p', 'Child Care Operating Funding Program');
    cy.contains('h2', 'Child Care Fee Reduction Initiative (CCFRI)');
  });

  it('should render skeleton loaders when loading', () => {
    mountWithPinia({}, { loading: true });
    cy.get('.v-skeleton-loader').should('have.length', 2);
  });

  it('should render facility header', () => {
    const facilityName = 'TEST_FAC_NAME';
    const licenseNumber = 'LIC-99993';
    const facilityAccountNumber = '434343';
    mountWithPinia({
      ccfriApp: {
        ccfriStore: {
          1234: {
            facilityId: '444',
          },
          facilityId: '4444',
        },
        previousFeeStore: {
          '444-2024': 'hello',
        },
      },
      application: {
        programYearId: '91919',
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId: '91919',
              previousYearId: '2024',
              name: 'TEST_NAME',
            },
          ],
        },
      },
      navBar: {
        userProfileList: [{ ccfriApplicationId, facilityName, licenseNumber, facilityAccountNumber }],
      },
    });
    cy.contains('p', `Facility ID: ${facilityAccountNumber}`);
    cy.contains('p', `Facility Name: ${facilityName}`);
    cy.contains('p', `Licence Number: ${licenseNumber}`);
  });

  it('should render `No Fees` message', () => {
    const facilityName = 'TEST_FAC_NAME';
    const licenseNumber = 'LIC-99993';
    const facilityAccountNumber = '434343';
    mountWithPinia({
      ccfriApp: {
        ccfriStore: {
          1234: {
            facilityId: '444',
          },
          facilityId: '4444',
        },
        previousFeeStore: {
          '444-2024': 'hello',
        },
      },
      application: {
        programYearId: '91919',
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId: '91919',
              previousYearId: '2024',
              name: '"Program Year 2024 - Overview"',
            },
          ],
        },
      },
      navBar: {
        userProfileList: [{ ccfriApplicationId, facilityName, licenseNumber, facilityAccountNumber }],
      },
    });
    cy.contains('p', `Our records show this facility's parent fees for January 2024 to March 2024`);
    cy.contains('h2', 'We have no fees on record for this facility.');
  });

  it('should render fee list', () => {
    const facilityName = 'TEST_FAC_NAME';
    const licenseNumber = 'LIC-99993';
    const facilityAccountNumber = '434343';
    mountWithPinia({
      ccfriApp: {
        ccfriStore: {
          1234: {
            facilityId: '444',
          },
          facilityId: '4444',
        },
        previousFeeStore: {
          '444-2024': {
            childCareTypes: [
              {
                programYearId: '2024',
                orderNumber: '1',
                approvedFeeJan: 21,
                approvedFeeFeb: 44,
                approvedFeeMar: 88,
              },
            ],
          },
        },
      },
      application: {
        programYearId: '91919',
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId: '91919',
              previousYearId: '2024',
              name: '"Program Year 2024 - Overview"',
            },
          ],
        },
      },
      navBar: {
        userProfileList: [{ ccfriApplicationId, facilityName, licenseNumber, facilityAccountNumber }],
      },
    });
    cy.contains('h2', 'We have no fees on record for this facility.').should('not.exist');

    cy.get('tbody').within(() => {
      cy.get('tr').eq(0).contains('td', 'January 2024');
      cy.get('tr').eq(0).contains('$21');

      cy.get('tr').eq(1).contains('td', 'February 2024');
      cy.get('tr').eq(1).contains('$44');

      cy.get('tr').eq(2).contains('td', 'March 2024');
      cy.get('tr').eq(2).contains('$88');
    });
  });

  it('should render radio group', () => {
    const facilityName = 'TEST_FAC_NAME';
    const licenseNumber = 'LIC-99993';
    const facilityAccountNumber = '434343';
    mountWithPinia({
      ccfriApp: {
        ccfriStore: {
          1234: {
            facilityId: '444',
          },
          facilityId: '4444',
        },
        previousFeeStore: {
          '444-2024': {
            childCareTypes: [
              {
                programYearId: '2024',
                orderNumber: '1',
                approvedFeeJan: 21,
                approvedFeeFeb: 44,
                approvedFeeMar: 88,
              },
            ],
          },
        },
      },
      application: {
        programYearId: '91919',
      },
      app: {
        programYearList: {
          list: [
            {
              programYearId: '91919',
              previousYearId: '2024',
              name: '"Program Year 2024 - Overview"',
            },
          ],
        },
      },
      navBar: {
        userProfileList: [{ ccfriApplicationId, facilityName, licenseNumber, facilityAccountNumber }],
      },
    });

    cy.get('.v-card')
      .eq(1)
      .within(() => {
        cy.contains('p', 'Are these fees listed above correct for this facility?');
        cy.get('.v-radio-group').within(() => {
          cy.get('.v-radio').should('have.length', 2);
          cy.get('label').contains('Yes');
          cy.get('label').contains('No');
        });
      });
  });
});
