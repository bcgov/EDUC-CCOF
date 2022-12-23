<template>
  <v-container fluid style="padding:0">

    <!-- <v-toolbar 
      dark
      color="#006699"
      dense
      style="padding-top:0%; box-shadow: none"
    >
      <v-container>
        <v-badge
            color="red"
            content="100+"
            bottom
            right
            overlap
            class="float-right"
          >
            <v-icon aria-hidden="false" size="30" @click="messageScreen()">
                mdi-email-outline
          </v-icon>
          </v-badge>
        
      </v-container>  
    </v-toolbar> -->

    <v-toolbar 
      dense
      color="yellow lighten-4"
      justify="center"
      v-if="isActionRequiredMessageDisplayed"
    >
      <v-toolbar-title class="flex text-center" style="color: black">
        <h3>Action Required: New Messages</h3>
      </v-toolbar-title >
    </v-toolbar> 

    <v-toolbar 
      color="#B3E5FF"
      justify="center"
      dense
      v-if="isBroadcastingMessageDisplayed"
    >
      <v-toolbar-title class="flex text-center overflow-auto" style="color:black">
        <h4 class="text-center">
          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE.

          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE. 


          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE.


          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE.


          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE. 


          This is a Broadcasting message will only appear if broadcast status from Dynamics is TRUE. 
        </h4>
          
      </v-toolbar-title>
    </v-toolbar>

  </v-container>
</template>

<script>
import { PATHS } from '@/utils/constants';

export default {
  name: 'MessagesToolbar',
  props: {
    isActionRequiredMessageDisplayed: {
      type: Boolean,
      default: false
    },
    isBroadcastingMessageDisplayed: {
      type: Boolean,
      default: false
    },
    broadcastingMessage: String
  },
  methods: {
    messageScreen() {
      this.$router.push(PATHS.messagesPage);
    }
  }
};
</script>
