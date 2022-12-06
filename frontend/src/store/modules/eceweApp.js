
export default {
  namespaced: true,
  state: {
    isValidForm: undefined,
    model: [
      
    ],
    foo: 'bar',
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
  actions: {}
};

//Ask monday about having SO many arrays - I think it would work but perhaps there is a better way 
