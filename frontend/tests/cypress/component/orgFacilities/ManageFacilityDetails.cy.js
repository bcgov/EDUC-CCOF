import ManageFacilityDetails from '@/components/orgFacilities/ManageFacilityDetails.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();

    cy.mount(ManageFacilityDetails, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
        },
      },
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<ManageFacilityDetails />', () => {
  it('mounts', () => {
    mountWithPinia();
  });
});
