<template>
  <div :class="alertClass" role="alert" :aria-labelledby="type" :aria-describedby="`${type}-desc`">
    <p :id="`${type}-desc`"><slot></slot></p>
  </div>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    type: {
      type: String,
      required: true,
      default: '',
    },
  },
  computed: {
    alertClass() {
      return `bc-gov-alertbanner bc-gov-alertbanner-${this.type}`;
    },
  },
};
</script>
<style scoped>
.bc-gov-alertbanner {
  border: 1px solid transparent;
  border-radius: 4px;
  font-weight: 700;
  margin-bottom: 20px;
  padding: 15px;
}

.bc-gov-alertbanner:before {
  float: left;
  font-family: 'Font Awesome 5 Free';
  font-size: larger;
  font-style: normal;
  line-height: 1;
  margin-right: 10px;
  position: relative;
  top: 3px;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

.bc-gov-alertbanner p {
  font-size: 18px;
  margin: 0;
  padding-left: 35px;
}

.bc-gov-alertbanner-error {
  background-color: #f2dede;
  border-color: #ebccd1;
  color: #a12622;
}

.bc-gov-alertbanner-error:before {
  content: '\f06a';
}

.bc-gov-alertbanner-error a {
  color: #843534;
}

.bc-gov-alertbanner-warning {
  background-color: #f9f1c6;
  border-color: #faebcc;
  color: #6c4a00;
}

.bc-gov-alertbanner-warning:before {
  content: '\f071';
}

.bc-gov-alertbanner-warning a {
  color: #66512c;
}

.bc-gov-alertbanner-info {
  background-color: #d9eaf7;
}

.bc-gov-alertbanner-info:before {
  content: '\f05a';
}

.bc-gov-alertbanner-info a {
  color: #1a5a96;
}

.bc-gov-alertbanner-success {
  background-color: #dff0d8;
  border-color: #d6e9c6;
  color: #2d4821;
}

.bc-gov-alertbanner-success:before {
  content: '\f058';
}

.bc-gov-alertbanner-success a {
  color: #2b542c;
}
</style>
