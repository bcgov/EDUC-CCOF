import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { ApiRoutes } from '../utils/constants.js';

export const useMessageStore = defineStore('message', {
  state: () => ({
    allMessages: null,
    unreadMessageCount: 0,
    hasUnreadActionRequiredMessage: false,
    hasUnreadMessage: false,
    hasBroadcastingMessage: false,
  }),
  getters: {
    unreadMessageCount: (state) => {
      if (state.unreadMessageCount > 0) return state.unreadMessageCount;
      else return '0';
    },
    hasUnreadMessage: (state) => {
      return state.unreadMessageCount > 0;
    },
    hasUnreadActionRequiredMessage: (state) => {
      let result = false;
      if (this.hasUnreadMessage) {
        state.allMessages.forEach((message) => {
          if (message.subject.substring(0, 15).toLowerCase() == 'action required' && !message.isRead) result = true;
        });
      }
      return result;
    },
    // TODO: The heck is this even a thing for?
    hasBroadcastingMessage: () => {
      return false;
    },
  },
  actions: {
    setAllMessages(allMessages) {
      this.allMessages = allMessages;
    },
    setUnreadMessageCount(unreadMessageCount) {
      this.unreadMessageCount = unreadMessageCount;
    },
    setHasUnreadMessage(hasUnreadMessage) {
      this.hasUnreadMessage = hasUnreadMessage;
    },
    setHasUnreadActionRequiredMessage(hasUnreadActionRequiredMessage) {
      this.hasUnreadActionRequiredMessage = hasUnreadActionRequiredMessage;
    },
    setHasBroadcastingMessage(hasBroadcastingMessage) {
      this.hasBroadcastingMessage = hasBroadcastingMessage;
    },
    updateUnreadMessagesCount() {
      if (this.allMessages) {
        this.unreadMessageCount = this.allMessages.filter((message) => !message.isRead).length;
      }
    },
    updateMessageInMemory(updatedMessage) {
      try {
        if (this.allMessages) {
          this.allMessages.forEach((message) => {
            if (message.messageId === updatedMessage.messageId) message.isRead = updatedMessage.isRead;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAllMessages(organizationId) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to get Messages data because you are not logged in');
        throw 'unable to get Messages data because you are not logged in';
      }
      if (organizationId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/organization/' + organizationId);
          this.setAllMessages(response.data);
          this.updateUnreadMessagesCount();
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      } else {
        this.setAllMessages([]);
      }
    },
    async updateMessage(messageId) {
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to update Messages data because you are not logged in');
        throw 'unable to update Messages data because you are not logged in';
      }
      if (messageId) {
        try {
          let updatedMessage = {
            messageId: messageId,
            isRead: true,
          };
          this.updateMessageInMemory(updatedMessage);
          this.updateUnreadMessagesCount();
          let payload = {
            lastopenedtime: new Date().toISOString(),
          };
          await ApiService.apiAxios.put(ApiRoutes.MESSAGE + '/' + messageId, payload);
        } catch (error) {
          console.log(`Failed to update existing Message - ${error}`);
          throw error;
        }
      }
    },
  },
});
