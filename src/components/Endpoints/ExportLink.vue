<template>
  <div>
    <a :href="url" target="_blank" rel="noopener">{{ title }}</a>
    <button class="uk-button uk-button-none">
      <div class="icon"><i class="mdi mdi-export"></i></div>
    </button>
    <vk-dropdown class="uk-border-rounded">
      <ul class="uk-nav uk-dropdown-nav">
        <li v-for="format in exportFormats" :key="format.param">
          <a :href="url + '?format=' + format.param">{{ format.title }}</a>
        </li>
      </ul>
    </vk-dropdown>
  </div>
</template>

<script>
export default {
  name: "ExportButton",
  data() {
    return {
      exportFormats: [
        {title: 'CSV формат', param: 'csv'},
        {title: 'Qlik формат', param: 'qlik'},
      ]
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
  }
}
</script>

<style scoped>

</style>