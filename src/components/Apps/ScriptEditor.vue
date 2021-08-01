<template>
  <div class="script-editor">
    <textarea class="script-area" v-model="script"></textarea>
  </div>
</template>

<script>
import AppsService from '@/services/AppsService';

export default {
  name: "ScriptEditor",
  props: {
    app: Object
  },
  data() {
    return {
      script: ""
    }
  },
  mounted() {
    this.service = new AppsService();
  },
  watch: {
    app(oldValue, newValue) {
      this.service.getScript(this.app.id).then(script => {
        this.script = script;
      })
    }
  }
}
</script>

<style scoped>
  .script-editor {
    height: 400px;
  }
  .script-area {
    width: 100%;
    height: 100%;
  }
</style>