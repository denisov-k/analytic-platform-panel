<template>
  <at-ta :members="hints" :ats="initSymbols" ref="at">
    <textarea class="input" type="text"
         placeholder="Expression" :value="value"
         @blur="onInputUnfocused" @input="onChangeExpression">

    </textarea>
  </at-ta>
</template>

<script>
import AtTa from 'vue-at/dist/vue-at-textarea' // for textarea

export default {
  components: { AtTa },
  props: {
    hints: {
      type: Array,
      default: function () {
        return [];
      }
    },
    value: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {
      initSymbols: ['=', '"', '.', '+', '*', '/'],
    }
  },
  methods: {
    onChangeExpression: function (event) {
      this.$emit('update:value', event.target.value)
      this.$nextTick()
    },
    onInputUnfocused(event) {
      setTimeout(() => this.$refs.at.closePanel(), 500)
    }
  },
  created() {

  }
}
</script>
<style>
.expression-input {
  word-break: break-all;
  white-space: nowrap;
  overflow: hidden;
}
.expression-input:focus {
  overflow-y: auto;
  height: 100px !important;
  white-space: normal;
}

.atwho-wrap {
  height: 100%;
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