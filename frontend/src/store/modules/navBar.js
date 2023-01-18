function getActiveIndex(items) {
  let foundIndex = -1;
  for (let i = 0; (i < items.length && foundIndex < 0); i++) {
    if (items[i].isActive) {
      foundIndex = items[i].position;
    } else if (items[i].items) {
      let index = getActiveIndex(items[i].items);
      if (index > 0) {
        foundIndex = index;
      }
    }
  }
  return foundIndex;
}
function getNavBarAtPositionIndex(items, index) {
  let foundItem = null;
  for (let i = 0; (i < items.length && !foundItem); i++) {
    if (items[i].position == index) {
      foundItem = items[i];
    } else if (items[i].items) {
      let navBarItem = getNavBarAtPositionIndex(items[i].items, index);
      if (navBarItem) {
        foundItem = navBarItem;
      }
    }
  }
  return foundItem;
}


export default {
  namespaced: true,
  state: {
    navBarItems: [],
  },
  mutations: {
    setNavBarItems: (state, value) => { state.navBarItems = value; },
  },
  actions: {
    getNextPath: ({state}) => {
      let index = getActiveIndex(state.navBarItems);
      return getNavBarAtPositionIndex(state.navBarItems, (index + 1))?.link;
    },
    getPreviousPath: ({state}) => {
      let index = getActiveIndex(state.navBarItems);
      return getNavBarAtPositionIndex(state.navBarItems, (index - 1))?.link;
    },

  },  
};