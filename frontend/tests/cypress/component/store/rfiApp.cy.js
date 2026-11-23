import ApiService from '@/common/apiService.js';
import { useRfiAppStore } from '@/store/rfiApp.js';
import { ApiRoutes } from '@/utils/constants.js';

const CCFRI_ID = 'ccfri-1';
const RFI_ID = 'rfi-1';

function inclusionExpense(overrides = {}) {
  return { id: 'exp-1', description: 'Ramp', date: '2027-05-10', frequency: 'One-time', expense: 900, ...overrides };
}

function emptyRfiLists() {
  return { expansionList: [], wageList: [], fundingList: [], expenseList: [], indigenousExpenseList: [] };
}

// rfiApp.js declares its state under `store:` instead of `state:`, so Pinia's initialState does not reach it;
// assign the values on the store directly instead.
function setupStore(rfiModel, loadedModel) {
  return cy.setupPinia().then(() => {
    const store = useRfiAppStore();
    store.rfiModel = rfiModel;
    store.loadedModel = loadedModel;
    store.rfiStore = {};
    return store;
  });
}

describe('rfiApp store - PSE Inclusion expense list', () => {
  beforeEach(() => {
    cy.mockJwt();
    cy.stub(ApiService.apiAxios, 'put').as('put').resolves({});
    cy.stub(ApiService.apiAxios, 'post')
      .as('post')
      .resolves({ data: { friApplicationGuid: 'new-rfi' } });
    cy.stub(ApiService.apiAxios, 'get').as('get');
  });

  afterEach(() => {
    cy.clearJwt();
  });

  context('saveRfi on an existing RFI (PUT)', () => {
    it('sends the inclusion expense list when rows were added', () => {
      const loaded = { ...emptyRfiLists(), rfiId: RFI_ID, inclusionExpenseList: [] };
      const current = { ...loaded, inclusionEligibleExpenseAndPolicy: 1, inclusionExpenseList: [inclusionExpense()] };
      setupStore(current, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: false }));
      });

      cy.get('@put').should('have.been.calledOnce');
      cy.get('@put').then((put) => {
        const [url, payload] = put.firstCall.args;
        expect(url).to.equal(`${ApiRoutes.APPLICATION_RFI}/rfi/${RFI_ID}`);
        expect(payload.inclusionExpenseList).to.deep.equal([inclusionExpense()]);
        expect(payload.inclusionEligibleExpenseAndPolicy).to.equal(1);
      });
    });

    it('sends an empty inclusion expense list when all rows were removed', () => {
      const loaded = { ...emptyRfiLists(), rfiId: RFI_ID, inclusionExpenseList: [inclusionExpense()] };
      const current = { ...loaded, inclusionExpenseList: [] };
      setupStore(current, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: false }));
      });

      cy.get('@put').then((put) => {
        expect(put.firstCall.args[1].inclusionExpenseList).to.deep.equal([]);
      });
    });

    it('omits the inclusion expense list when it is unchanged but other answers changed', () => {
      const loaded = { ...emptyRfiLists(), rfiId: RFI_ID, inclusionExpenseList: [inclusionExpense()] };
      const current = { ...loaded, inclusionExpenseList: [inclusionExpense()], inclusionBusinessCase: 'updated' };
      setupStore(current, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: true }));
      });

      cy.get('@put').then((put) => {
        const payload = put.firstCall.args[1];
        expect(payload.inclusionExpenseList).to.equal(undefined);
        expect(payload.inclusionBusinessCase).to.equal('updated');
        expect(payload.isRfiComplete).to.equal(true);
      });
    });

    it('omits the inclusion expense list for an older (template V3) RFI that has no list', () => {
      const loaded = { ...emptyRfiLists(), rfiId: RFI_ID };
      const current = { ...loaded, exceptionalCircumstances: 0 };
      setupStore(current, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: true }));
      });

      cy.get('@put').then((put) => {
        expect(put.firstCall.args[1].inclusionExpenseList).to.equal(undefined);
      });
    });

    it('does not call the API when nothing changed', () => {
      const loaded = { ...emptyRfiLists(), rfiId: RFI_ID, inclusionExpenseList: [inclusionExpense()] };
      setupStore({ ...loaded, inclusionExpenseList: [inclusionExpense()] }, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: true }));
      });

      cy.get('@put').should('not.have.been.called');
      cy.get('@post').should('not.have.been.called');
    });
  });

  context('saveRfi on a new RFI (POST)', () => {
    it('sends the inclusion expense list with the new RFI', () => {
      const loaded = { ...emptyRfiLists(), inclusionExpenseList: [] };
      const current = { ...loaded, inclusionEligibleExpenseAndPolicy: 1, inclusionExpenseList: [inclusionExpense()] };
      setupStore(current, loaded).then((store) => {
        cy.wrap(store.saveRfi({ ccfriId: CCFRI_ID, isRfiComplete: false })).then((guid) => {
          expect(guid).to.equal('new-rfi');
          expect(store.rfiModel.rfiId).to.equal('new-rfi');
        });
      });

      cy.get('@post').then((post) => {
        const [url, payload] = post.firstCall.args;
        expect(url).to.equal(`${ApiRoutes.APPLICATION_RFI}/${CCFRI_ID}/rfi`);
        expect(payload.inclusionExpenseList).to.deep.equal([inclusionExpense()]);
        expect(payload.ccfriApplicationId).to.equal(CCFRI_ID);
      });
    });
  });

  context('loadRfi', () => {
    it('creates an empty inclusion expense list for a facility with no RFI yet', () => {
      cy.get('@get').then((get) => get.resolves({ data: {} }));
      setupStore({}, {}).then((store) => {
        cy.wrap(store.loadRfi(CCFRI_ID)).then(() => {
          expect(store.rfiModel.inclusionExpenseList).to.deep.equal([]);
          expect(store.loadedModel.inclusionExpenseList).to.deep.equal([]);
        });
      });
    });

    it('keeps the inclusion expense list returned by the API', () => {
      const apiRfi = { ...emptyRfiLists(), rfiId: RFI_ID, inclusionExpenseList: [inclusionExpense()] };
      cy.get('@get').then((get) => get.resolves({ data: apiRfi }));
      setupStore({}, {}).then((store) => {
        cy.wrap(store.loadRfi(CCFRI_ID)).then(() => {
          expect(store.rfiModel.inclusionExpenseList).to.deep.equal([inclusionExpense()]);
        });
      });
    });
  });
});
