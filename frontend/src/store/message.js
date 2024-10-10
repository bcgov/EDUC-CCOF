import { defineStore } from 'pinia';

import ApiService from '../common/apiService.js';
import { ApiRoutes } from '../utils/constants.js';

export const useMessageStore = defineStore('message', {
  state: () => ({
    allMessages: null,
    unreadMessageCount: 0,
    hasUnreadMessage: false,
    hasBroadcastingMessage: false,
  }),
  getters: {
    hasUnreadActionRequiredMessage: (state) => {
      let result = false;
      if (state.hasUnreadMessage) {
        state.allMessages.forEach((message) => {
          if (message.subject.substring(0, 15).toLowerCase() == 'action required' && !message.isRead) result = true;
        });
      }
      return result;
    },
  },
  actions: {
    setAllMessages(allMessages) {
      this.allMessages = allMessages;
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
      console.log('WHEE messages');
      if (!localStorage.getItem('jwtToken')) {
        console.log('unable to get Messages data because you are not logged in');
        throw 'unable to get Messages data because you are not logged in';
      }
      if (organizationId) {
        try {
          let response = await ApiService.apiAxios.get(ApiRoutes.MESSAGE + '/organization/' + organizationId);
          this.allMessages = response.data;
          this.updateUnreadMessagesCount();
        } catch (error) {
          console.log(`Failed to get Organization messages - ${error}`);
          throw error;
        }
      } else {
        this.allMessages = [];
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
