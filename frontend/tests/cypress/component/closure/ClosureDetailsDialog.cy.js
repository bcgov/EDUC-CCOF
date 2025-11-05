import ClosureDetailsDialog from '@/components/closure/ClosureDetailsDialog.vue';
import vuetify from '@/plugins/vuetify';
import { CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT } from '@/utils/constants.js';

const age_keys = Object.keys(CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT);
const closureFull = {
  licenseNumber: '1111',
  closureReason: 'Full-Reason-Here',
  fullClosure: true,
};

const closurePartial = {
  licenseNumber: '9999',
  closureReason: 'Partial-Reason-Here',
  ageGroups: `${age_keys[0]}, ${age_keys[2]}, ${age_keys[4]}`,
  fullClosure: false,
};

function mountWithPinia({ dateOverrides = {}, closureProp = {} } = {}) {
  cy.setupPinia({ stubActions: false }).then((pinia) => {
    const onClose = cy.spy().as('closeDialogSpy');
    cy.mount(ClosureDetailsDialog, {
      global: {
        plugins: [pinia, vuetify],
      },
      data() {
        return {
          ...dateOverrides,
        };
      },
      props: {
        closure: { ...closureProp },
      },
      attrs: {
        onClose,
      },
    });
  });
}

describe('<ClosureDetailsDialog />', () => {
  beforeEach(() => {
    cy.viewport(1020, 1000);
  });

  it('should not render dialog', () => {
    mountWithPinia({ dateOverrides: { isDisplayed: false } });
    cy.contains('Closure Details').should('not.exist');
  });

  it('should render dialog', () => {
    mountWithPinia({ dateOverrides: { isDisplayed: true } });
    cy.contains('Closure Details');
  });

  it('should render full closure details', () => {
    mountWithPinia({ dateOverrides: { isDisplayed: true }, closureProp: { ...closureFull } });

    cy.contains('div', 'Licence Number').within(() => {
      cy.contains(closureFull.licenseNumber);
    });
    cy.contains('div', 'Closure Reason').within(() => {
      cy.contains(closureFull.closureReason);
    });
    cy.contains('div', 'Closure Type').within(() => {
      cy.contains('Full');
    });
  });

  it('should render partial closure details', () => {
    mountWithPinia({ dateOverrides: { isDisplayed: true }, closureProp: { ...closurePartial } });

    cy.contains('div', 'Affected Care Types').within(() => {
      cy.contains(
        `${CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT[age_keys[2]]}, ${CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT[age_keys[4]]}, ${CLOSURE_AFFECTED_AGE_GROUPS_VALUES_TO_TEXT[age_keys[0]]}`,
      );
    });
  });

  it('should render `Back to Summary` button', () => {
    mountWithPinia({ dateOverrides: { isDisplayed: true }, closureProp: { ...closurePartial } });

    cy.contains('button', 'Back to Summary').click();
    cy.get('@closeDialogSpy').should('have.been.calledOnce');
  });
});
