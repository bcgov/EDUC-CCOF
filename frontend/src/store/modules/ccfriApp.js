//maybe can remove this file 
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

//I would maybe like a way to load the CCFRI model data into here?

//Ask monday about having SO many arrays - I think it would work but perhaps there is a better way 
