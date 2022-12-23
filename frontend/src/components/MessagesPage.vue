<template>
  <v-container fluid style="padding:0">

    <MessagesToolbar :isActionRequiredMessageDisplayed="false" :isBroadcastingMessageDisplayed="false"></MessagesToolbar>
    
    <!-- <v-row justify="center">
      <div
        class="pa-10"
        :class="'text-h4'"
        v-text="'MESSAGES'">
      </div>
    </v-row > -->
    
    <v-container id="messages" fluid style="padding:0" >
      <template v-if="!allMessages">
        <Spinner></Spinner>
      </template>

      <template v-else>
        <v-row  style="margin:0"> 
          <v-col id="messages-summary" fluid style="padding:0" :cols="4">
            <v-card tile style="padding:0; border-right: 1px solid lightgrey" class="elevation-0" >
              <v-data-table
                :headers="headers"
                :items="allMessages"
                :sort-by="['sentDate']"
                :sort-desc="[true]"
                mobile-breakpoint="960"
                fluid
                height="100vh"
                fixed-header
                :item-class="getStyle"
                disable-pagination
                hide-default-footer
                @click:row="rowClickHandler"
                item-key="messageId" single-select
              >
                <template v-slot:item.lastOpenedTime="{item}">
                  <p v-if="item.lastOpenedTime">
                    Read
                  </p>
                  <p v-else>
                    Unread
                  </p>
                </template>
                <!--
                <template v-slot:item.actionRequired="{item}">
                  <v-icon aria-hidden="false" size="30" color="#ffcc00" v-if="item.actionRequired">
                    mdi-alert
                  </v-icon>
                </template> -->

              </v-data-table>
            </v-card>
          </v-col>

          <v-col id="messages-content" fluid style="padding:0; height: 100vh;" :cols="8" v-if="this.message.sender">
            <v-card
                class="pa-4 overflow-auto elevation-0" fluid tile
                style="height:100%;width:100%;"
            >
              <v-card-title style="padding:0;">
                <template>
                  <v-col :cols="8">
                    {{this.message.sender}}
                  </v-col>
                  <v-col align="right" :cols="4">
                    {{this.message.sentDate}}
                  </v-col>
                </template>
                <template>
                  <v-col>
                    <strong>{{this.message.subject}}</strong>
                  </v-col>
                </template>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text  v-html="this.message.messageContent">
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <v-divider></v-divider>
      <v-row justify="center">
        <v-btn id="back-button" color="info" outlined x-large @click="goToHomePage()" style="margin:2%">
          Back
        </v-btn>
      </v-row>
    </v-container>
  </v-container>  
</template>


<script>
import MessagesToolbar from './guiComponents/MessagesToolbar.vue';
import Spinner from '@/components/common/Spinner';
import { PATHS } from '@/utils/constants';
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'MessagesPage',

  props: {
  },

  data() {
    return {
      input: '',
      PATHS: PATHS,
      results : {},
      selectedId: -1,
      headers: [
        {
          text: 'Read/Unread',
          align: 'start',
          value: 'lastOpenedTime'
        },
        // { text: 'Action Required', value: 'actionRequired' },
        { text: 'Subjects', value: 'subject' },
        { text: 'Date Received', value: 'sentDate' }
      ],
      message: {
        sender: '',
        subject:'',
        sentDate:'',
        messageContent: '',
      },
    };
  },
  computed: {
    ...mapGetters('message', ['allMessages']),
  },
  methods: {
    ...mapMutations('message', ['updateMessagesLocally','updateUnreadMessagesCount']),
    ...mapActions('message', ['updateMessagesDynamics']),

    rowClickHandler(item,row) {
      this.message.subject = item.subject;
      this.message.sentDate = item.sentDate;
      this.message.messageContent = item.messageContent;
      this.message.sender = 'From: My Childcare Services';
      row.select(true);
      this.updateMessagesLocally(item.messageId);
      this.updateMessagesDynamics(item.messageId);
      this.updateUnreadMessagesCount();
    },

    getStyle(item){
      if (item.lastOpenedTime) return 'read';
      else return 'unread';
    },

    goToHomePage() {
      this.$router.push(PATHS.home);
    },
    
  },

  components: { MessagesToolbar, Spinner }
};
</script>

<style>
  .read {
    font-weight: normal;
  }
  .unread {
    font-weight: bold;
  }
  tr:hover {
    cursor: pointer;
  }
  tr.v-data-table__selected {
    background: #c2e0fa !important;
  }
  .v-data-table-header th {
    white-space: nowrap;
  }
  .v-data-table__wrapper {
    margin-bottom: 0px;
  }
</style>