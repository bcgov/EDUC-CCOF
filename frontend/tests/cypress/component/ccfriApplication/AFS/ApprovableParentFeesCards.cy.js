import ApprovableParentFeesCards from '@/components/ccfriApplication/AFS/ApprovableParentFeesCards.vue';
import vuetify from '@/plugins/vuetify';

const programYearId = '1234';
const childCareCategoryId = '4321';
const approvableFeeSchedules = [
  {
    programYearId,
    childCareCategoryId,
    approvedFeeApr: 44,
  },
];

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(ApprovableParentFeesCards, {
      global: {
        plugins: [pinia, vuetify],
      },
      props: {
        loading: false,
        approvableFeeSchedules,
      },
    });
  });
}

describe('<ApprovableParentFeesCards />', () => {
  it('should render radio buttons', () => {
    mountWithPinia();

    cy.contains('Parent fee frequency');
    cy.get('input[type="radio"]').should('have.length', 2);
    cy.get('.v-radio').eq(0).find('label').should('have.text', 'Daily');
    cy.get('.v-radio').eq(1).find('label').should('have.text', 'Monthly');
  });

  it('should be disabled', () => {
    mountWithPinia();
    cy.get('.v-input').should('have.css', 'pointer-events', 'none');
  });

  it('should render inputs', () => {
    mountWithPinia();
    cy.get('.v-field').should('have.length', 12);
    cy.get('.v-field').eq(0).find('input').should('have.value', approvableFeeSchedules[0].approvedFeeApr);
  });

  it('should display program name and description', () => {
    const programName = 'TEST_NAME';
    const ccof_description = 'Test description here';
    mountWithPinia({
      app: {
        programYearList: {
          list: [
            {
              programYearId,
              name: programName,
            },
          ],
        },
        childCareCategoryList: [
          {
            ccof_childcare_categoryid: childCareCategoryId,
            ccof_description,
          },
        ],
      },
    });

    cy.contains('p', `Parent Fees ${programName}: Full-Time ${ccof_description}`);
  });
});
