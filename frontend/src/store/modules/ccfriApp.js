
export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: [
      
    ],
    foo: 'bar',
    ccfriOptInOrOut: []
  },
  getters: {},
  mutations: {
    model(state, value) {
      state.model = value;
    },
    ccfriOptInOrOut(state,value){
      state.ccfriOptInOrOut = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
  },
  actions: {}
};
