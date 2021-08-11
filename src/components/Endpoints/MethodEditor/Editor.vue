<template>
  <form>
    <div class="uk-margin-small">
      <label class="uk-form-label">Путь</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.path.$error }"
                 type="text" placeholder="Путь метода" v-model="$v.entity.path.$model"/>
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <label class="uk-form-label">Приложение</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entity.app.$error }" v-model="entity.app"
                        :options="apps" label="name" trackBy="id"
                       placeholder="Выберите приложение">
            <template slot="noOptions">Список пуст</template>
            <template slot="noResult">Ничего не найдено</template>
          </multiselect>
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <label class="uk-form-label">Макс. кол-во записей</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.rowLimit.$error }" type="number" placeholder=""
                 v-model="$v.entity.rowLimit.$model">
        </div>
      </div>
    </div>
    <fields-list :fields="fields" :list.sync="entity.dimensions" caption="Измерения"></fields-list>
    <fields-list :fields="fields" :list.sync="entity.measures" caption="Меры"></fields-list>
    <fields-list :fields="fields" :list.sync="entity.filters" caption="Фильтры"></fields-list>
    <variables-list :variables="variables" :list.sync="entity.variables" caption="Переменные"></variables-list>

    <method-option :value.sync="entity.suppressZero" label="Схлопывать нули"></method-option>
    <method-option :value.sync="entity.sectionAccess" label="Разграничение данных"></method-option>
    <method-option :value.sync="entity.anonymousAccess" label="Анонимный доступ"></method-option>
    <method-option :value.sync="entity.enabled" label="Доступ метода"></method-option>

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
import MethodOption from './MethodOption';

import EndpointsService from '@/services/EndpointsService';

let defaultEntity = EndpointsService.methodEntity;
let defaultDimensionEntity = EndpointsService.methodDimensionEntity;
let defaultFilterEntity = EndpointsService.methodFilterEntity;
let defaultMeasureEntity = EndpointsService.methodMeasureEntity;

export default {
  components: { Multiselect, MethodOption, FieldsList, VariablesList },
  data() {
    return {
      selectedApp: {},
      entity: defaultEntity(),
      dimensionCollapseActive: true,
      measureCollapseActive: true,
      filterCollapseActive: true,
      fields: [],
      variables: []
    }
  },
  props: {
    apps: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  watch: {
    entity: {
      handler(nValue, oValue) {
        console.log(nValue.app, oValue.app)
        if (nValue.app.id === oValue.app.id)
          return;

        this.updateFields(nValue.app.id);
        this.updateVariables(nValue.app.id);
      },
      deep: true
    },
  },
  created() {
    this.service = new EndpointsService;
  },
  computed: {
    entityMeasures: function () {
      return this.entity.measures.filter((elem) => elem != null);
    },
    entityDimensions: function () {
      return this.entity.dimensions.filter((elem) => elem != null);
    },
    entityFilters: function () {
      return this.entity.filters.filter((elem) => elem != null);
    },
  },
  methods: {
    updateFields(appId) {
      if (appId)
        this.service.getFields(appId).then(data => {
          this.fields = data.map((item) => item.qName);
        })
      else
        this.fields = [];
    },
    updateVariables(appId) {
      if (appId)
        this.service.getVariables(appId).then(data => {
          this.variables = data.map((item) => item.qName);
        })
      else
        this.variables = [];
    },
    reset() {
      this.entity = defaultEntity();
      // this.uncollapseAll();
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
    /*uncollapseAll() {
      this.dimensionCollapseActive = true;
      this.measureCollapseActive = true;
      this.filterCollapseActive = true;
    },
    collapseAll() {
      this.dimensionCollapseActive = false;
      this.measureCollapseActive = false;
      this.filterCollapseActive = false;
    },*/
  },
  validations
}
</script>

<style scoped>
.v-collapse-content {

}
</style>