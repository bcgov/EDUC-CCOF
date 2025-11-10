import SupportingDocumentUpload from '@/components/SupportingDocumentUpload.vue';
import vuetify from '@/plugins/vuetify';
import { CHANGE_REQUEST_TYPES, DOCUMENT_TYPES, FILE_REQUIREMENTS_TEXT, PATHS } from '@/utils/constants.js';

const organizationName = 'TEST-ORG-NAME';
const programYearId = '1234';
const facilityId = '4354351';

const facilityName = 'TEST-FAC-NAME1';
const fileName = 'TEST-FILE-NAME';
const description = 'TEST-DESCRIPTION';

const createAuthStore = () => {
  return {
    auth: {
      userInfo: {
        organizationName,
      },
    },
  };
};

const createDefaultNavStore = () => {
  return {
    navBar: {
      navBarList: [
        {
          facilityId,
        },
      ],
    },
  };
};

const createDocument = (extra = {}) => ({
  facilityName,
  document: 'TEST-DOCUMENT',
  description,
  actions: '',
  facilityId,
  documentType: DOCUMENT_TYPES.APPLICATION_SUPPORTING,
  fileName,
  ...extra,
});

function mountWithPinia(initialState = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    cy.mount(SupportingDocumentUpload, {
      global: {
        plugins: [pinia, vuetify],
      },
    });
  });
}

describe('<SupportingDocumentUpload />', () => {
  it('should render default component content', () => {
    mountWithPinia({
      ...createAuthStore(),
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
      },
    });

    cy.contains('Child Care Operating Funding Program - 2025-26');
    cy.contains('h2', 'Supporting Document Upload');
    cy.contains('Provide any additional documents you would like the program to review as part');
    cy.contains('div', FILE_REQUIREMENTS_TEXT);
  });

  context('Data Table', () => {
    it('should render `Add File` button when not locked', () => {
      mountWithPinia({
        ...createAuthStore(),
        application: {
          programYearId,
          applicationUploadedDocuments: [createDocument()],
        },
        ...createDefaultNavStore(),
      });
      cy.contains('button', 'Add File');
    });

    it('should not render `Add File` button when locked', () => {
      mountWithPinia({
        ...createAuthStore(),
        application: {
          programYearId,
          applicationStatus: 'SUBMITTED',
          applicationUploadedDocuments: [createDocument()],
        },
        ...createDefaultNavStore(),
      });
      cy.contains('button', 'Add File').should('not.exist');
    });

    it('should render facilityName, fileName, description if facility contains annotationId', () => {
      mountWithPinia({
        ...createAuthStore(),
        application: {
          programYearId,
          applicationUploadedDocuments: [createDocument({ annotationId: '1233' })],
        },
        ...createDefaultNavStore(),
      });
      cy.contains('span', facilityName);
      cy.contains('span', description);
      cy.contains('span', fileName);
    });

    it('should render table inputs if no annotationId', () => {
      mountWithPinia({
        ...createAuthStore(),
        application: {
          programYearId,
          applicationUploadedDocuments: [
            {
              facilityId,
              documentType: DOCUMENT_TYPES.APPLICATION_SUPPORTING,
            },
          ],
        },
        ...createDefaultNavStore(),
      });
      cy.get('input[placeholder="Select a facility"]').should('exist');
      cy.get('input[placeholder="Select your file"]').should('exist');
      cy.get('input[placeholder="Enter a description (Optional)"]').should('exist');
    });
  });
  it('should render change request message', () => {
    const changeRequestId = '424452';
    mountWithPinia({
      ...createAuthStore(),
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
      },
      navBar: {
        currentUrl: PATHS.PREFIX.CHANGE_REQUEST,
        changeRequestId,
      },
      reportChanges: {
        changeRequestMap: new Map([
          [
            changeRequestId,
            { changeActions: [{ changeType: CHANGE_REQUEST_TYPES.PDF_CHANGE, changeActionId: '4324234' }] },
          ],
        ]),
      },
    });
    cy.contains('Would you like to report any other changes to your licence or service?')
      .closest('.v-card')
      .within(() => {
        cy.get('input[type="radio"]').should('have.length', 2);
        cy.get('.v-radio').eq(0).find('label').should('have.text', 'Yes');

        cy.get('.v-radio').eq(1).find('label').should('have.text', 'No');
      });
  });

  it('should render app dialog for response change confirmation', () => {
    const changeRequestId = '424452';
    mountWithPinia({
      ...createAuthStore(),
      application: {
        programYearId,
        programYearLabel: '2025-26 FY',
      },
      navBar: {
        currentUrl: PATHS.PREFIX.CHANGE_REQUEST,
        changeRequestId,
      },
      reportChanges: {
        changeRequestMap: new Map([
          [
            changeRequestId,
            { changeActions: [{ changeType: CHANGE_REQUEST_TYPES.PDF_CHANGE, changeActionId: '4324234' }] },
          ],
        ]),
      },
    });
    cy.contains('Would you like to report any other changes to your licence or service?')
      .closest('.v-card')
      .within(() => {
        cy.get('input[type="radio"]').should('have.length', 2);

        cy.get('.v-radio').eq(1).click();
      });

    cy.contains('p', 'Are you sure you want to change your response? This will remove');
    cy.contains('p', 'Select "Continue" to confirm.');
    cy.contains('button', 'Back');
    cy.contains('button', 'Continue');
  });
});
