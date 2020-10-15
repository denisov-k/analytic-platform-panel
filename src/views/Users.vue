<template>
    <div class="views--users">
      <section class="uk-section uk-padding">
        <UsersTable></UsersTable>
      </section>
    </div>
</template>
<script>

import UsersTable from "@/components/Users/UsersTable";

export default {
    name: "Users",
    components: {
      UsersTable
    }
}
</script>
<style scoped>

</style>