<template>
  <form>
    <div class="uk-margin-small">
      <label class="uk-form-label">Название</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.name.$error }"
                 type="text" placeholder="Название приложения" v-model="$v.entity.name.$model"/>
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <label class="uk-form-label">Источник</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entity.source.$error }" v-model="entity.source"
                        :options="sources" label="name" trackBy="id" @select="onSourceChange"
                       placeholder="Выберите источник">
            <template slot="noOptions">Список пуст</template>
            <template slot="noResult">Ничего не найдено</template>
          </multiselect>
        </div>
      </div>
    </div>
    <fields-list :fields="fields" :list.sync="entity.filters" caption="Фильтры"></fields-list>
    <fields-list :fields="variables" :list.sync="entity.variables" caption="Переменные"></fields-list>

    <datalist id="fields">
      <option value="default" label="Default"></option>
    </datalist>
  </form>
</template>
<script>
import validations from './validations';

import Multiselect from 'vue-multiselect';
import FieldsList from './FieldsList'
import VariablesList from './VariablesList'

import AppsService from '@/services/AppsService';

let defaultEntity = AppsService.app;

export default {
  components: { Multiselect, FieldsList, VariablesList },
  data() {
    return {
      entity: defaultEntity(),
      fields: [],
      variables: []
    }
  },
  props: {
    sources: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  watch: {
    entity: {
      handler(nValue) {
        this.onSourceChange(nValue.source)
      },
      deep: false,
    },
  },
  created() {
    this.service = new AppsService;
  },
  computed: {

  },
  methods: {
    updateFields(sourceId) {
      this.fields = [];

      this.service.getFields(sourceId).then(data => {
        this.fields = data.map((item) => item.qName);
      })
    },
    updateVariables(sourceId) {
      this.variables = [];

      this.service.getVariables(sourceId).then(data => {
        this.variables = data.map((item) => item.qName);
      })
    },
    reset() {
      this.entity = defaultEntity();
      this.validationReset();
    },
    validationTouch() {
      this.$v.$touch();
    },
    validationReset() {
      this.$v.$reset();
    },
    validationIsValid() {
      return !this.$v.$invalid;
    },
    onSourceChange(source) {
      this.updateFields(source.id);
      this.updateVariables(source.id);
    }
  },
  validations
}
</script>

<style scoped>

</style>