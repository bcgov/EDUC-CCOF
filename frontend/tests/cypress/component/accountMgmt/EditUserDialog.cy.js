import EditUserDialog from '@/components/accountMgmt/EditUserDialog.vue';
import vuetify from '@/plugins/vuetify';

function mountWithPinia(initialState = {}, dataOverride = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(EditUserDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      data() {
        return {
          ...dataOverride,
        };
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<EditUserDialog />', () => {
  it('mounts', () => {
    mountWithPinia();
  });
});
