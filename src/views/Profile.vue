<template>
    <div class="views--profile">
        <section class="uk-section uk-padding">
            <div class="uk-margin-bottom">
                <div class="uk-float-right" v-if="parentTileId == null">
                    <div class="page-selector uk-flex-inline uk-text-middle uk-margin-right">
                        <a :class="{ active: page == pageProfile }" @click="page = pageProfile">Профиль</a>
                        <a :class="{ active: page == pageAvg }" @click="page = pageAvg">Среднее</a>
                    </div>
                    <vk-button class="uk-text-white" @click="onCategoryAddClick">Создать категорию</vk-button>
                </div>
                <h2 class="uk-margin-remove uk-text-white">{{ $route.meta.viewTitle }}<vk-spinner class="uk-margin-left uk-text-white" v-if="loading"></vk-spinner></h2>
                <p class="uk-text-muted uk-margin-remove">{{ $route.meta.viewDescription }}</p>        
            </div>

            <vk-card class="uk-margin-small-bottom" padding="small" v-if="parentTileId != null">
                <div class="uk-margin-bottom uk-clearfix">
                    <div class="uk-float-left">
                        <vk-button type="text" @click="hideChildrenTiles">
                            <span class="uk-h4 uk-margin-remove">Все тайлы</span>
                        </vk-button>
                        <span class="icon uk-text-bottom"><i class="mdi mdi-chevron-right mdi-18px"></i></span>
                        <span class="uk-h4 uk-margin-remove uk-text-bottom ">{{ getTileMetricName(parentTileId) }}</span>
                        <span class="icon uk-text-bottom"><i class="mdi mdi-chevron-right mdi-18px"></i></span>
                        <span class="uk-h4 uk-margin-remove uk-text-bottom">дочерние тайлы</span>
                    </div>
                    <vk-button class="uk-float-right" type="primary" size="small" @click="onChildrenTilesAddTileClick(parentTileId)">Добавить тайл</vk-button>
                </div>
                <div class="tiles-grid" v-if="childrenTiles.length">
                        
                    <tile-item v-for="tile of childrenTiles" :key="tile.id" :tile="tile" :tile-name="getMetricProp(tile.metric_id, 'name')" :tile-hint="getMetricProp(tile.metric_id, 'hint')" :css="getTileCss(tile)">
                        <div class="uk-float-right" slot="controls">                       
                            <button class="uk-button uk-button-none" @mouseover="dropdownShowTileId = tile.id"><div class="icon"><i class="mdi mdi-dots-vertical"></i></div></button>
                            <vk-dropdown class="uk-border-rounded" v-if="dropdownShowTileId == tile.id && !isCategoryEditorShow && !isCategoryDeleteConfirmShow && !isTileEditorShow && !isTileDeleteConfirmShow">
                                <ul class="uk-nav uk-dropdown-nav">
                                    <li><a @click="onTileEditClick(tile)">Изменить</a></li>
                                    <li><a @click="onTileDeleteClick(tile)">Удалить</a></li>
                                </ul>
                            </vk-dropdown>
                        </div>
                    </tile-item>

                </div>
                <div class="uk-text-muted" v-else>Нет дочерних тайлов</div>
            </vk-card>
            
            <div v-show="parentTileId == null">
                <vk-card class="uk-margin-small-bottom" v-for="category in categories" :key="category._id" padding="small">
                    <div>
                        <div class="uk-float-right">                       
                            <button class="uk-button uk-button-none" @mouseover="dropdownShowCategoryId = category._id"><div class="icon"><i class="mdi mdi-dots-vertical"></i></div></button>
                            <vk-dropdown class="uk-border-rounded" v-if="dropdownShowCategoryId == category._id && !isCategoryEditorShow && !isCategoryDeleteConfirmShow && !isTileEditorShow && !isTileDeleteConfirmShow">
                                <ul class="uk-nav uk-dropdown-nav">
                                    <li><a @click="onCategoryAddTileClick(category)">Добавить тайл</a></li>
                                    <li><a @click="onCategoryEditClick(category)">Изменить</a></li>
                                    <li><a @click="onCategoryDeleteClick(category)">Удалить</a></li>
                                </ul>
                            </vk-dropdown>
                        </div>
                        <div class="icon uk-margin-small-right">
                            <i class="mdi mdi mdi-chevron-down mdi-18px" v-if="!categoriesCollapsedStatus[ category._id ]"></i>
                            <i class="mdi mdi mdi-chevron-up mdi-18px" v-else></i>
                        </div>
                        <vk-button type="text" @click="toggleCategoryCollapse(category)">
                            <span class="uk-h4">{{ category.name }}</span>
                        </vk-button>
                    </div>
                    <div class="uk-margin-top" v-if="categoriesCollapsedStatus[ category._id ]">
                        <div class="tiles-grid" v-if="getCategoryTiles(category._id).length">
                            
                            <tile-item v-for="tile of getCategoryTiles(category._id)" :key="tile.id" :tile="tile" :tile-name="getMetricProp(tile.metric_id, 'name')" :tile-hint="getMetricProp(tile.metric_id, 'hint')" :css="getTileCss(tile)">
                                <div class="uk-float-right" slot="controls">                       
                                    <button class="uk-button uk-button-none" @mouseover="dropdownShowTileId = tile.id"><div class="icon"><i class="mdi mdi-dots-vertical"></i></div></button>
                                    <vk-dropdown class="uk-border-rounded" v-if="dropdownShowTileId == tile.id && !isCategoryEditorShow && !isCategoryDeleteConfirmShow && !isTileEditorShow && !isTileDeleteConfirmShow">
                                        <ul class="uk-nav uk-dropdown-nav">
                                            <li><a @click="onTileChildrenClick(tile)">Дочерние тайлы <span v-if="tile.children.length">({{tile.children.length}})</span></a></li>
                                            <li><a @click="onTileEditClick(tile)">Изменить</a></li>
                                            <li><a @click="onTileDeleteClick(tile)">Удалить</a></li>
                                        </ul>
                                    </vk-dropdown>
                                </div>
                            </tile-item>

                        </div>
                        <div class="uk-text-muted" v-else>Нет тайлов</div>
                    </div>
                </vk-card>
            </div>

            <api-error-modal :show="isApiErrorShow" :error="apiError"></api-error-modal>

            <vk-modal center :overflow-auto="false" size="large" :show.sync="isCategoryDeleteConfirmShow">
                <vk-modal-close @click="isCategoryDeleteConfirmShow = false"></vk-modal-close>
                <vk-modal-title slot="header">Удаление категории</vk-modal-title>
                <p>Вы уверены, что хотите удалить категорию <b>{{ getCategoryName(deleteCategoryId) }}</b>?</p>
                <div class="uk-text-right" slot="footer">
                    <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
                    <vk-button class="uk-margin-right" @click="isCategoryDeleteConfirmShow = false">Отмена</vk-button>
                    <vk-button type="primary" @click="onCategoryDeleteConfirmSubmitClick">Удалить</vk-button>
                </div>
            </vk-modal>

            <vk-modal center :overflow-auto="false" size="large" :show.sync="isTileDeleteConfirmShow">
                <vk-modal-close @click="isTileDeleteConfirmShow = false"></vk-modal-close>
                <vk-modal-title slot="header">Удаление тайла</vk-modal-title>
                <p>Вы уверены, что хотите удалить тайл <b>{{ getTileMetricName(deleteTileId) }}</b>?</p>
                <div class="uk-text-right" slot="footer">
                    <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
                    <vk-button class="uk-margin-right" @click="isTileDeleteConfirmShow = false">Отмена</vk-button>
                    <vk-button type="primary" @click="onTileDeleteConfirmSubmitClick">Удалить</vk-button>
                </div>
            </vk-modal>

            <vk-modal center :overflow-auto="false" size="large" :show.sync="isCategoryEditorShow">
                <vk-modal-close @click="isCategoryEditorShow = false"></vk-modal-close>
                <vk-modal-title slot="header">Редактор категории</vk-modal-title>
                <category-editor ref="categoryEditor" :categories="categories"></category-editor>
                <div class="uk-text-right" slot="footer">
                    <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
                    <vk-button class="uk-margin-right" @click="isCategoryEditorShow = false">Отмена</vk-button>
                    <vk-button type="primary" @click="onCategoryEditorSubmitClick">Сохранить</vk-button>
                </div>
            </vk-modal>

            <vk-modal center :overflow-auto="false" size="large" :show.sync="isTileEditorShow">
                <vk-modal-close @click="isTileEditorShow = false"></vk-modal-close>
                <vk-modal-title slot="header">Редактор тайла</vk-modal-title>
                <tile-editor ref="tileEditor" :apps="apps" :categories="categories" :metrics="metrics"></tile-editor>
                <div class="uk-text-right" slot="footer">
                    <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
                    <vk-button class="uk-margin-right" @click="isTileEditorShow = false">Отмена</vk-button>
                    <vk-button type="primary" @click="onTileEditorSubmitClick">Сохранить</vk-button>
                </div>
            </vk-modal>

        </section>
    </div>
</template>
<script>
import ApiErrorModal from './../components/shared/ApiErrorModal';
import TileItem from './../components/views/Profile/TileItem';
import AppsService from './../services/AppsService'; 
import TilesService from './../services/TilesService';
import TileCategoriesService from './../services/TileCategoriesService';
import MetricsService from './../services/MetricsService';
import CategoryEditor from './../components/views/Profile/CategoryEditor';
import TileEditor from './../components/views/Profile/TileEditor';
import draggable from 'vuedraggable';
import _ from 'lodash';

export default {
    components: { 
        TileItem,
        ApiErrorModal,
        CategoryEditor,
        TileEditor,
        draggable
    },
    props: {
        profileType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            apiError: '',
            isApiErrorShow: false,
            page: TilesService.TILE_PAGE_PROFILE,
            pageAvg: TilesService.TILE_PAGE_AVG,
            pageProfile: TilesService.TILE_PAGE_PROFILE,
            metrics: [],
            tiles: [],
            apps: [],
            categories: [],
            categoriesCollapsedStatus: {},
            dropdownShowTileId: null,
            dropdownShowCategoryId: null,
            isCategoryEditorShow: false,
            isCategoryDeleteConfirmShow: false,
            isTileEditorShow: false,
            isTileDeleteConfirmShow: false,
            deleteTileId: null,
            deleteCategoryId: null,
            parentTileId: null,
            appContentScrollTop: 0
        }
    },
    computed: {        
        childrenTiles: function() {
            if(this.parentTileId) {
                let tile = this.getTile(this.parentTileId);
                return (tile) ? this.getTiles( tile.children ) : [];
            }
            return [];
        }
    },
    created() {
        this.$appContent = document.querySelector('#app-content');
        this.appsService = new AppsService();
        this.tilesService = new TilesService();
        this.tileCategoriesService = new TileCategoriesService();
        this.metricsService = new MetricsService();
        this.loading = true;

        Promise.all([ 
            this.appsService.getList(), 
            this.metricsService.getList(),  
            this.tileCategoriesService.getList(this.profileType), 
            this.tilesService.getList(TilesService.TILE_PAGE_PROFILE) 
        ]).then(([ apps, metrics, categories, tiles ]) => {
            this.apps = apps;
            categories.sort((a, b) => a.place - b.place);
            // оставим по типу
            //tiles = tiles.filter((item) => item.page == TilesService.TILE_PAGE_PROFILE); // @TODO @DELETE item.page == TilesService.TILE_PAGE_PROFILE
            tiles = this.filterTilesByTag(tiles, metrics, this.profileType);
            // оставим по типу
            this.metrics = this.filterMetricsByTag(metrics, this.profileType);
            this.categories = categories;
            this.tiles = tiles;
            this.loading = false;
        })
        .catch(this.apiErrorHandler);
    },
    beforeDestroy() {
        this.appsService.transport.cancelAllRequests();
        this.tilesService.transport.cancelAllRequests();
        this.metricsService.transport.cancelAllRequests();
        this.tileCategoriesService.transport.cancelAllRequests();
    },
    methods: {
        filterMetricsByTag(metrics, tag) {
            let m = metrics.map((metricItem) => {
                // удаляем представления, с другими тегами
                metricItem.views = metricItem.views.filter((viewItem) => {
                    return viewItem.tags.indexOf(tag) >= 0;
                });
                return metricItem;
            });
            return m.filter((item) => item.views.length > 0).sort((a, b) => String(a.name).localeCompare(b.name));
        },
        filterTilesByTag(tiles, metrics, tag) {
            return tiles.filter((tileItem) => {
                let metric = metrics.find((metricItem) => metricItem.id == tileItem.metric_id);                
                if(!metric) {
                    return false;
                }
                let view = null;
                // metric_view_id задан => ищем по id
                if(tileItem.metric_view_id) {
                    view = metric.views.find((viewItem) => viewItem._id == tileItem.metric_view_id);
                }
                // иначе => ищем первый по тегу
                else {
                    view = metric.views.find((viewItem) => viewItem.tags.indexOf(tag) >= 0);
                }
                return view != null;
            });
        },
        toggleCategoryCollapse: function(category) {
            let val = this.categoriesCollapsedStatus[ category._id ]
            this.$set(this.categoriesCollapsedStatus, category._id, !val);            
        },
        getTile: function(tileId) {
            let tile = this.tiles.find((item) => item.id == tileId);
            return tile;
        },
        getTiles: function(tileIds) {
            return this.tiles.filter((item) => tileIds.indexOf(item.id) >= 0);
        },
        getTileMetricName: function(tileId) {
            let tile = this.getTile(tileId);
            if(!tile) {
                return '';
            }
            return this.getMetricProp(tile.metric_id, 'name');
        },
        getMetricProp(metricId, prop) {
            let metric = this.metrics.find((item) => item.id == metricId);
            return metric ? (metric[prop] ? metric[prop] : '') : '';
        },
        getCategoryTiles: function(categoryId) {
            let tiles = this.tiles.filter((tile) => tile.category_id == categoryId && tile.enabled && tile.page == this.page);
            return tiles.sort((a, b) => a.kpi_place - b.kpi_place);
        },
        getCategoryName: function(categoryId) {
            let category = this.categories.find((item) => item._id == categoryId);
            return category ? category.name : '';
        },
        getTileCss: function(tile) {
            let css = {
                'grid-column-end': `span ${tile.width}`,
                'grid-row-end': `span ${tile.height}`,
            };
            if(tile.style == null) {
                return css;
            }
            let bg = tile.style.backgroundColor; // ~ [ <color-hex>, <color-hex> ]
            if(bg.length == 2) {
                if(bg[0] == bg[1]) {
                    css.backgroundColor = bg[0].toLowerCase();
                }else{
                    css.background = `linear-gradient(135deg, ${bg[0].toLowerCase()} 0%, ${bg[1].toLowerCase()} 100%)`;
                }
            }
            css.color = tile.style.color;                
            return css;
        },
        showCategoryEditor: function(category = null) {
            let editor = this.$refs.categoryEditor;
            editor.reset();
            if(category != null) {
                editor.entity = _.cloneDeep(category);
            }
            this.isCategoryEditorShow = true;
        },
        showTileEditor: function(tile = null) {
            let editor = this.$refs.tileEditor;
            editor.reset();
            if(tile != null) {
                editor.entity = _.cloneDeep(tile);
            }
            this.isTileEditorShow = true;
        },
        showChildrenTiles: function(tile) {
            this.appContentScrollTop = this.$appContent.scrollTop;
            this.$nextTick(() => {
                this.parentTileId = tile.id;
                this.$appContent.scrollTop = 0;
            });
        },
        hideChildrenTiles: function() {
            this.parentTileId = null;
            this.$nextTick(() => {
                this.$appContent.scrollTop = this.appContentScrollTop;
            });
        },
        onCategoryAddTileClick: function(category) {
            let e = TilesService.tileEntity();
            e.category_id = category._id;
            e.page = this.page;
            this.showTileEditor(e);
        },
        onCategoryAddClick: function() {
            this.showCategoryEditor();
        }, 
        onCategoryEditClick: function(category) {
            this.showCategoryEditor(category);
        }, 
        onCategoryDeleteClick: function(category) {
            this.deleteCategoryId = category._id;
            this.isCategoryDeleteConfirmShow = true;
        }, 
        onCategoryDeleteConfirmSubmitClick: function() {
            this.loading = true;
            this.isCategoryDeleteConfirmShow = false;
            this.tileCategoriesService.delete(this.deleteCategoryId).then(() => {
                this.loading = false;
                let i = this.categories.findIndex((item) => item._id == this.deleteCategoryId);
                if(i >= 0) {
                    this.categories.splice(i, 1);
                }
            })
            .catch(this.apiErrorHandler);            
        },        
        onCategoryEditorSubmitClick: function() {            
            let editor = this.$refs.categoryEditor;
            editor.validationTouch();
            if(!editor.validationIsValid()) {
                return;
            }
            let entity = editor.entity;
            entity.type = this.profileType;

            this.loading = true;
            this.isCategoryEditorShow = false;
            this.tileCategoriesService.save(entity).then((id) => {
                this.loading = false;
                // update
                if(entity._id != null) {
                    let i = this.categories.findIndex((item) => item._id == entity._id);
                    if(i >= 0) {
                        this.$set(this.categories, i, entity);
                    }
                }
                // create
                else {
                    entity._id = id;
                    this.categories.push(entity);
                }
            })
            .catch(this.apiErrorHandler);
            
        },
        onTileChildrenClick: function(tile) {
            this.showChildrenTiles(tile);            
        },
        onTileEditClick: function(tile) {
            this.showTileEditor(tile);
        },
        onTileDeleteClick: function(tile) {
            this.deleteTileId = tile.id;
            this.isTileDeleteConfirmShow = true;
        },
        onTileDeleteConfirmSubmitClick: function() {
            this.loading = true;
            this.isTileDeleteConfirmShow = false;
            this.tilesService.delete(this.deleteTileId).then(() => {
                this.loading = false;
                let i = this.tiles.findIndex((item) => item.id == this.deleteTileId);
                if(i >= 0) {
                    this.tiles.splice(i, 1);
                }
                // пройдем по всем тайлам
                this.tiles.forEach((tileItem, i) => {
                    // и удалим тайл, который удалили из детей
                    let childIndex = tileItem.children.findIndex((child) => child == this.deleteTileId);
                    if(childIndex >= 0) {
                        tileItem.children.splice(childIndex, 1);
                    }
                });
            })
            .catch(this.apiErrorHandler);
        },
        onTileEditorSubmitClick: function() {
            let editor = this.$refs.tileEditor;
            editor.validationTouch();
            if(!editor.validationIsValid()) {
                return;
            }
            let entity = editor.entity;
            let parentTileId = (this.parentTileId != null) ? this.parentTileId : '';
            this.loading = true;
            this.isTileEditorShow = false;
            this.tilesService.save(entity, parentTileId).then((id) => {
                this.loading = false;
                // update
                if(entity.id != null) {
                    let i = this.tiles.findIndex((item) => item.id == entity.id);
                    if(i >= 0) {
                        this.$set(this.tiles, i, entity);
                    }
                }
                // create
                else {
                    entity.id = id;
                    this.tiles.push(entity);
                    // добавим его в родительский тайл
                    let parentTile = this.getTile(this.parentTileId);
                    parentTile.children.push(entity.id);
                }
            })
            .catch(this.apiErrorHandler);
        },
        onChildrenTilesAddTileClick: function(tileId) {
            let tile = this.getTile(tileId);
            if(!tile) {
                return;
            }
            let e = TilesService.tileEntity();
            e.category_id = tile.category_id;
            e.page = this.page;
            e.enabled = false;
            this.showTileEditor(e);
        }
    }
}
</script>
