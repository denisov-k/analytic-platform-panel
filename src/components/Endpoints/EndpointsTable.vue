<template>
  <vk-card>
    <div slot="header">
      <div class="uk-float-right">
        <vk-button type="primary" @click="onCreateBtnClick">Создать</vk-button>
      </div>
      <h2 class="uk-margin-remove">{{ $route.meta.viewTitle }}
        <vk-spinner class="uk-margin-left" v-if="loading"></vk-spinner>
      </h2>
      <p class="uk-text-muted uk-margin-remove">{{ $route.meta.viewDescription }}</p>
    </div>

    <div class="uk-overflow-auto" v-if="entitesFiltered.length">
      <table class="uk-table uk-table-hover uk-table-divider">
        <thead>
        <tr>
          <th>Путь</th>
          <th>Приложение</th>
          <th title="Кол-во измерений и мер">И/М</th>
          <th>Макс. кол-во записей</th>
          <th>Доступ метода</th>
          <th>Анонимный доступ</th>
          <th>Ограничение нулей</th>
          <th>Section access</th>
          <th class="uk-table-shrink"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, i) in pageEntities" :key="item._id">
          <td>
            <export-link :url="item.url" :title="item.path"></export-link>
          </td>
          <td :title="item.appId" @click="saveToClipboard(item.appId)">{{ item.app.name }}</td>
          <td>{{ item.dimensions.length }}/{{ item.measures.length }}</td>
          <td>{{ item.rowLimit }}</td>
          <td>
            <div class="icon" v-if="item.enabled"><i class="mdi mdi-check"></i></div>
          </td>
          <td>
            <div class="icon" v-if="item.anonymousAccess"><i class="mdi mdi-check"></i></div>
          </td>
          <td>
            <div class="icon" v-if="item.suppressZero"><i class="mdi mdi-check"></i></div>
          </td>
          <td>
            <div class="icon" v-if="item.sectionAccess"><i class="mdi mdi-check"></i></div>
          </td>
          <td>
            <button class="uk-button uk-button-none" @mouseover="dropdownShowEntityId = item._id">
              <div class="icon"><i class="mdi mdi-dots-vertical"></i></div>
            </button>
            <vk-dropdown class="uk-border-rounded"
                         v-if="dropdownShowEntityId === item._id && !isEditorShow && !isDeleteConfirmShow">
              <ul class="uk-nav uk-dropdown-nav">
                <li><a @click="onRowDuplicateClick(item)">Дублировать</a></li>
                <li><a @click="onRowEditClick(item)">Изменить</a></li>
                <li><a @click="onRowDeleteClick(item, i)">Удалить</a></li>
              </ul>
            </vk-dropdown>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="uk-text-muted" v-else>Нет записей</div>

    <div class="methods-list-bottom">
      <div class="pages">
        <vk-pagination :page.sync="page" :perPage="perPage" :total="entitesFiltered.length">
          <vk-pagination-page-prev></vk-pagination-page-prev>
          <vk-pagination-pages></vk-pagination-pages>
          <vk-pagination-page-next></vk-pagination-page-next>
        </vk-pagination>
      </div>
      <div class="uk-form-controls search-input-container">
        <div class="uk-inline">
          <div class="uk-form-icon">
            <div class="icon"><i class="mdi mdi-magnify"></i></div>
          </div>
          <input class="uk-input" type="search" placeholder="Приложение или адрес метода" v-model="entitiesSearchQuery">
        </div>
        <a class="icon" @click="entitiesSearchQuery = ''" v-if="entitiesSearchQuery.length > 0"><i
            class="mdi mdi-close"></i></a>
      </div>
    </div>

    <api-error-modal :show="isApiErrorShow" :error="apiError"></api-error-modal>

    <vk-modal center :overflow-auto="false" size="large" :show.sync="isDeleteConfirmShow">
      <!--<vk-modal-close @click="isDeleteConfirmShow = false"></vk-modal-close>-->
      <vk-modal-title slot="header">Удаление метода</vk-modal-title>
      <p>Вы уверены, что хотите удалить метод <b>{{ entityToDeleteName }}</b>?</p>
      <div class="uk-text-right" slot="footer">
        <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
        <vk-button class="uk-margin-right" @click="isDeleteConfirmShow = false">Отмена</vk-button>
        <vk-button type="primary" @click="onDeleteConfirmSubmitClick">Удалить</vk-button>
      </div>
    </vk-modal>

    <vk-modal center :overflow-auto="false" stuck size="xlarge" :show.sync="isEditorShow" class="modal-method-editor">
      <!--<vk-modal-close @click="isEditorShow = false"></vk-modal-close>-->
      <vk-modal-title slot="header">Редактор метода</vk-modal-title>
      <method-editor :apps="apps" ref="editor"></method-editor>
      <div class="uk-text-right" slot="footer">
        <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
        <!--<vk-button @click="onEditorDownloadClick" class="">Скачать</vk-button>-->
        <vk-button @click="isEditorShow = false" class="uk-margin-right">Отмена</vk-button>
        <vk-button @click="onEditorSubmitClick" type="primary">Сохранить</vk-button>
      </div>
    </vk-modal>

  </vk-card>
</template>
<script>
import _ from 'lodash';
import EndpointsService from '@/services/EndpointsService';
import AppsService from '@/services/AppsService';
import ApiErrorModal from '@/components/ApiErrorModal';

import MethodEditor from './Editor/index';
import ExportLink from "./ExportLink";

import Config from '@/utils/Config';

export default {
  components: {
    ApiErrorModal,
    MethodEditor,
    ExportLink
  },
  data() {
    return {
      page: 1,
      perPage: 10,
      loading: false,
      apiError: '',
      apps: [],
      entities: [],
      entitiesSearchQuery: '',
      entitiesSearchDelay: 250,
      entityToDeleteIndex: -1,
      dropdownShowEntityId: null,
      isEditorShow: false,
      isDeleteConfirmShow: false,
      isApiErrorShow: false,
      exportFormats: [
        { title: 'CSV формат', param: 'csv' },
        { title: 'Qlik формат', param: 'qlik' },
      ]
    }
  },
  computed: {
    entitesFiltered: function () {

      if (!this.entitiesSearchQuery.length)
        return this.entities;

      function isPathMatch(entity, query) {
        return entity.path && entity.path.indexOf(query) >= 0
      }
      function isAppMatch(entity, query) {
        return entity.app.name && entity.app.name.indexOf(query) >= 0
      }

      return this.entities.filter((item) =>
          isPathMatch(item, this.entitiesSearchQuery) || isAppMatch(item, this.entitiesSearchQuery));
    },
    pageEntities: function () {
      if (this.entitesFiltered.length / this.perPage < this.page)
        this.setPage(Math.ceil(this.entitesFiltered.length / this.perPage));

      let s = (this.page - 1) * this.perPage;

      return this.entitesFiltered.slice(s, s + this.perPage);
    },
    entityToDeleteName: function () {
      if (this.entityToDeleteIndex < 0) {
        return '';
      }
      let entity = this.entities[this.entityToDeleteIndex];
      return entity ? entity.path : '';
    }
  },
  created() {
    this.appsService = new AppsService();
    this.apiMethodsService = new EndpointsService();
    this.loadData();
  },
  beforeDestroy() {
    this.appsService.transport.cancelAllRequests();
    this.apiMethodsService.transport.cancelAllRequests();
  },
  methods: {
    loadData() {
      let requests = [
        this.appsService.getList(),
        this.apiMethodsService.getList()
      ];

      this.loading = true;

      Promise.all(requests).then(([apps, entities]) => {
        this.apps = apps;
        this.entities = entities;

        entities.forEach(entity => {
          entity.app = apps.find(app => app._id === entity.app) || {};
        })

        this.loading = false;
      })
          .catch(this.apiErrorHandler);
    },
    showEditor: function (method = null) {
      this.$refs.editor.reset();
      if (method != null) {
        this.$refs.editor.entity = _.cloneDeep(method);
      }
      this.isEditorShow = true;
    },
    setPage: function (value) {
      this.page = value;
    },
    apiErrorHandler: function (error) {
      this.loading = false;
      this.apiError = error;
      this.isApiErrorShow = true;
    },
    onEditorSubmitClick: function () {
      this.$refs.editor.validationTouch();
      if (!this.$refs.editor.validationIsValid()) {
        return;
      }
      let entity = this.$refs.editor.entity;
      // create
      if (entity._id == '') {
        this.loading = true;
        // создаем
        this.apiMethodsService.create(entity.appId, entity.path).then((entityId) => {
          entity._id = entityId;
          // сохр.
          this.apiMethodsService.save(entity).then((result) => {
            // вставка
            this.entities.unshift(entity);
            this.loading = false;
          })
              .catch(this.apiErrorHandler);
        })
            .catch(this.apiErrorHandler);
      }
      // update
      else {
        let i = this.entities.findIndex((elem) => elem._id == entity._id);
        if (i < 0) {
          return;
        }
        this.loading = true;
        // сохр.
        this.apiMethodsService.save(entity).then((result) => {
          // замена
          this.$set(this.entities, i, entity);
          this.loading = false;
        })
            .catch(this.apiErrorHandler);
      }
      this.isEditorShow = false;
    },
    onDeleteConfirmSubmitClick: function () {
      let entity = this.entities[this.entityToDeleteIndex];
      if (!entity) {
        return;
      }
      this.loading = true;
      this.apiMethodsService.delete(entity._id).then((result) => {
        this.entities.splice(this.entityToDeleteIndex, 1);
        this.entityToDeleteIndex = -1;
        this.isDeleteConfirmShow = false;
        this.loading = false;
      })
          .catch(this.apiErrorHandler);
    },
    onCreateBtnClick: function () {
      this.showEditor();
    },
    onRowDuplicateClick: function (entity) {
      let dup = { ...entity, _id: '' };

      this.showEditor(dup);
    },
    onRowEditClick: function (entity) {
      this.showEditor(entity);
    },
    onRowDeleteClick: function (entity) {
      let absouluteIndex = this.entities.findIndex((item) => {
        return item == entity;
      });

      this.entityToDeleteIndex = absouluteIndex;
      this.isDeleteConfirmShow = true;
    },
    onEditorDownloadClick: function () {
      console.log(this, arguments)
    },
    saveToClipboard(value) {
      navigator.clipboard.writeText(value)
    }
  }
}
</script>
<style scoped>
.pages {
  display: inline-block;
}

.search-input-container {
  width: 400px;
  display: inline-block;
  float: right;
}

.search-input-container .uk-inline {
  width: calc(100% - 25px);
}

.methods-list-bottom {
  margin-top: 20px;
}

.uk-pagination {
  margin-bottom: 0px;
  vertical-align: middle;
  line-height: 40px;
}

.uk-table a:hover {
  text-decoration: none;
}
</style>