<template>
  <div>{{ script }}</div>
</template>

<script>
import AppsService from '../services/AppsService';

export default {
  name: "ScriptEditor",
  data() {
    return {
      script: ""
    }
  },
  mounted() {
    let appId = this.$route.query.appId;

    this.service = new AppsService();

    this.service.getScript(appId).then(script => {
      this.script = script;
    })
  }
}
</script>

<style scoped>

</style>