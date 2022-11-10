
export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: undefined,
    foo: 'bar'
  },
  getters: {},
  mutations: {
    model(state, value) {
      state.model = value;
    },
    isValidForm(state, value) {
      state.isValidForm = value;
    },
  },
  actions: {
    async save() { 
      console.log('save');
    }
  }
};
