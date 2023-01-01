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
        state.unreadMessageCount = state.allMessages.filter(item => !item.status).length; 
      }
    },

    updateMessageInMemory(state, updatedMessage){
      try {
        if (state.allMessages) {
          state.allMessages.forEach(item => {
            if (item.messageId === updatedMessage.messageId)
              item.status = updatedMessage.status;
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
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/organization/' + organizationId);
          commit('setAllMessages', response.data);
          commit('updateUnreadMessagesCount');
          console.log('getAllmessges Vuex: ' + JSON.stringify(response.data[0]));
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      }
    },

    async updateMessage({ commit }, messageId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to update Messages data in DYNAMICS because you are not logged in');
        throw 'unable to update Messages data in DYNAMICS because you are not logged in';
      }
      if (messageId) {
        try {
          let updatedMessage = {
            'messageId': messageId,
            'status': true,
          };
          commit('updateMessageInMemory', updatedMessage);
          commit('updateUnreadMessagesCount');
          let payload = {
            'lastopenedtime': (new Date()).toISOString(),
          };
          await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + messageId, payload);
          // console.log('Update message ID ' + messageId + ' - response: ' + response.data.lastopenedtime);          
        } catch (error) {
          console.log(`Failed to update existing Message in Dynamics - ${error}`);
          throw error;
        }
      }
    },
  },
};

