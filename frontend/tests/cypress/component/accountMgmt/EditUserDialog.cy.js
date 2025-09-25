import EditUserDialog from '@/components/accountMgmt/EditUserDialog.vue';
import vuetify from '@/plugins/vuetify';

const mockUser = {
  contactId: 123,
  firstName: 'Test',
  lastName: 'User',
  bceid: 'testuser',
  email: 'test@example.com',
  telephone: '123-456-7890',
  role: { roleNumber: 1 },
  facilities: [],
};

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
      props: {
        show: true,
        user: mockUser,
      },
    }).then(({ component }) => {
      component.loadEditUserData();
    });

    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<EditUserDialog />', () => {
  beforeEach(() => {
    cy.viewport(800, 1000);
  });

  it('mounts', () => {
    mountWithPinia({}, { dialogOpen: true });
  });
});
