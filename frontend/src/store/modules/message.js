import ApiService from '../../common/apiService';
import { ApiRoutes } from '../../utils/constants';


export default {
  namespaced: true,
  state: {
    allMessages: null,
    unreadMessageCount: 0,
    hasUnreadActionRequiredMessage: false,
    hasUnreadMessage: false,
    hasBroadcastingMessage: false,
  },
  getters: {
    allMessages: state => state.allMessages,
    unreadMessageCount(state) {
      if (state.unreadMessageCount > 0) 
        return state.unreadMessageCount;
      else
        return '0';
    },
    hasUnreadMessage(state) {
      return (state.unreadMessageCount > 0);
    },
    hasUnreadActionRequiredMessage(state, getters) {
      let result = false;
      if (getters.hasUnreadMessage) {
        state.allMessages.forEach(message => {
          if ((message.subject.substring(0,15).toLowerCase() == 'action required') && (!message.isRead))
            result = true;
        });
      }
      return result;
    },
    hasBroadcastingMessage() {
      return false;
    } 
  },
  mutations: {
    setAllMessages: (state, allMessages) => { state.allMessages = allMessages; },
    setUnreadMessageCount: (state, unreadMessageCount) => { state.unreadMessageCount = unreadMessageCount; },
    setHasUnreadMessage: (state, hasUnreadMessage) => { state.hasUnreadMessage = hasUnreadMessage; },
    setHasUnreadActionRequiredMessage: (state, hasUnreadActionRequiredMessage) => { state.hasUnreadActionRequiredMessage = hasUnreadActionRequiredMessage; },
    setHasBroadcastingMessage: (state, hasBroadcastingMessage) => { state.hasBroadcastingMessage = hasBroadcastingMessage; },

    updateUnreadMessagesCount(state) {
      if (state.allMessages) {
        state.unreadMessageCount = state.allMessages.filter(message => !message.isRead).length; 
      }
    },

    updateMessageInMemory(state, updatedMessage){
      try {
        if (state.allMessages) {
          state.allMessages.forEach(message => {
            if (message.messageId === updatedMessage.messageId)
              message.isRead = updatedMessage.isRead;
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
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      } else {
        commit('setAllMessages', []);
      }
    },

    async updateMessage({ commit }, messageId) {
      if (!localStorage.getItem('jwtToken')) { 
        console.log('unable to update Messages data because you are not logged in');
        throw 'unable to update Messages data because you are not logged in';
      }
      if (messageId) {
        try {
          let updatedMessage = {
            'messageId': messageId,
            'isRead': true,
          };
          commit('updateMessageInMemory', updatedMessage);
          commit('updateUnreadMessagesCount');
          let payload = {
            'lastopenedtime': (new Date()).toISOString(),
          };
          await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + messageId, payload);    
        } catch (error) {
          console.log(`Failed to update existing Message - ${error}`);
          throw error;
        }
      }
    },
  },
};

