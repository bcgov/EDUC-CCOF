import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import ApiService from '@/common/apiService';
import ccfriAppStore from '@/store/modules/ccfriApp';

import MockAdapter from 'axios-mock-adapter';
import { ApiRoutes } from '@/utils/constants.js';
import flushPromises from 'flush-promises';
import { cloneDeep } from 'lodash';

const mockAxios = new MockAdapter(ApiService.apiAxios);

describe('ccfriApp.js', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'get');
  const token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJybk9ROU5ucUkwUzAxNHNFZkR2MFA3SVFMMmJYYnpTYjBwRmtuaGFBdXFVIn0.eyJqdGkiOiJmZGMxOTc1OS03OTEwLTQxMWEtYjNiNC1lYjgwNWZiODc4NjQiLCJleHAiOjE1NzA3MzQ0MjIsIm5iZiI6MCwiaWF0IjoxNTcwNzM0MTIyLCJpc3MiOiJodHRwczovL3Nzby5wYXRoZmluZGVyLmdvdi5iYy5jYS9hdXRoL3JlYWxtcy9qc2dicWxpcCIsImF1ZCI6WyJ1bXUtYXV0aCIsInJlYWxtLW1hbmFnZW1lbnQiLCJhY2NvdW50Il0sInN1YiI6ImIwMmMzYzVkLWVjYWUtNDAwNi1iNjkzLWE1Mzc0MzhiZDIwOSIsInR5cCI6IkJlYXJlciIsImF6cCI6InVtdS1hdXRoIiwibm9uY2UiOiJjOTE1MGRkYy0wZjY0LTQxMjYtYjExNy1lZDFjMGE0ODllNGMiLCJhdXRoX3RpbWUiOjE1NzA3MzQxMjIsInNlc3Npb25fc3RhdGUiOiJkYmQyZDllYS1mZGMzLTQ5MjAtOTQzOS04Y2IxOWY4MGIzZmEiLCJhY3IiOiIxIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW11LWFjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsicmVhbG0tbWFuYWdlbWVudCI6eyJyb2xlcyI6WyJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsInZpZXctcmVhbG0iLCJtYW5hZ2UtaWRlbnRpdHktcHJvdmlkZXJzIiwiaW1wZXJzb25hdGlvbiIsInJlYWxtLWFkbWluIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJ1bXUtYXV0aCI6eyJyb2xlcyI6WyJ1bXUtZ2VuZXJhbCJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgdW11LWFjY2VzcyBvZmZsaW5lX2FjY2VzcyIsInJlYWxtX3JvbGUiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bXUtYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXSwibmFtZSI6Ik5hdGhhbiBEZW5ueSIsInByZWZlcnJlZF91c2VybmFtZSI6Im5kZW5ueUBpZGlyIiwiZ2l2ZW5fbmFtZSI6Ik5hdGhhbiIsImZhbWlseV9uYW1lIjoiRGVubnkiLCJlbWFpbCI6Im5hdGhhbi5kZW5ueUBnb3YuYmMuY2EifQ.kvmmk4DFwGnItwDpsRp0t5BMWfmC1y4t_ilErh1lkS07xIbN6wtI4_dpS8DGZWFh_hlC6_yYnAx2noqhZae9Y_0E0OY8_jqmpKgTCb9LJCXra0GB9dnsBPUtQZyTAs1Rcd24O7HCi_kLKU9RDKKVUyRxYmH_d_zyoGWo4Cj5fe2QbIrQr1vLfrYus5qCq76S5JQofnbMBsxV-EsQWJRevltxJTiVLncm5oRN1usMBMscDRzyCkkW083Sly7olzUC5vExA4g-vdPS-XVjDSDdLp9cbU9RCm9HmzP0fvIFhYhaEP0hs1mlIRD_GSlGWgva4boHjKhA8r4OZEKwpDTHnw';
  let store;

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
    localStorage.setItem('jwtToken', token);

    const localVue = createLocalVue();
    localVue.use(Vuex);

    // store = new Vuex.Store(cloneDeep(ccfriApp));
// rootState.app.isRenewal  && state.CCFRIFacilityModel.existingFeesCorrect == 100000000

    const state = { // your root state for the test
      app: {
        isRenewal: true,
        programYearList: {
          "list": [
            {
              "programYearId": "de676989-be6b-ed11-81ac-0022483c5cdf",
              "name": "2023/24 FY",
              "status": "FUTURE",
              "order": 4,
              "previousYearId": "ebad6b71-be6b-ed11-81ac-0022483c5cdf",
              "intakeStart": "2022-12-31T08:00:00Z",
              "intakeEnd": "2024-02-15T08:00:00Z",
              "declarationbStart": "2023-02-23T21:30:00Z"
            },
            {
              "programYearId": "ebad6b71-be6b-ed11-81ac-0022483c5cdf",
              "name": "2022/23 FY",
              "status": "CURRENT",
              "order": 3,
              "previousYearId": "e37d5b6b-be6b-ed11-81ac-0022483c5cdf",
              "intakeStart": "2022-01-31T08:00:00Z",
              "intakeEnd": "2023-01-14T08:00:00Z",
              "declarationbStart": "2022-02-23T08:00:00Z"
            },
            {
              "programYearId": "e37d5b6b-be6b-ed11-81ac-0022483c5cdf",
              "name": "2021/22 FY",
              "status": "HISTORICAL",
              "order": 2,
              "previousYearId": "f5495465-be6b-ed11-81ac-0022483c5cdf",
              "intakeStart": null,
              "intakeEnd": null,
              "declarationbStart": null
            },
            {
              "programYearId": "f5495465-be6b-ed11-81ac-0022483c5cdf",
              "name": "2020/21 FY",
              "status": "HISTORICAL",
              "order": 1,
              "previousYearId": null,
              "intakeStart": null,
              "intakeEnd": null,
              "declarationbStart": null
            }
          ]
        }
      },
      application: {
        programYearId: 'de676989-be6b-ed11-81ac-0022483c5cdf'
      }
    }

    store = new Vuex.Store({
      state,
      modules: {
        ccfriApp: ccfriAppStore
      }
    })
  });
  afterEach(() => {
    spy.mockClear();
  });

  it('User should get true response on successful get', async () => {
    const ccfriId = 'c75992f1-e725-4b05-af57-b37b6e717ab4';
    const facilityId = '73e3051e-dd3d-42cb-acc2-496ef6f7a12a';

    mockAxios.onGet(`${ApiRoutes.CCFRIFACILITY}/${ccfriId}`).reply(200,
      {
        "facilityId": "73e3051e-dd3d-42cb-acc2-496ef6f7a12a",
        "ccfriOptInStatus": 1,
        "ccfriApplicationNotes": "Have a temporary placement until July 2024 so can not admit any more children until that time.",
        "previousCcfriId": "7227581f-9d96-ed11-aad1-0022483c51a6",
        "ccof_formcomplete": false,
        "existingFeesCorrect": 100000000,
        "hasClosureFees": 100000001,
        "childCareTypes": [
          {
            "parentFeeGUID": "92b6ba1d-8ac4-ed11-b597-000d3af36bac",
            "childCareCategory": "0 to 18 months",
            "childCareCategoryId": "2ba2c1f8-bd6b-ed11-81ac-0022483c5606",
            "programYear": "2023/24 FY",
            "programYearId": "de676989-be6b-ed11-81ac-0022483c5cdf",
            "approvedFeeApr": 49.52,
            "approvedFeeAug": 49.52,
            "approvedFeeDec": 49.52,
            "approvedFeeFeb": 49.52,
            "approvedFeeJan": 49.52,
            "approvedFeeJul": 49.52,
            "approvedFeeJun": 49.52,
            "approvedFeeMar": 49.52,
            "approvedFeeMay": 49.52,
            "approvedFeeNov": 49.52,
            "approvedFeeOct": 49.52,
            "approvedFeeSep": 49.52,
            "feeFrequency": "Daily",
            "orderNumber": 1
          },
          {
            "parentFeeGUID": "1f6deb1f-8ac4-ed11-b597-0022483c554a",
            "childCareCategory": "Out of School Care - Kindergarten",
            "childCareCategoryId": "2dacb8f8-bd6b-ed11-81ac-0022483d5ee0",
            "programYear": "2023/24 FY",
            "programYearId": "de676989-be6b-ed11-81ac-0022483c5cdf",
            "approvedFeeApr": 49.28,
            "approvedFeeAug": 49.28,
            "approvedFeeDec": 49.28,
            "approvedFeeFeb": 49.28,
            "approvedFeeJan": 49.28,
            "approvedFeeJul": 49.28,
            "approvedFeeJun": 49.28,
            "approvedFeeMar": 49.28,
            "approvedFeeMay": 49.28,
            "approvedFeeNov": 49.28,
            "approvedFeeOct": 49.28,
            "approvedFeeSep": 49.28,
            "feeFrequency": "Daily",
            "orderNumber": 4
          },
          {
            "parentFeeGUID": "9ef53721-8ac4-ed11-b597-0022483d89ba",
            "childCareCategory": "18 to 36 months",
            "childCareCategoryId": "5b87dff6-bd6b-ed11-81ac-0022483c5540",
            "programYear": "2023/24 FY",
            "programYearId": "de676989-be6b-ed11-81ac-0022483c5cdf",
            "approvedFeeApr": 49.33,
            "approvedFeeAug": 49.33,
            "approvedFeeDec": 49.33,
            "approvedFeeFeb": 49.33,
            "approvedFeeJan": 49.33,
            "approvedFeeJul": 49.33,
            "approvedFeeJun": 49.33,
            "approvedFeeMar": 49.33,
            "approvedFeeMay": 49.33,
            "approvedFeeNov": 49.33,
            "approvedFeeOct": 49.33,
            "approvedFeeSep": 49.33,
            "feeFrequency": "Daily",
            "orderNumber": 2
          }
        ],
        "dates": []
      }
    );

    mockAxios.onGet(`${ApiRoutes.FACILITY}/${facilityId}/licenseCategories`).reply(200,
      [
        {
          "childCareCategoryId": "575eb9f8-bd6b-ed11-81ac-0022483c5061",
          "childCareCategory": "3 Years to Kindergarten",
          "orderNumber": 3
        },
        {
          "childCareCategoryId": "2cacb8f8-bd6b-ed11-81ac-0022483d5ee0",
          "childCareCategory": "Out of School Care - Grade 1+",
          "orderNumber": 5
        },
        {
          "childCareCategoryId": "2ba2c1f8-bd6b-ed11-81ac-0022483c5606",
          "childCareCategory": "0 to 18 months",
          "orderNumber": 1
        },
        {
          "childCareCategoryId": "2dacb8f8-bd6b-ed11-81ac-0022483d5ee0",
          "childCareCategory": "Out of School Care - Kindergarten",
          "orderNumber": 4
        },
        {
          "childCareCategoryId": "5b87dff6-bd6b-ed11-81ac-0022483c5540",
          "childCareCategory": "18 to 36 months",
          "orderNumber": 2
        }
      ]
    );

    await store.dispatch('ccfriApp/loadCCFRIFacility', ccfriId);
    expect(store.state.ccfriApp.CCFRIFacilityModel).toBeTruthy();
    expect(store.state.ccfriApp.CCFRIFacilityModel.childCareTypes.length).toBe(3);
    await store.dispatch('ccfriApp/decorateWithCareTypes', facilityId);
    expect(store.state.ccfriApp.CCFRIFacilityModel.childCareTypes.length).toBe(5);
    await flushPromises();
  });

});
