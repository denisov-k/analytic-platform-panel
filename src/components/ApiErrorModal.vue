<template>
  <vk-modal center :overflow-auto="false" size="large" :show.sync="showModal" v-if="show">
    <vk-modal-close @click="showModal = false"></vk-modal-close>
    <vk-modal-title slot="header">Ошибка api</vk-modal-title>
    <div class="uk-margin-bottom">
      <code class="uk-margin-remove">{{ error }}</code>
      <p class="uk-margin-remove uk-text-small uk-text-muted">Откройте консоль разработчика (f12)</p>
    </div>
  </vk-modal>
</template>
<script>
export default {
  data() {
    return {
      showModal: false,
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    error: null
  },
  watch: {
    'show': function (newVal, oldVal) {
      this.showModal = newVal;
    }
  }
}
</script>