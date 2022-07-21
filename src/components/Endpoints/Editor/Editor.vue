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
                        :options="apps" label="name" trackBy="id" @select="onAppChange"
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
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.rowLimit.$error }" type="number" min="-1"
                 v-model="$v.entity.rowLimit.$model">
        </div>
      </div>
    </div>
    <fields-list :fields="fields" :list.sync="entity.dimensions" caption="Измерения"></fields-list>
    <fields-list :fields="fields" :list.sync="entity.measures" caption="Меры"></fields-list>

    <Option :value.sync="entity.suppressZero" label="Схлопывать нули"></Option>
    <Option :value.sync="entity.sectionAccess" label="Разграничение данных"></Option>
    <Option :value.sync="entity.anonymousAccess" label="Анонимный доступ"></Option>
    <Option :value.sync="entity.enabled" label="Доступ метода"></Option>

    <datalist id="fields">
      <option value="default" label="Default"></option>
    </datalist>
  </form>
</template>
<script>
import validations from './validations';

import Multiselect from 'vue-multiselect';
import FieldsList from './FieldsList'
import Option from './Option';

import EndpointsService from '@/services/EndpointsService';
import AppsService from '@/services/AppsService';

let defaultEntity = EndpointsService.endpoint;

export default {
  components: { Multiselect, Option, FieldsList },
  data() {
    return {
      entity: defaultEntity(),
      fields: []
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
      handler(nValue) {
        this.onAppChange(nValue.app)
      },
      deep: false,
    },
  },
  created() {
    this.endpointsService = new EndpointsService;
    this.appsService = new AppsService;
  },
  computed: {

  },
  methods: {
    updateFields(sourceId) {
      this.fields = [];

      if (!sourceId)
        return;

      this.appsService.getFields(sourceId).then(data => {
        this.fields = data.map((item) => item.qName);
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
    onAppChange(app) {
      this.updateFields(app.sourceId);
    }
  },
  validations
}
</script>

<style scoped>

</style>