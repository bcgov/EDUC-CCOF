import ManageFacilityDetails from '@/components/orgFacilities/ManageFacilityDetails.vue';
import vuetify from '@/plugins/vuetify';
import { ApiRoutes } from '@/utils/constants';
import { capitalize } from '@/utils/format';

const facility1 = {
  facilityId: 1,
  facilityName: 'Pineview Medical Clinic',
  facilityAccountNumber: 'FAC-104839',
  licenseNumber: 'LIC-BC-99821',
  facilityAddress: '123 Pine Street',
  phone: '250-999-9999',
  email: 'pine@medical.com',
  postalCode: 'P90 W4R',
  province: 'British Columbia',
  city: 'Victoria',
};

const organizationProviderType = 'TEST-PROVIDER';

function mountWithPinia(initialState = {}, overrideProps = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    const onFacilityUpdated = cy.spy().as('facilityUpdatedSpy');

    cy.mount(ManageFacilityDetails, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
      attrs: {
        'onFacility-updated': onFacilityUpdated,
      },
      props: {
        ...overrideProps,
      },
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

function mountWithOrgAndFacility(overrideProps = {}) {
  return mountWithPinia(
    { organization: { organizationProviderType } },
    { facility: facility1, facilityLoading: false, ...overrideProps },
  );
}

describe('<ManageFacilityDetails />', () => {
  it('should show loader skeleton on initial load', () => {
    mountWithPinia({}, { facility: facility1, facilityLoading: true });
    cy.get('.v-skeleton-loader').should('exist');
  });

  it('should not show loader skeleton when facilities are loaded', () => {
    mountWithOrgAndFacility();
    cy.get('.v-skeleton-loader').should('not.exist');
  });

  it('should render the first card row with facility prop details', () => {
    mountWithOrgAndFacility();

    cy.contains('div', '*Facility Name:').next('div').should('contain.text', facility1.facilityName);
    cy.contains('div', '*Funding Type:').next('div').should('contain.text', capitalize(organizationProviderType));
    cy.contains('div', 'Community Care Facility Licence #:')
      .next('div')
      .should('contain.text', facility1.licenseNumber);

    cy.contains('div', 'Facility ID:').next('div').should('contain.text', facility1.facilityAccountNumber);
    cy.contains('div', '*Business Phone:').next('div').should('contain.text', facility1.phone);
  });

  it('should be able to edit business phone', () => {
    mountWithOrgAndFacility();

    cy.contains('div', '*Business Phone:').next('div').find('button').contains('Edit').click();
    cy.get('input').should('have.value', facility1.phone);
    cy.contains('button', 'Save');
    cy.contains('button', 'Cancel');
  });

  it('should not make a backend request when saving without modifying the phone number', () => {
    mountWithOrgAndFacility();

    cy.contains('div', '*Business Phone:').next('div').find('button').contains('Edit').click();
    cy.contains('button', 'Save').click();
    cy.get('@facilityUpdatedSpy').should('not.have.been.called');
  });

  it('should render the second card row with facility address details', () => {
    mountWithOrgAndFacility();

    cy.contains('div', 'Facility Street Address:').next('div').should('contain.text', facility1.facilityAddress);
    cy.contains('div', 'City/Town:').next('div').should('contain.text', facility1.city);
    cy.contains('div', 'Province:').next('div').should('contain.text', facility1.province);

    cy.contains('div', 'Postal Code:').next('div').should('contain.text', facility1.postalCode);
    cy.contains('div', 'Facility Email Address:').next('div').should('contain.text', facility1.email);
  });

  it('should be able to edit facility email', () => {
    mountWithOrgAndFacility();

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.get('input').should('have.value', facility1.email);
    cy.contains('button', 'Save');
    cy.contains('button', 'Cancel');
  });

  it('should be able to edit and save facility email', () => {
    const updatedEmail = 'updatedEmail@email.com';

    cy.intercept('PUT', `${ApiRoutes.FACILITY}/${facility1.facilityId}`, {
      statusCode: 200,
    }).as('updateFacilityDetails');

    mountWithOrgAndFacility();

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.get('input').clear().type(updatedEmail);
    cy.contains('button', 'Save').click();
    cy.wait('@updateFacilityDetails');
    cy.get('@facilityUpdatedSpy').should('have.been.calledOnce');
  });

  it('should not make a backend request when saving without modifying the email', () => {
    mountWithOrgAndFacility();

    cy.contains('div', 'Facility Email Address:').next('div').find('button').contains('Edit').click();
    cy.contains('button', 'Save').click();
    cy.get('@facilityUpdatedSpy').should('not.have.been.called');
  });
});
