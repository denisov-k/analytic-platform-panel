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
          <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entity.appID.$error }"
                       v-model="$v.entity.appID.$model" :options="appIds" :custom-label="multiselectCustomLabel"
                       placeholder="Выберите приложение" @select="updateFields($v.entity.appID.$model)">
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
    <v-collapse-group :onlyOneActive="false">
      <v-collapse-wrapper class="uk-margin-small" :active="dimensionCollapseActive"
                          @onStatusChange="(data) => dimensionCollapseActive = data.status">
        <div>
                    <span class="icon">
                        <i class="mdi mdi mdi-chevron-up mdi-18px" v-if="dimensionCollapseActive"></i>
                        <i class="mdi mdi mdi-chevron-down mdi-18px" v-else></i>
                    </span>
          <vk-button type="text" v-collapse-toggle>Измерения ({{ entityDimensions.length }})</vk-button>
          <vk-button class="uk-margin-small-left" type="link">
            <div class="icon"><i class="mdi mdi-plus-circle-outline mdi-18px"></i></div>
          </vk-button>
          <vk-dropdown class="uk-border-rounded">
            <ul class="uk-nav uk-dropdown-nav">
              <li><a @click="onParamAddBtnClick(entity.dimensions, 'id')">
                <div class="icon uk-margin-small-right"><i class="mdi mdi-pound mdi-18px"></i></div>
                ID</a></li>
              <li><a @click="onParamAddBtnClick(entity.dimensions, 'expression')">
                <div class="icon uk-margin-small-right"><i class="mdi mdi-variable mdi-18px"></i></div>
                Expression</a></li>
            </ul>
          </vk-dropdown>
        </div>
        <div v-collapse-content>
          <vk-grid class="uk-flex-middle uk-margin-small-top" gutter="collapse"
                   v-for="(item, i) in $v.entity.dimensions.$each.$iter" :key="i">
            <div class="uk-width-expand">
              <input class="uk-input uk-form-small" :class="{ 'uk-form-danger': item.name.$error }" type="text"
                     placeholder="Название" v-model="item.name.$model">
            </div>
            <div class="uk-width-auto">
                            <span class="uk-margin-small-left uk-margin-small-right">
                                <div class="icon">
                                    <i class="mdi mdi-pound mdi-18px" v-if="item.type.$model == 'id'"></i>
                                    <i class="mdi mdi-variable mdi-18px" v-else></i>
                                </div>
                            </span>
            </div>
            <div class="uk-width-expand">
              <input class="uk-input uk-form-small" type="text" placeholder="ID" v-model="item.id.$model"
                     v-if="item.type.$model == 'id'">
              <expression-input :hints="fields" v-model="item.expression.$model" v-else></expression-input>

            </div>
            <div class="uk-width-auto">
              <vk-button class="uk-margin-small-left" type="link" @click="onParamDeleteBtnClick(entity.dimensions, i)">
                <div class="icon"><i class="mdi mdi-trash-can-outline mdi-18px"></i></div>
              </vk-button>
            </div>
          </vk-grid>
        </div>
      </v-collapse-wrapper>
    </v-collapse-group>
    <v-collapse-group :onlyOneActive="false">
      <v-collapse-wrapper class="uk-margin-small" :active="measureCollapseActive"
                          @onStatusChange="(data) => measureCollapseActive = data.status">
        <div>
                    <span class="icon">
                        <i class="mdi mdi mdi-chevron-up mdi-18px" v-if="measureCollapseActive"></i>
                        <i class="mdi mdi mdi-chevron-down mdi-18px" v-else></i>
                    </span>
          <vk-button type="text" v-collapse-toggle>Мера ({{ entityMeasures.length }})</vk-button>
          <vk-button class="uk-margin-small-left" type="link">
            <div class="icon"><i class="mdi mdi-plus-circle-outline mdi-18px"></i></div>
          </vk-button>
          <vk-dropdown class="uk-border-rounded">
            <ul class="uk-nav uk-dropdown-nav">
              <li><a @click="onParamAddBtnClick(entity.measures, 'id')">
                <div class="icon uk-margin-small-right"><i class="mdi mdi-pound mdi-18px"></i></div>
                ID</a></li>
              <li><a @click="onParamAddBtnClick(entity.measures, 'expression')">
                <div class="icon uk-margin-small-right"><i class="mdi mdi-variable mdi-18px"></i></div>
                Expression</a></li>
            </ul>
          </vk-dropdown>
        </div>
        <div v-collapse-content>
          <vk-grid class="uk-flex-middle uk-margin-small-top" gutter="collapse"
                   v-for="(item, i) in $v.entity.measures.$each.$iter" :key="i">
            <div class="uk-width-expand">
              <input class="uk-input uk-form-small" :class="{ 'uk-form-danger': item.name.$error }" type="text"
                     placeholder="Название" v-model="item.name.$model">
            </div>
            <div class="uk-width-auto">
                            <span class="uk-margin-small-left uk-margin-small-right">
                                <div class="icon">
                                    <i class="mdi mdi-pound mdi-18px" v-if="item.type.$model == 'id'"></i>
                                    <i class="mdi mdi-variable mdi-18px" v-else></i>
                                </div>
                            </span>
            </div>
            <div class="uk-width-expand">
              <input class="uk-input uk-form-small" type="text" placeholder="ID" v-model="item.id.$model"
                     v-if="item.type.$model == 'id'">
              <expression-input :hints="fields" v-model="item.expression.$model" v-else></expression-input>
            </div>
            <div class="uk-width-auto">
              <vk-button class="uk-margin-small-left" type="link" @click="onParamDeleteBtnClick(entity.measures, i)">
                <div class="icon"><i class="mdi mdi-trash-can-outline mdi-18px"></i></div>
              </vk-button>
            </div>
          </vk-grid>
        </div>
      </v-collapse-wrapper>
    </v-collapse-group>
    <!--<v-collapse-group :onlyOneActive="false">
        <v-collapse-wrapper class="uk-margin-small" :active="filterCollapseActive" @onStatusChange="(data) => filterCollapseActive = data.status">
            <div>
                <span class="icon">
                    <i class="mdi mdi mdi-chevron-up mdi-18px" v-if="filterCollapseActive"></i>
                    <i class="mdi mdi mdi-chevron-down mdi-18px" v-else></i>
                </span>
                <vk-button type="text" v-collapse-toggle>Фильтр  ({{ entityFilters.length }})</vk-button>
                <vk-button class="uk-margin-small-left" type="link">
                    <div class="icon"><i class="mdi mdi-plus-circle-outline mdi-18px"></i></div>
                </vk-button>
                <vk-dropdown class="uk-border-rounded" uk-dropdown>
                    <ul class="uk-nav uk-dropdown-nav">
                        <li><a @click="onParamAddBtnClick(entity.filters, 'id')"><div class="icon uk-margin-small-right"><i class="mdi mdi-pound mdi-18px"></i></div>ID</a></li>
                        <li><a @click="onParamAddBtnClick(entity.filters, 'expression')"><div class="icon uk-margin-small-right"><i class="mdi mdi-variable mdi-18px"></i></div>Expression</a></li>
                    </ul>
                </vk-dropdown>
            </div>
            <div v-collapse-content>
                <vk-grid class="uk-flex-middle uk-margin-small-top" gutter="collapse" v-for="(item, i) in $v.entity.filters.$each.$iter" :key="i">
                    <div class="uk-width-expand">
                        <input class="uk-input uk-form-small" :class="{ 'uk-form-danger': item.name.$error }" type="text" placeholder="Название" v-model="item.name.$model">
                    </div>
                    <div class="uk-width-auto">
                        <span class="uk-margin-small-left uk-margin-small-right">
                            <div class="icon">
                                <i class="mdi mdi-pound mdi-18px" v-if="item.type.$model == 'id'"></i>
                                <i class="mdi mdi-variable mdi-18px" v-else></i>
                            </div>
                        </span>
                    </div>
                    <div class="uk-width-expand">
                        <input class="uk-input uk-form-small" type="text" placeholder="ID" v-model="item.id.$model" v-if="item.type.$model == 'id'">
                        <expression-input  :hints="fields"  v-model="item.expression.$model" v-else></expression-input>
                    </div>
                    <div class="uk-width-auto">
                        <vk-button class="uk-margin-small-left" type="link" @click="onParamDeleteBtnClick(entity.filters, i)">
                            <div class="icon"><i class="mdi mdi-trash-can-outline mdi-18px"></i></div>
                        </vk-button>
                    </div>
                </vk-grid>
            </div>
        </v-collapse-wrapper>
    </v-collapse-group>-->

    <div class="uk-margin-small">
      <label>
                <span class="uk-checkbox-switch uk-margin-small-right">
                    <input type="checkbox" v-model="entity.suppressZero"><span></span>
                </span>
        <span class="uk-form-label">Схлопывать нули</span>
      </label>
    </div>
    <div class="uk-margin-small">
      <label>
                <span class="uk-checkbox-switch uk-margin-small-right">
                    <input type="checkbox" v-model="entity.sectionAccess"><span></span>
                </span>
        <span class="uk-form-label">Разграничение данных</span>
      </label>
    </div>
    <div class="uk-margin-small">
      <label>
                <span class="uk-checkbox-switch uk-margin-small-right">
                    <input type="checkbox" v-model="entity.anonymousAccess"><span></span>
                </span>
        <span class="uk-form-label">Анонимный доступ</span>
      </label>
    </div>
    <div class="uk-margin-small">
      <label>
                <span class="uk-checkbox-switch uk-margin-small-right">
                    <input type="checkbox" v-model="entity.enabled"><span></span>
                </span>
        <span class="uk-form-label">Доступ метода</span>
      </label>
    </div>
    <datalist id="fields">
      <option value="default" label="Default"></option>
    </datalist>
  </form>
</template>
<script>
import {required, numeric, minLength, minValue} from 'vuelidate/lib/validators';
import Multiselect from 'vue-multiselect';
import ExpressionInput from './ExpressionInput';
import EndpointsService from '../../services/EndpointsService';
import Service from '../../services/Service';
import _ from 'lodash';

let defaultEntity = EndpointsService.methodEntity;
let defaultDimensionEntity = EndpointsService.methodDimensionEntity;
let defaultFilterEntity = EndpointsService.methodFilterEntity;
let defaultMeasureEntity = EndpointsService.methodMeasureEntity;

export default {
  components: {Multiselect, ExpressionInput},
  data() {
    return {
      entity: defaultEntity(),
      dimensionCollapseActive: true,
      measureCollapseActive: true,
      filterCollapseActive: true,
      fields: []
    }
  },
  props: {
    appIds: {
      type: Array,
      default: function () {
        return [];
      }
    },
    appNames: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    entity: {
      handler(nValue, oValue) {
        if (nValue.appID === oValue.appID)
          return;
        const appID = nValue.appID;
        this.updateFields(appID);
      },
      deep: true
    },
  },
  validations: {
    entity: {
      path: {
        required,
        minLength: minLength(2)
      },
      appID: {
        required,
        minLength: minLength(1)
      },
      rowLimit: {
        required,
        numeric,
        minValue: minValue(0)
      },
      dimensions: {
        $each: {
          name: {
            required,
            minLength: minLength(2),
            isUniq: function (val) {
              let n = this.entity.dimensions.reduce((acc, elem) => {
                return (elem.name == val) ? acc + 1 : acc;
              }, 0);
              return n <= 1;
            }
          },
          expression: {},
          type: {},
          id: {},
        }
      },
      measures: {
        $each: {
          name: {
            required,
            minLength: minLength(2),
            isUniq: function (val) {
              let n = this.entity.measures.reduce((acc, elem) => {
                return (elem.name == val) ? acc + 1 : acc;
              }, 0);
              return n <= 1;
            }
          },
          expression: {},
          type: {},
          id: {},
        }
      },
      filters: {
        $each: {
          name: {
            required,
            minLength: minLength(2),
            isUniq: function (val) {
              let n = this.entity.filters.reduce((acc, elem) => {
                return (elem.name == val) ? acc + 1 : acc;
              }, 0);
              return n <= 1;
            }
          },
          expression: {},
          type: {},
          id: {},
        }
      }
    }
  },
  created() {
    this.transport = new Service().transport;
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
    updateFields(appID) {
      var self = this;

      (new EndpointsService).getFields(appID).then(data => {
        self.fields = data.map((item) => item.qName);
      })
    },
    onExpressionChange(value, item) {

      this.entity.item.expression = value;
    },
    multiselectCustomLabel(option) {
      return this.appNames[option];
    },
    reset() {
      this.entity = defaultEntity();
      this.uncollapseAll();
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
    uncollapseAll() {
      this.dimensionCollapseActive = true;
      this.measureCollapseActive = true;
      this.filterCollapseActive = true;
    },
    collapseAll() {
      this.dimensionCollapseActive = false;
      this.measureCollapseActive = false;
      this.filterCollapseActive = false;
    },
    onParamAddBtnClick: function (collection, type) {
      let paramEntity;
      if (collection == this.entity.dimensions) {
        paramEntity = defaultDimensionEntity();
      } else if (collection == this.entity.measures) {
        paramEntity = defaultMeasureEntity();
      } else if (collection == this.entity.filters) {
        paramEntity = defaultFilterEntity();
      }
      if (paramEntity) {
        paramEntity.type = type;
        collection.push(paramEntity);
      }
    },
    onParamDeleteBtnClick: function (collection, i) {
      collection.splice(i, 1);
    }
  }
}
</script>

<style scoped>
.v-collapse-content {

}
</style>