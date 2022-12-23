import ApiService from '@/common/apiService';
import { ApiRoutes } from '@/utils/constants';


export default {
  namespaced: true,
  state: {
    allMessages: null,
    unreadMessageCount: 0,
    hasUnreadActionRequiredMessage: null,
  },
  getters: {
    allMessages: state => state.allMessages,
    unreadMessageCount(state) {
      if (state.unreadMessageCount > 0) 
        return state.unreadMessageCount;
      else
        return '0';
    },
    hasUnreadActionRequiredMessage: state => state.hasUnreadActionRequiredMessage,
  },
  mutations: {
    setAllMessages: (state, allMessages) => { state.allMessages = allMessages; },
    setUnreadMessageCount: (state, unreadMessageCount) => { state.unreadMessageCount = unreadMessageCount; },
    setHasUnreadActionRequiredMessage: (state, hasUnreadActionRequiredMessage) => { state.hasUnreadActionRequiredMessage = hasUnreadActionRequiredMessage; },

    // Unread messages are messages having no lastOpenedTime
    updateUnreadMessagesCount(state) {
      if (state.allMessages) {
        state.unreadMessageCount = state.allMessages.filter(item => !item.lastOpenedTime).length; 
      }
    },

    updateMessage(state, updatedMessage){
      try {
        if (state.allMessages) {
          state.allMessages.forEach(item => {
            if (item.messageId === updatedMessage.messageId)
              item = updatedMessage;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    updateMessageLastOpenedTime(state, messageId) {
      try {
        if (state.allMessages) {
          state.allMessages.forEach(item => {
            if (item.messageId === messageId)
              item.lastOpenedTime = new Date();
          });
        }
      } catch (error) {
        console.log(error);
      }
    },    
  },

  actions: {
    async getAllMessages({ commit }, organizationId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to get Messages data because you are not logged in');
        throw 'unable to get Messages data because you are not logged in';
      }
      if (organizationId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/' + organizationId);
          commit('setAllMessages', response.data);
          commit('updateUnreadMessagesCount');
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      }
    },

    async getMessage({ commit }, messageId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to get Message data because you are not logged in');
        throw 'unable to get Message data because you are not logged in';
      }
      if (messageId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/' + messageId);
          commit('updateMessage', response.data);
          commit('updateUnreadMessagesCount');
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      }
    },

    // To avoid sending too many GET API queries to Dynamics server every time provider open an email
    // Logic: Whenever the provider open an email, it will update that email status in Vuex.
    // It will only send GET API to Dynamics when user reload the page.
    async updateMessagesLocally({ commit }, messageId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to update Messages data in Local Env because you are not logged in');
        throw 'unable to update Messages data in Local Env because you are not logged in';
      }
      try {
        commit('updateMessageLastOpenedTime', messageId);
        commit('updateUnreadMessagesCount');
      } catch (error) {
        console.log(`Failed to update existing Message in Local Env - ${error}`);
        throw error;
      }
    },

    async updateMessagesDynamics(messageId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to update Messages data in DYNAMICS because you are not logged in');
        throw 'unable to update Messages data in DYNAMICS because you are not logged in';
      }
      if (messageId) {
        try {
          let currentDate = new Date();
          let payload = {
            'lastopenedtime': currentDate.toISOString(),
          };
          let response = await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + messageId, payload);
          console.log('Update message ID ' + messageId + ' - payload: ' + response.data);
        } catch (error) {
          console.log(`Failed to update existing Message in Dynamics - ${error}`);
          throw error;
        }
      }
    },
  },
};

