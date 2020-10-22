<template>
  <div class="views--api-methods">
    <section class="uk-section uk-padding">
      <EndpointsTable></EndpointsTable>
    </section>
  </div>
</template>
<script>

import EndpointsTable from "@/components/Endpoints/EndpointsTable";

export default {
  name: "Users",
  components: {
    EndpointsTable
  }
}
</script>
<style scoped>

</style>