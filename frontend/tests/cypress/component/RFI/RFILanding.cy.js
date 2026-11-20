import RFILanding from '@/components/RFI/RFILanding.vue';
import vuetify from '@/plugins/vuetify';
import { useRfiAppStore } from '@/store/rfiApp.js';

const CCFRI_ID = 'ccfri-1';
const FACILITY_ID = 'facility-1';
const INCLUSION_TITLE = 'Priority Service Expansion: Inclusion';

function rfiModel(overrides = {}) {
  return {
    rfiId: 'rfi-1',
    expansionList: [],
    wageList: [],
    fundingList: [],
    expenseList: [],
    indigenousExpenseList: [],
    inclusionExpenseList: [],
    ...overrides,
  };
}

// Exceptional circumstance = Yes, within 6 months = Yes, other funding = Yes, so the insurance section is shown
function rfiWithOtherFunding(overrides = {}) {
  return rfiModel({
    exceptionalCircumstances: 1,
    circumstanceOccurWithin6Month: 1,
    q3: 1,
    expenseList: [{ id: 'e1', description: 'Roof', date: '2027-04-01', frequency: 'One-time', expense: 10 }],
    fundingList: [{ id: 'f1', fundingProgram: '', date: undefined, status: '', amount: 0, expenses: 0 }],
    ...overrides,
  });
}

function mountRfiLanding({
  templateVersion = 4,
  model = rfiModel(),
  applicationStatus = 'INCOMPLETE',
  unlockRfi,
} = {}) {
  const initialState = {
    app: { programYearList: { list: [] } },
    application: {
      applicationTemplateVersion: templateVersion,
      applicationStatus,
      programYearLabel: '2027-28 FY',
      isApplicationProcessing: false,
    },
    navBar: {
      navBarList: [
        {
          ccfriApplicationId: CCFRI_ID,
          facilityId: FACILITY_ID,
          facilityName: 'M Village',
          facilityAccountNumber: 'F-0100001',
          licenseNumber: '456123',
          unlockRfi,
        },
      ],
    },
    rfiApp: {},
    supportingDocumentUpload: { uploadedDocuments: [] },
  };

  cy.setupPinia({ initialState, stubActions: true }).then((pinia) => {
    // rfiApp.js declares its state under `store:` instead of `state:`, so initialState does not reach it
    const rfiAppStore = useRfiAppStore();
    rfiAppStore.rfiModel = model;
    rfiAppStore.loadedModel = model;
    rfiAppStore.rfiStore = {};
    cy.mount(RFILanding, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $route: { params: { urlGuid: CCFRI_ID } },
          $router: { push: cy.stub() },
        },
      },
    });
  });
}

function inclusionCard() {
  return cy.contains('.v-card', INCLUSION_TITLE);
}

function clickRadio(groupIndex, label) {
  inclusionCard().find('.v-radio-group').eq(groupIndex).contains('label', label).click();
}

describe('<RFILanding /> - template V3 vs V4', () => {
  beforeEach(() => {
    cy.viewport(1280, 1000);
  });

  context('Other Sources of Funding wording', () => {
    it('V3: shows the original Ministry Funding wording', () => {
      mountRfiLanding({ templateVersion: 3, model: rfiWithOtherFunding() });

      cy.contains('p', 'Other Sources of Ministry Funding').should('be.visible');
      cy.contains('for any of the expenses you listed?').should('be.visible');
      cy.contains('or submitted an insurance claim').should('not.exist');
      cy.contains('label', 'Funding Program or Insurer').should('not.exist');
      cy.contains('label', /^Funding Program$/).should('exist');
    });

    it('V4: shows the insurance wording and the "Funding Program or Insurer" field label', () => {
      mountRfiLanding({ templateVersion: 4, model: rfiWithOtherFunding() });

      cy.contains('p', /^Other Sources of Funding$/).should('be.visible');
      cy.contains('p', 'Other Sources of Ministry Funding').should('not.exist');
      cy.contains(
        'Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants) or submitted an insurance claim for any of the expenses you listed?',
      ).should('be.visible');
      cy.contains('label', 'Funding Program or Insurer').should('exist');
    });

    it('V4: shows the Application/Claim column headers on wide screens', () => {
      cy.viewport(2560, 1200);
      mountRfiLanding({ templateVersion: 4, model: rfiWithOtherFunding() });

      cy.contains('h3', 'Funding Program or Insurer').should('be.visible');
      cy.contains('h3', 'Application/Claim Date').should('be.visible');
      cy.contains('h3', 'Status of Application/Claim').should('be.visible');
    });

    it('V3: shows the original column headers on wide screens', () => {
      cy.viewport(2560, 1200);
      mountRfiLanding({ templateVersion: 3, model: rfiWithOtherFunding() });

      cy.contains('h3', /^Funding Program$/).should('be.visible');
      cy.contains('h3', /^Application Date$/).should('be.visible');
      cy.contains('h3', /^Status of Application$/).should('be.visible');
      cy.contains('h3', 'Application/Claim Date').should('not.exist');
    });
  });

  context('PSE Inclusion section visibility', () => {
    [1, 2, 3].forEach((templateVersion) => {
      it(`V${templateVersion}: does not show the Inclusion section`, () => {
        mountRfiLanding({ templateVersion });

        cy.contains('Priority Service Expansion: Increasing Connection to Indigenous').should('exist');
        cy.contains(INCLUSION_TITLE).should('not.exist');
      });
    });

    it('V4: shows the Inclusion section after the Indigenous section and before Underserved Populations', () => {
      mountRfiLanding({ templateVersion: 4 });

      cy.get('.card-title').then(($titles) => {
        const titles = [...$titles].map((el) => el.innerText.trim());
        const indigenous = titles.findIndex((t) => t.startsWith('Priority Service Expansion: Increasing Connection'));
        const inclusion = titles.indexOf(INCLUSION_TITLE);
        const underserved = titles.indexOf('Affordable Child Care for Underserved Populations');
        expect(inclusion).to.be.greaterThan(indigenous);
        expect(underserved).to.be.greaterThan(inclusion);
      });
    });

    it('V5 (future versions): still shows the Inclusion section', () => {
      mountRfiLanding({ templateVersion: 5 });

      cy.contains(INCLUSION_TITLE).should('exist');
    });

    it('V4: shows only Q1 when it is not answered', () => {
      mountRfiLanding({ templateVersion: 4 });

      inclusionCard().within(() => {
        cy.contains('Does your facility have:');
        cy.contains('an expense that meets an immediate inclusion need and is not covered by other funding sources');
        cy.contains('a documented inclusion policy aligned with the principles outlined in BC');
        cy.contains('Describe the expense and how it meets').should('not.exist');
        cy.contains('Will your proposed Parent Fees be charged').should('not.exist');
        cy.contains('Expense Information').should('not.exist');
        cy.contains('Documentation Required').should('not.exist');
      });
    });
  });

  context('PSE Inclusion questions (V4)', () => {
    it('Q1 = No: keeps the follow-up questions hidden and does not add an expense row', () => {
      mountRfiLanding({ templateVersion: 4 });

      clickRadio(0, 'No');

      inclusionCard().within(() => {
        cy.contains('Describe the expense and how it meets').should('not.exist');
        cy.contains('Expense Information').should('not.exist');
      });
    });

    it('Q1 = Yes: shows Q1 text, Q2, Q3, the expense grid with one empty row and the document upload', () => {
      mountRfiLanding({ templateVersion: 4 });

      clickRadio(0, 'Yes');

      inclusionCard().within(() => {
        cy.contains('Describe the expense and how it meets the immediate inclusion need');
        cy.contains('Will your proposed Parent Fees be charged for all children occupying Enrolled Spaces');
        cy.contains('label', 'All children');
        cy.contains('label', 'Only children with support needs');
        cy.contains('Do you have expenses related to wages, recruitment and retention of staff');
        cy.contains('Expense Information');
        cy.contains('label', 'Description').should('have.length', 1);
        cy.contains('Documentation Required');
        cy.contains('button', 'Add File');
      });
    });

    it('Q1 = Yes clicked twice does not add a second empty expense row', () => {
      mountRfiLanding({ templateVersion: 4 });

      clickRadio(0, 'Yes');
      clickRadio(0, 'No');
      clickRadio(0, 'Yes');

      inclusionCard().find('#inclusion-add-expense-button').should('exist');
      inclusionCard().find('.mdi-close').should('have.length', 1);
    });

    it('Q3 explanation is shown only when Q3 = Yes', () => {
      mountRfiLanding({ templateVersion: 4, model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1 }) });

      inclusionCard().contains("If yes, explain your facility's wages and staffing model").should('not.exist');
      clickRadio(2, 'Yes');
      inclusionCard().contains("If yes, explain your facility's wages and staffing model").should('exist');
      clickRadio(2, 'No');
      inclusionCard().contains("If yes, explain your facility's wages and staffing model").should('not.exist');
    });

    it('shows saved answers when the RFI is reopened', () => {
      mountRfiLanding({
        templateVersion: 4,
        model: rfiModel({
          inclusionEligibleExpenseAndPolicy: 1,
          inclusionBusinessCase: 'Saved business case',
          inclusionParentFeeScope: 101510001,
          inclusionStaffExpenses: 1,
          inclusionStaffingExplanation: 'Saved staffing model',
          inclusionExpenseList: [
            { id: 'x1', description: 'Saved ramp', date: '2027-05-10', frequency: 'Monthly', expense: 250 },
          ],
        }),
      });

      inclusionCard().within(() => {
        cy.get('textarea').eq(0).should('have.value', 'Saved business case');
        cy.get('textarea').eq(1).should('have.value', 'Saved staffing model');
        cy.get('input[value="Saved ramp"]').should('exist');
        cy.get('input[value="250"]').should('exist');
        cy.get('.v-radio-group').eq(1).find('input[type="radio"]').eq(1).should('be.checked');
      });
    });

    it('Add Expense adds a row and the X removes it', () => {
      mountRfiLanding({ templateVersion: 4, model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1 }) });

      inclusionCard().find('.mdi-close').should('have.length', 0);
      inclusionCard().find('#inclusion-add-expense-button').click();
      inclusionCard().find('#inclusion-add-expense-button').click();
      inclusionCard().find('.mdi-close').should('have.length', 2);
      inclusionCard().find('.mdi-close').first().click();
      inclusionCard().find('.mdi-close').should('have.length', 1);
    });

    it('keeps an older RFI without an inclusion list working (defaults to an empty list)', () => {
      const model = rfiModel();
      delete model.inclusionExpenseList;
      mountRfiLanding({ templateVersion: 4, model });

      clickRadio(0, 'Yes');
      inclusionCard().find('.mdi-close').should('have.length', 1);
    });
  });

  context('read-only', () => {
    it('V4 submitted application: Inclusion answers are disabled', () => {
      mountRfiLanding({
        templateVersion: 4,
        applicationStatus: 'SUBMITTED',
        model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1, inclusionStaffExpenses: 1 }),
      });

      inclusionCard().within(() => {
        cy.get('input[type="radio"]').each(($radio) => cy.wrap($radio).should('be.disabled'));
        cy.get('textarea').each(($textarea) => cy.wrap($textarea).should('be.disabled'));
        cy.get('#inclusion-add-expense-button').should('be.disabled');
        cy.contains('button', 'Add File').should('not.exist');
      });
    });

    it('V4 submitted application with the RFI unlocked: Inclusion answers are editable', () => {
      mountRfiLanding({
        templateVersion: 4,
        applicationStatus: 'SUBMITTED',
        unlockRfi: true,
        model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1 }),
      });

      inclusionCard().find('textarea').first().should('not.be.disabled');
      inclusionCard().find('#inclusion-add-expense-button').should('not.be.disabled');
    });
  });

  context('save', () => {
    it('removes blank inclusion expense rows (identical to the empty row template) before saving', () => {
      const blankRow = { description: '', date: undefined, expense: 0, frequency: '' };
      const expense = { id: 'x1', description: 'Ramp', date: '2027-05-10', frequency: 'Monthly', expense: 250 };
      mountRfiLanding({
        templateVersion: 4,
        model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1, inclusionExpenseList: [blankRow, expense, blankRow] }),
      });

      cy.contains('button', 'Save').click();

      cy.then(() => {
        const store = useRfiAppStore();
        expect(store.setRfiModel).to.have.been.called;
        const savedModel = store.setRfiModel.lastCall.args[0];
        expect(savedModel.inclusionEligibleExpenseAndPolicy).to.equal(1);
        expect(savedModel.inclusionExpenseList).to.deep.equal([expense]);
      });
    });

    it('keeps filled-in inclusion expense rows when saving', () => {
      const expense = { id: 'x1', description: 'Ramp', date: '2027-05-10', frequency: 'Monthly', expense: 250 };
      mountRfiLanding({
        templateVersion: 4,
        model: rfiModel({ inclusionEligibleExpenseAndPolicy: 1, inclusionExpenseList: [expense] }),
      });

      cy.contains('button', 'Save').click();

      cy.then(() => {
        const savedModel = useRfiAppStore().setRfiModel.lastCall.args[0];
        expect(savedModel.inclusionExpenseList).to.deep.equal([expense]);
      });
    });
  });
});
