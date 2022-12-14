<template>
  <v-dialog v-model="dialog" :content-class="contentClass" :max-width="options.width" :style="{ zIndex: options.zIndex }" @keydown.esc="cancel">
    <v-card>
      <slot name="title" :cancel="cancel">
        <v-toolbar :dark="options.dark" :color="options.color" :dense="options.dense" flat>
            <v-toolbar-title :class="{'white--text': options.dark, 'align-self-end': options.closeIcon, 'font-weight-bold': options.titleBold, 'dialog-subtitle':  options.subtitle}">
              {{ title }}
            </v-toolbar-title>
          <v-spacer/>
          <v-btn id="closeBtn" v-if="options.closeIcon" text icon @click.native="cancel">
            <v-icon color="#38598A">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </slot>
      <v-card-text :class="[options.messagePadding, { 'black--text': !options.dark }]">
        {{ message }}
        <slot name="message"></slot>
        <v-divider v-if="options.divider" class="mt-1"/>              
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <PrimaryButton id="rejectBtn" secondary :text="options.rejectText || 'Cancel'" @click.native="cancel"></PrimaryButton>
        <PrimaryButton id="resolveBtn" :text="options.resolveText || 'Yes'" :disabled="options.resolveDisabled" @click.native="agree"></PrimaryButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PrimaryButton from './PrimaryButton';
export default {
  name: 'ConfirmationDialog',
  components: {PrimaryButton},
  props: {
    contentClass: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200,
      dark: true,
      dense: true,
      closeIcon: false,
      messagePadding: 'pa-4',
      titleBold: false,
      subtitle: false,
      divider: false,
      resolveDisabled: false,
    }
  }),
  methods: {
    open(title, message, options) {
      this.dialog = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    cancel() {
      this.resolve(false);
      this.dialog = false;
    }
  }
};
</script>

<style scoped>
  .dialog-subtitle {
    font-size: 1rem;
  }
</style>
