import ChangeFileUpload from '@/components/requestChanges/ChangeFileUpload.vue';
import vuetify from '@/plugins/vuetify';
import { FILE_REQUIREMENTS_TEXT } from '@/utils/constants.js';

const urlGuid = '134591';
const changeType = 'DUMMY_CHANGE_TYPE';
const changeRecGuid = '423321';

const uploadedDocuments = [
  {
    annotationid: '424542',
    filename: 'TEST_FILE_NAME.txt',
    document: '',
    notetext: 'TEST_NOTE_TEXT',
    actions: '',
    subject: changeType,
  },
  {
    filename: '',
    document: '',
    notetext: '',
    actions: '',
    subject: changeType,
  },
];

function mountWithPinia({ initialState = {}, propOverride = {} } = {}) {
  cy.setupPinia({ initialState, stubActions: false }).then((pinia) => {
    const pushStub = cy.stub();
    cy.mount(ChangeFileUpload, {
      global: {
        plugins: [pinia, vuetify],
        mocks: {
          $router: {
            push: pushStub,
          },
          $route: {
            params: {
              urlGuid,
              changeRecGuid,
            },
          },
        },
      },
      props: {
        ...propOverride,
      },
    });
    cy.wrap(pushStub).as('routerPush');
  });
}

describe('<ChangeFileUpload />', () => {
  it('should render file requirement text', () => {
    mountWithPinia();
    cy.contains(FILE_REQUIREMENTS_TEXT);
  });

  it('should render uploaded file details', () => {
    const uploadedDoc = uploadedDocuments[0];
    mountWithPinia({
      initialState: {
        reportChanges: {
          uploadedDocuments: [uploadedDoc],
        },
      },
      propOverride: { changeType },
    });
    cy.contains(uploadedDoc.filename);
    cy.contains(uploadedDoc.notetext);
  });

  it('should render add file and description inputs if no file uploaded', () => {
    const nonUploadedDoc = uploadedDocuments[1];
    mountWithPinia({
      initialState: {
        reportChanges: {
          uploadedDocuments: [nonUploadedDoc],
          changeRequestMap: new Map([[changeRecGuid, { externalStatus: 'NOT_INCOMPLETE' }]]),
        },
      },
      propOverride: { changeType },
    });
    cy.get('input[type="file"]').should('exist');
    cy.get('input[placeholder="Enter a description (Optional)"]').should('exist');
  });

  it('should render `upload the change notification form` error message', () => {
    const nonUploadedDoc = uploadedDocuments[1];
    mountWithPinia({
      initialState: {
        reportChanges: {
          uploadedDocuments: [nonUploadedDoc],
        },
      },
      propOverride: { showErrorMessage: true },
    });

    cy.contains('div', 'Please upload the Change Notification Form.');
  });
});
