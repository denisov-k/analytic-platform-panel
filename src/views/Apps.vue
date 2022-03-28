<template>
  <div class="views--apps">
    <section class="uk-section uk-padding">
        <apps-table></apps-table>
    </section>
  </div>
</template>
<script>
import AppsTable from "@/components/Apps/AppsTable";

export default {
  name: "AppsTable",
  components: {
    AppsTable
  }
}
</script>

<style scoped>

</style>