//import axios from 'axios';
import ApiService from '@/common/apiService';

describe('apiService.js', () => {
  const spy = jest.spyOn(ApiService.apiAxios, 'post');

  beforeEach(() => {
    ApiService.apiAxios.interceptors.response.eject(ApiService.intercept);
  });
  afterEach(() => {
    spy.mockClear();
  });

  it('Set and Delete Auth header', () => {
    ApiService.setAuthHeader('randomToken');
    expect(ApiService.apiAxios.defaults.headers.common['Authorization']).toBe('Bearer randomToken');
    ApiService.setAuthHeader();
    expect(ApiService.apiAxios.defaults.headers.common['Authorization']).toBe(undefined);
  });
});
