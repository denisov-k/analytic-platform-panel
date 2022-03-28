<template>
  <div class="uk-form-controls">
    <div class="uk-inline uk-display-block">
      <multiselect class="groups-select" :class="{ 'uk-form-danger': $v.entity.groups.$error }"
                   v-model="$v.entity.groups.$model" :multiple="true"
                   :options="groups" placeholder="Выберите группы" label="name" :searchable="true" track-by="_id" :closeOnSelect=false>
        <template slot="option" slot-scope="props"><span class="group-item">{{ props.option.name }}</span></template>
        <template slot="noOptions">Список пуст</template>
        <template slot="noResult">Ничего не найдено</template>
      </multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  name: "AppsList",
  components: {
    Multiselect
  },
}
</script>

<style scoped>

</style>