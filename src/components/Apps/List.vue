<template>
  <div class="apps-list">
    <div class="uk-overflow-auto" v-if="apps.length">
      <table class="uk-table uk-table-hover uk-table-divider">
        <thead>
        <tr>
          <th class="uk-width-1-3">
            <span class="uk-link" @click="toggleSort('name')">Название<div class="icon">
              <i class="mdi"
                 :class="{ 'mdi-chevron-up': entitiesSort['name'] === 'asc', 'mdi-chevron-down': entitiesSort['name'] === 'desc', 'mdi-sort-variant': entitiesSort['name'] == null }"></i>
            </div></span>
          </th>
          <th>
            <span class="uk-link" @click="toggleSort('stream')">Stream<div class="icon">
              <i class="mdi"
                 :class="{ 'mdi-chevron-up': entitiesSort['stream'] === 'asc', 'mdi-chevron-down': entitiesSort['stream'] === 'desc', 'mdi-sort-variant': entitiesSort['stream'] == null }"></i>
            </div></span>
          </th>
          <th class="uk-width-1-3">ID</th>
          <th class="uk-table-shrink uk-text-nowrap">Время перезагрузки</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in apps" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.stream }}</td>
          <td>{{ item.id }}</td>
          <td class="uk-text-nowrap">{{ item.lastReloadTime }}</td>
          <td>
            <button class="uk-button uk-button-none">
              <div class="icon"><i class="mdi mdi-dots-vertical"></i></div>
            </button>
            <vk-dropdown class="uk-border-rounded" v-if="true/*!isActionConfirmShow()*/">
              <ul class="uk-nav uk-dropdown-nav">
                <li v-for="(action, ind) in actions" :key="ind"><a @click="action.func.call(null, item)">{{ action.label }}</a></li>
              </ul>
            </vk-dropdown>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-text-muted" v-else>Нет записей</div>
  </div>
</template>

<script>
const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

export default {
  name: "List",
  props: {
    apps: {
      type: Array,
      required: true
    },
    actions: Array
  },
  data() {
    return {
      entitiesSort: {},
    }
  },
  methods: {
    toggleSort: function (field) {
      let s = this.entitiesSort[field];
      s = (s == null) ? SORT_ASC : s;
      this.entities.sort((a, b) => {
        let ac = String(a[field]) || '';
        let bc = String(b[field]) || '';
        let n = ac.localeCompare(bc);
        return (s == SORT_ASC) ? n : n * -1;
      });
      this.$set(this.entitiesSort, field, (s == SORT_ASC) ? SORT_DESC : SORT_ASC);
    },
  }
}
</script>

<style scoped>

</style>