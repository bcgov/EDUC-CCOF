import FacilityList from '@/components/orgFacilities/FacilityList.vue';
import vuetify from '@/plugins/vuetify';
import { PATHS } from '@/utils/constants';

const facility1 = {
  facilityId: 1,
  facilityName: 'TEST_FACILITY1',
  facilityAccountNumber: 'FAC-11111',
  facilityIsActive: false,
  licenseNumber: 'ZZZ-ZZ-99821',
  action: '',
  addressLineOne: '123 Fake Street',
  city: 'Victoria',
};

const facility2 = {
  facilityId: 2,
  facilityName: 'TEST_FACILITY2',
  facilityAccountNumber: 'FAC-22222',
  facilityIsActive: true,
  licenseNumber: 'LLL-LL-77411',
  action: '',
  addressLineOne: '456 Test Drive',
  city: 'Vancouver',
};

const facility3 = {
  facilityId: 3,
  facilityName: 'TEST_FACILITY3',
  facilityAccountNumber: 'FAC-33333',
  facilityIsActive: false,
  licenseNumber: 'XXX-XX-12345',
  action: '',
  addressLineOne: '789 Random Way',
  city: 'Kelowna',
};

function mountWithPinia(initialState = {}, overrideProps = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();

    cy.mount(FacilityList, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      props: {
        ...overrideProps,
      },
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<FacilityList />', () => {
  it('should render no data', () => {
    mountWithPinia();
    cy.contains('No data available');
  });

  it('should render `Filter by Facility` button', () => {
    mountWithPinia();
    cy.contains('button', 'Filter by Facility');
  });

  it('should render facility data in table', () => {
    mountWithPinia({}, { facilities: [facility1] });

    cy.get('tbody').find('tr').should('have.length', 1);
    cy.get('td').eq(0).contains('div', 'Facility Name').next('div').should('have.text', facility1.facilityName);
    cy.get('td')
      .eq(1)
      .contains('div', 'Facility Address')
      .next('div')
      .should('have.text', `${facility1.addressLineOne}, ${facility1.city}`);
    cy.get('td').eq(2).contains('div', 'Facility ID').next('div').should('have.text', facility1.facilityAccountNumber);
    cy.get('td').eq(3).contains('div', 'Licence Number').next('div').should('have.text', facility1.licenseNumber);
  });

  it('should navigate to facility page', () => {
    mountWithPinia({}, { facilities: [facility1] });
    cy.contains('button', 'Open').click();
    cy.get('@routerPush').should('have.been.calledWith', `${PATHS.ROOT.MANAGE_FACILITY}/${facility1.facilityId}`);
  });

  it('should render many facilities in table', () => {
    mountWithPinia({}, { facilities: [facility1, facility2, facility3] });
    cy.get('tbody').find('tr').should('have.length', 3);
  });
});
