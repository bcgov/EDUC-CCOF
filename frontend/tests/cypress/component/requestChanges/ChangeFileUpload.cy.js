import ChangeFileUpload from '@/components/requestChanges/ChangeFileUpload.vue';
import vuetify from '@/plugins/vuetify';

const URL_GUID = '134591';
const CHANGE_TYPE = 'DUMMY_CHANGE_TYPE';
const CHANGE_REC_GUID = '423321';

const UPLOADED_DOCUMENTS = [
  {
    annotationid: '424542',
    filename: 'TEST_FILE_NAME.txt',
    document: '',
    notetext: 'TEST_NOTE_TEXT',
    actions: '',
    subject: CHANGE_TYPE,
  },
  {
    filename: '',
    document: '',
    notetext: '',
    actions: '',
    subject: CHANGE_TYPE,
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
              urlGuid: URL_GUID,
              changeRecGuid: CHANGE_REC_GUID,
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
    cy.contains(
      'The maximum file size is 2MB for each document. Accepted file types are jpg, jpeg, heic, png, pdf, docx, doc, xls, and xlsx.',
    );
  });

  it('should render uploaded file details', () => {
    const uploadedDoc = UPLOADED_DOCUMENTS[0];
    mountWithPinia({
      initialState: {
        reportChanges: {
          uploadedDocuments: [uploadedDoc],
        },
      },
      propOverride: { changeType: CHANGE_TYPE },
    });
    cy.contains(uploadedDoc.filename);
    cy.contains(uploadedDoc.notetext);
  });

  it('should render add file and description inputs if no file uploaded', () => {
    const nonUploadedDoc = UPLOADED_DOCUMENTS[1];
    mountWithPinia({
      initialState: {
        reportChanges: {
          uploadedDocuments: [nonUploadedDoc],
          changeRequestMap: new Map([[CHANGE_REC_GUID, { externalStatus: 'NOT_INCOMPLETE' }]]),
        },
      },
      propOverride: { changeType: CHANGE_TYPE },
    });
    cy.get('input[type="file"]').should('exist');
    cy.get('input[placeholder="Enter a description (Optional)"]').should('exist');
  });

  it('should render `upload the change notification form` error message', () => {
    const nonUploadedDoc = UPLOADED_DOCUMENTS[1];
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
