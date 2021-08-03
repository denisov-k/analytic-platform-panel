<template>
  <at-ta :members="hints" :ats="initSymbols" ref="at">
    <div class="expression-input uk-input uk-form-small" type="text"
         placeholder="Expression"
         contenteditable v-click-outside="onInputUnfocused" @blur="onChangeExpression">
      <div v-text="value"></div>
    </div>
  </at-ta>
</template>

<script>
import AtTa  from 'vue-at'

export default {
  components: {AtTa },
  props: {
    hints: {
      type: Array,
      default: function () {
        return [];
      }
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      html: '',
      initSymbols: ['=', '"', '.', '+', '*', '/'],
    }
  },
  methods: {
    onChangeExpression: function (event) {
      this.$emit('input', event.target.innerText)
    },
    onInputUnfocused(event) {
      this.$refs.at.closePanel()
    }
  },
  created() {

  }
}
</script>
<style>
.expression-input {
  overflow-x: auto;
  overflow-y: hidden;
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
}

.expression-input:focus {
  height: 100px !important;
  white-space: normal !important;
  line-height: 20px;
  padding: 5px;
}

.atwho-wrap {
  position: inherit;
}

.atwho-panel {
  position: unset;
  /*display: contents;*/
}

.atwho-inner {
  position: absolute;
  margin-top: 30px;
  z-index: 10;
}

.atwho-view {
  position: unset;
  max-width: 230px;
}

.atwho-ul {
  font-size: 14px;
}
</style>