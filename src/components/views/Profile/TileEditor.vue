<template>
    <form>
        <div class="uk-margin-small">
            <label class="uk-form-label">Приложение</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entityApp.$error }" @select="onAppSelect" v-model="$v.entityApp.$model" :options="apps" label="name" placeholder="Выберите приложение">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Категория тайла</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entityCategory.$error }" @select="onCategorySelect" v-model="$v.entityCategory.$model" :options="categories" label="name" placeholder="Выберите категорию">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Тип тайла</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entity.type.$error }" @select="onTypeSelect" v-model="$v.entity.type.$model" :options="types" placeholder="Выберите тип тайла">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>                       
        <div class="uk-margin-small">
            <label class="uk-form-label">Метрика</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entityMetric.$error }" @select="onMetricSelect" v-model="$v.entityMetric.$model" :options="metrics" label="name" placeholder="Выберите метрику">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Представление</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entityMetricView.$error }" @select="onViewSelect" v-model="$v.entityMetricView.$model" :options="metricViews" label="name"  placeholder="Выберите представление">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Размеры тайла (Ш &times; В)</label>
            <div class="uk-form-controls">
                <vk-grid gutter="collapse">
                    <div class="uk-width-expand">
                        <div class="uk-inline uk-display-block">
                            <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.width.$error }" type="number" min="1" :max="tileMaxWidth" step="1" placeholder="Ширина" v-model="$v.entity.width.$model">
                        </div>
                    </div>
                    <div class="uk-width-auto uk-flex uk-flex-middle">
                        <div class="uk-margin-small-left uk-margin-small-right">
                            <div class="icon"><i class="mdi mdi-close"></i></div>
                        </div>                        
                    </div>
                    <div class="uk-width-expand">
                        <div class="uk-inline uk-display-block">
                            <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.height.$error }" type="number" min="1" :max="tileMaxHeight" step="1" placeholder="Высота" v-model="$v.entity.height.$model">
                        </div>
                    </div>
                </vk-grid>                
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Позиция тайла</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input uk-width-1-2" :class="{ 'uk-form-danger': $v.entity.kpi_place.$error }" type="number" min="0" step="1" v-model="$v.entity.kpi_place.$model">
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <div class="uk-form-controls">
                <label>
                    <span class="uk-checkbox-switch uk-margin-small-right">
                        <input type="checkbox" v-model="$v.entity.suppressNulls.$model"><span></span>
                    </span>                                
                    <span>исключать нули</span>
                </label>
            </div>
        </div>
        <div class="uk-margin-small" style="display:none">
            <div class="uk-form-controls">
                <label>
                    <span class="uk-checkbox-switch uk-margin-small-right">
                        <input type="checkbox" v-model="$v.entity.enabled.$model"><span></span>
                    </span>                                
                    <span>тайл активен</span>
                </label>
            </div>
        </div>
    </form>
</template>
<script>
import { required, integer, minValue, maxValue } from 'vuelidate/lib/validators';
import TilesService from './../../../services/TilesService';
import Multiselect from 'vue-multiselect';
import _ from 'lodash';

let defaultEntity = TilesService.tileEntity();
let tileMaxWidth = 8;
let tileMaxHeight = 8;

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            metricViews: [],
            entity: defaultEntity,
            entityApp: null,
            entityMetric: null,
            entityMetricView: null,
            entityCategory: null,
            types: TilesService.tileTypes(),
            tileMaxWidth: tileMaxWidth,
            tileMaxHeight: tileMaxHeight,
        }
    },
    props: {
        apps: {
            type: Array,
            required
        },
        categories: {
            type: Array,
            default: [],
        },
        metrics: {
            type: Array,
            default: [],
        }  
    },
    watch: {
        'entity': function(newVal) {
            this.entityApp = this.apps.find((elem) => elem.id == newVal.app_id);
            this.entityMetric = this.metrics.find((elem) => elem.id == newVal.metric_id);
            this.entityCategory = this.categories.find((elem) => elem._id == newVal.category_id);
            if(this.entityMetric) {
                this.metricViews = _.cloneDeep(this.entityMetric.views);
            }else{
                this.metricViews = [];
            }
            this.entityMetricView = this.metricViews.find((elem) => elem._id == newVal.metric_view_id);
        },
    },
    validations: {
        entityApp: {
            required
        }, 
        entityCategory: {
            required
        }, 
        entityMetric: {
            required
        }, 
        entityMetricView: {}, 
        entity: {
            type: {
                required
            },
            metric_id: {
                required
            }, 
            kpi_place: {
                required,
                integer,
                minValue: minValue(0)
            },
            width: {
                required,
                integer,
                minValue: minValue(1),
                maxValue: maxValue(tileMaxWidth),
            },
            height: {
                required,
                integer,
                minValue: minValue(1),
                maxValue: maxValue(tileMaxHeight),
            },
            metric_view_id: {},
            suppressNulls: {},
            enabled: {}
        }
    },
    methods: {        
        reset() {
            this.entity = _.cloneDeep(defaultEntity);
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
        onAppSelect: function(selectedOption) {
            this.entity.app_id = selectedOption.id;
        },
        onTypeSelect: function(selectedOption) {
            this.entity.type = selectedOption;
        },
        onCategorySelect: function(selectedOption) {
            this.entity.category_id = selectedOption._id;
        },
        onMetricSelect: function(selectedOption) {
            this.entity.metric_id = selectedOption.id;
            this.metricViews = _.cloneDeep(selectedOption.views);
        },
        onViewSelect: function(selectedOption) {
            this.entity.metric_view_id = selectedOption._id;
        },
    }
}
</script>
