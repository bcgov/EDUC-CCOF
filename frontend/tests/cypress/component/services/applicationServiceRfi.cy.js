import ApplicationService from '@/services/applicationService';
import { PROGRAM_YEAR_LANGUAGE_TYPES } from '@/utils/constants.js';

const V3 = 3;
const V4 = 4;

const ALL_CHILDREN = 101510000;
const ONLY_SUPPORT_NEEDS = 101510001;

function completeExpense(overrides = {}) {
  return {
    id: 'exp-1',
    description: 'Adaptive equipment',
    date: '2027-05-10',
    frequency: 'One-time',
    expense: 1500,
    ...overrides,
  };
}

// An RFI where every pre-existing section is answered "No", so only the Inclusion section decides completeness
function baseRfi(overrides = {}) {
  return {
    exceptionalCircumstances: 0,
    feeIncreaseDueToWage: 0,
    feeIncreaseExtendedHours: 0,
    IndigenousConnection: 0,
    underservedPop: 0,
    expenseList: [],
    fundingList: [],
    wageList: [],
    expansionList: [],
    indigenousExpenseList: [],
    inclusionExpenseList: [],
    ...overrides,
  };
}

function completeInclusion(overrides = {}) {
  return {
    inclusionEligibleExpenseAndPolicy: 1,
    inclusionBusinessCase: 'Business case',
    inclusionParentFeeScope: ALL_CHILDREN,
    inclusionStaffExpenses: 1,
    inclusionStaffingExplanation: 'Staffing model',
    inclusionExpenseList: [completeExpense()],
    ...overrides,
  };
}

describe('ApplicationService - RFI template V4 and PSE Inclusion', () => {
  context('isApplicationTemplateV4OrHigher', () => {
    [
      { version: undefined, expected: false },
      { version: null, expected: false },
      { version: 1, expected: false },
      { version: 2, expected: false },
      { version: 3, expected: false },
      { version: 4, expected: true },
      { version: 5, expected: true },
      { version: '4', expected: true },
      { version: '3', expected: false },
    ].forEach(({ version, expected }) => {
      it(`returns ${expected} for version ${JSON.stringify(version)}`, () => {
        expect(ApplicationService.isApplicationTemplateV4OrHigher(version)).to.equal(expected);
      });
    });
  });

  context('isPSEInclusionComplete', () => {
    it('is incomplete when Q1 is not answered (undefined)', () => {
      expect(ApplicationService.isPSEInclusionComplete(baseRfi())).to.equal(false);
    });

    it('is incomplete when Q1 is not answered (null)', () => {
      expect(ApplicationService.isPSEInclusionComplete(baseRfi({ inclusionEligibleExpenseAndPolicy: null }))).to.equal(
        false,
      );
    });

    it('is complete when Q1 is No, even if nothing else is filled in', () => {
      expect(ApplicationService.isPSEInclusionComplete(baseRfi({ inclusionEligibleExpenseAndPolicy: 0 }))).to.equal(
        true,
      );
    });

    it('is complete when Q1 is No and leftover answers/expenses exist from an earlier Yes', () => {
      const rfi = baseRfi(completeInclusion({ inclusionEligibleExpenseAndPolicy: 0, inclusionBusinessCase: '' }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(true);
    });

    it('is complete when Q1 is Yes and every required answer and expense is provided', () => {
      expect(ApplicationService.isPSEInclusionComplete(baseRfi(completeInclusion()))).to.equal(true);
    });

    it('is complete with Q2 = Only children with support needs', () => {
      const rfi = baseRfi(completeInclusion({ inclusionParentFeeScope: ONLY_SUPPORT_NEEDS }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(true);
    });

    it('is complete when Q3 is No and the Q3 explanation is empty', () => {
      const rfi = baseRfi(completeInclusion({ inclusionStaffExpenses: 0, inclusionStaffingExplanation: null }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(true);
    });

    ['inclusionBusinessCase', 'inclusionParentFeeScope', 'inclusionStaffExpenses'].forEach((field) => {
      it(`is incomplete when Q1 is Yes and ${field} is missing (undefined)`, () => {
        const rfi = baseRfi(completeInclusion());
        delete rfi[field];
        expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
      });

      it(`is incomplete when Q1 is Yes and ${field} is null`, () => {
        const rfi = baseRfi(completeInclusion({ [field]: null }));
        expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
      });
    });

    it('is incomplete when Q1 is Yes and the business case is an empty string', () => {
      const rfi = baseRfi(completeInclusion({ inclusionBusinessCase: '' }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    it('is incomplete when Q3 is Yes and the Q3 explanation is missing', () => {
      const rfi = baseRfi(completeInclusion({ inclusionStaffingExplanation: null }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    it('is incomplete when Q3 is Yes and the Q3 explanation is an empty string', () => {
      const rfi = baseRfi(completeInclusion({ inclusionStaffingExplanation: '' }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    it('is incomplete when Q1 is Yes and there are no expense rows', () => {
      const rfi = baseRfi(completeInclusion({ inclusionExpenseList: [] }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    it('is incomplete when Q1 is Yes and the expense list is missing', () => {
      const rfi = baseRfi(completeInclusion());
      delete rfi.inclusionExpenseList;
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    ['description', 'date', 'frequency', 'expense'].forEach((field) => {
      it(`is incomplete when an expense row is missing ${field}`, () => {
        const rfi = baseRfi(completeInclusion({ inclusionExpenseList: [completeExpense({ [field]: null })] }));
        expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
      });

      it(`is incomplete when an expense row has an empty-string ${field}`, () => {
        const rfi = baseRfi(completeInclusion({ inclusionExpenseList: [completeExpense({ [field]: '' })] }));
        expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
      });
    });

    it('is complete when an expense amount is 0 (0 counts as entered)', () => {
      const rfi = baseRfi(completeInclusion({ inclusionExpenseList: [completeExpense({ expense: 0 })] }));
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(true);
    });

    it('is incomplete when only one of several expense rows is incomplete', () => {
      const rfi = baseRfi(
        completeInclusion({
          inclusionExpenseList: [completeExpense(), completeExpense({ id: 'exp-2', description: null })],
        }),
      );
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(false);
    });

    it('is complete when several expense rows are all complete', () => {
      const rfi = baseRfi(
        completeInclusion({ inclusionExpenseList: [completeExpense(), completeExpense({ id: 'exp-2' })] }),
      );
      expect(ApplicationService.isPSEInclusionComplete(rfi)).to.equal(true);
    });
  });

  context('isRFIComplete', () => {
    const LABEL = PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26;

    it('is incomplete for an empty RFI regardless of template', () => {
      expect(ApplicationService.isRFIComplete({}, LABEL, V4)).to.equal(false);
      expect(ApplicationService.isRFIComplete({}, LABEL, V3)).to.equal(false);
    });

    it('template V3: ignores the Inclusion section when it is not answered', () => {
      expect(ApplicationService.isRFIComplete(baseRfi(), LABEL, V3)).to.equal(true);
    });

    it('template V3: ignores an incomplete Inclusion section', () => {
      const rfi = baseRfi({ inclusionEligibleExpenseAndPolicy: 1 });
      expect(ApplicationService.isRFIComplete(rfi, LABEL, V3)).to.equal(true);
    });

    it('no template version passed (e.g. change requests): ignores the Inclusion section', () => {
      const rfi = baseRfi({ inclusionEligibleExpenseAndPolicy: 1 });
      expect(ApplicationService.isRFIComplete(rfi, LABEL)).to.equal(true);
    });

    it('template V4: is incomplete when the Inclusion Q1 is not answered', () => {
      expect(ApplicationService.isRFIComplete(baseRfi(), LABEL, V4)).to.equal(false);
    });

    it('template V4: is complete when the Inclusion Q1 is No', () => {
      expect(ApplicationService.isRFIComplete(baseRfi({ inclusionEligibleExpenseAndPolicy: 0 }), LABEL, V4)).to.equal(
        true,
      );
    });

    it('template V4: is incomplete when the Inclusion Q1 is Yes and other answers are missing', () => {
      const rfi = baseRfi({ inclusionEligibleExpenseAndPolicy: 1 });
      expect(ApplicationService.isRFIComplete(rfi, LABEL, V4)).to.equal(false);
    });

    it('template V4: is complete when the Inclusion section is fully answered', () => {
      expect(ApplicationService.isRFIComplete(baseRfi(completeInclusion()), LABEL, V4)).to.equal(true);
    });

    it('template V4 given as a string ("4") still checks the Inclusion section', () => {
      expect(ApplicationService.isRFIComplete(baseRfi(), LABEL, '4')).to.equal(false);
    });

    it('template V4: a complete Inclusion section does not hide another incomplete section', () => {
      const rfi = baseRfi(completeInclusion({ IndigenousConnection: 1, indigenousExpenseList: [] }));
      expect(ApplicationService.isRFIComplete(rfi, LABEL, V4)).to.equal(false);
    });
  });

  context('isFacilityComplete passes the template version to the RFI check', () => {
    function facility(applicationTemplateVersion, rfiApp) {
      return {
        applicationTemplateVersion,
        hasRfi: true,
        rfiApp,
        languageYearLabel: PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26,
      };
    }

    it('calls isRFIComplete with the facility template version', () => {
      const rfiSpy = cy.spy(ApplicationService, 'isRFIComplete');
      cy.stub(ApplicationService, 'isCCFRIComplete').returns(true);
      cy.stub(ApplicationService, 'isClosuresComplete').returns(true);
      cy.stub(ApplicationService, 'isLicenceUploadComplete').returns(true);
      cy.stub(ApplicationService, 'isECEWEFacilityComplete').returns(true);
      const rfi = baseRfi();

      ApplicationService.isFacilityComplete({ ...facility(V4, rfi), isRenewal: true, ccfri: {} });

      cy.wrap(rfiSpy).should('have.been.calledWith', rfi, PROGRAM_YEAR_LANGUAGE_TYPES.FY2025_26, V4);
    });

    it('template V4 facility with an unanswered Inclusion section is incomplete', () => {
      cy.stub(ApplicationService, 'isCCFRIComplete').returns(true);
      cy.stub(ApplicationService, 'isClosuresComplete').returns(true);
      cy.stub(ApplicationService, 'isLicenceUploadComplete').returns(true);
      cy.stub(ApplicationService, 'isECEWEFacilityComplete').returns(true);

      expect(
        ApplicationService.isFacilityComplete({ ...facility(V4, baseRfi()), isRenewal: true, ccfri: {} }),
      ).to.equal(false);
    });

    it('template V3 facility with an unanswered Inclusion section is complete', () => {
      cy.stub(ApplicationService, 'isCCFRIComplete').returns(true);
      cy.stub(ApplicationService, 'isClosuresComplete').returns(true);
      cy.stub(ApplicationService, 'isLicenceUploadComplete').returns(true);
      cy.stub(ApplicationService, 'isECEWEFacilityComplete').returns(true);

      expect(
        ApplicationService.isFacilityComplete({ ...facility(V3, baseRfi()), isRenewal: true, ccfri: {} }),
      ).to.equal(true);
    });
  });
});
