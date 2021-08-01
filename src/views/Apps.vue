<template>
  <div class="views--apps">
    <section class="uk-section uk-padding">
      <vk-card>
        <div slot="header">
          <div class="uk-float-right" v-if="false">
            <vk-button type="primary" @click="onUploadAppClick">Загрузить приложение</vk-button>
            <div class="hiddenfile">
              <input name="upload" accept=".qvf" type="file"
                     id="fileinput" ref="myFiles" @change="onAppFileSelect"/>
            </div>
          </div>

          <h2 class="uk-margin-remove">{{ $route.meta.viewTitle }}
            <vk-spinner class="uk-margin-left" v-if="loading"></vk-spinner>
          </h2>
          <p class="uk-text-muted uk-margin-remove">{{ $route.meta.viewDescription }}</p>
        </div>

        <apps-list v-if="entities.length" :apps="pageEntities" :actions="appActions"></apps-list>

        <div class="apps-list-bottom">
          <div class="pages">
            <vk-pagination :page.sync="page" :perPage="perPage" :total="entitiesFiltered.length">
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
              <input class="uk-input" type="search" placeholder="Название приложения или ID"
                     v-model="entitiesSearchQuery">
            </div>
            <a class="icon" @click="entitiesSearchQuery = ''" v-if="entitiesSearchQuery.length > 0"><i
                class="mdi mdi-close"></i></a>
          </div>
        </div>

        <vk-modal center :overflow-auto="false" size="large" v-show="isActionConfirmShow('delete')">
          <vk-modal-close @click="cancelAction"></vk-modal-close>
          <vk-modal-title slot="header">Удаление приложения</vk-modal-title>
          <p>Вы уверены, что хотите удалить приложение <b>{{ entityForAction.name }}</b>?</p>
          <div class="uk-text-right" slot="footer">
            <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
            <vk-button class="uk-margin-right" @click="cancelAction">Отмена</vk-button>
            <vk-button type="primary" @click="onDeleteConfirmSubmitClick">Удалить</vk-button>
          </div>
        </vk-modal>

        <vk-modal center :overflow-auto="false" size="large" v-show="isActionConfirmShow('reload')">
          <vk-modal-close @click="cancelAction"></vk-modal-close>
          <vk-modal-title slot="header">Перезагрузка приложения</vk-modal-title>
          <p>Вы уверены, что хотите перезагрузить приложение <b>{{ entityForAction.name }}</b>?</p>
          <div class="uk-text-right" slot="footer">
            <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
            <vk-button class="uk-margin-right" @click="cancelAction">Отмена</vk-button>
            <vk-button type="primary" @click="onReloadConfirmSubmitClick">Перезагрузить</vk-button>
          </div>
        </vk-modal>

        <vk-modal center :overflow-auto="false" size="large" v-show="isActionConfirmShow('script_edit')">
          <script-editor :app="entityForAction" ref="script_editor"></script-editor>
          <div class="uk-text-right" slot="footer">
            <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
            <vk-button class="uk-margin-right" @click="cancelAction">Отмена</vk-button>
            <vk-button type="primary" @click="onEditConfirmSubmitClick">Сохранить</vk-button>
          </div>
        </vk-modal>

        <api-error-modal :show="isApiErrorShow" :error="apiError"></api-error-modal>
      </vk-card>
    </section>
  </div>
</template>
<script>
import AppsService from '../services/AppsService';
import ApiErrorModal from '../components/ApiErrorModal';
import AppsList from '../components/Apps/List';
import ScriptEditor from "@/components/Apps/ScriptEditor";

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

export default {
  components: {
    ScriptEditor,
    ApiErrorModal, AppsList
  },
  data() {
    return {
      isApiErrorShow: false,
      inProgressAction: '',
      apiError: '',
      entities: [],
      entitiesSearchQuery: '',
      entitiesSearchDelay: 250,
      entityForAction: {},
      files: [],
      page: 1,
      perPage: 10,
      appActions: [
        { label: "Редактировать скрипт", func: this.onRowEditScriptClick },
        { label: "Перезагрузить", func: this.onRowReloadClick },
        { label: "Скачать", func: this.onRowDownloadClick },
        { label: "Удалить", func: this.onRowDeleteClick },
      ]
    }
  },
  computed: {
    entitiesFiltered: function () {
      let q = this.entitiesSearchQuery;
      return q.length ? this.entities.filter((item) => item.name && item.name.indexOf(q) >= 0 || item.id && item.id.indexOf(q) >= 0) : this.entities;
    },
    pageEntities: function () {
      if (this.entitiesFiltered.length / this.perPage < this.page)
        this.setPage(Math.ceil(this.entitiesFiltered.length / this.perPage));

      let s = (this.page - 1) * this.perPage;

      return this.entitiesFiltered.slice(s, s + this.perPage);
    }
  },
  mounted() {

  },
  created() {
    this.service = new AppsService();

    this.loading = true;

    this.service.getList().then((apps) => {
      this.entities = apps;
      this.loading = false;
    }).catch(this.apiErrorHandler);

  },
  beforeDestroy() {
    this.service.transport.cancelAllRequests();
  },
  methods: {
    apiErrorHandler: function (error) {
      this.loading = false;
      this.apiError = error;
      this.isApiErrorShow = true;
    },
    cancelAction: function () {
      this.inProgressAction = '';
    },
    isActionConfirmShow: function (action) {
      return action ? action === this.inProgressAction : !!this.inProgressAction;
    },

    onRowEditScriptClick: function (entity) {
      this.inProgressAction = 'script_edit';
      this.entityForAction = entity;
    },
    onRowDeleteClick: function (entity) {
      this.inProgressAction = 'delete';
      this.entitiesToDeleteId = [entity.id];
      this.entityForAction = entity;
    },
    onRowReloadClick: function (entity) {
      this.inProgressAction = 'reload';
      this.entityForAction = entity;
    },
    onRowDownloadClick: function (entity) {
      this.inProgressAction = 'download';
      this.entityForAction = entity;
    },
    onUploadAppClick: function () {

      document.getElementById('fileinput').click();
    },
    onDeleteConfirmSubmitClick: function () {
      this.service.delete(this.entityForAction.id).then(() => {
        this.removeEntityFromList(this.entityForAction);
        this.inProgressAction = '';
      })
    },
    onReloadConfirmSubmitClick: function () {
      this.service.startReload(this.entityForAction.id).then((rsp) => {
        this.inProgressAction = '';
      })
    },
    onEditConfirmSubmitClick: function () {
      this.service.saveScript(this.entityForAction, this.$refs.script_editor.script)
    },
    removeEntityFromList: function (entity) {
      const entityIndex = this.entities.indexOf(entity);
      this.entities.splice(entityIndex, 1);
    },
    onAppFileSelect: function () {

      this.service.upload({
        file: this.$refs.myFiles.files.item(0),
        name: ''
      }).then(result => {
        console.log(result);
      }).catch(err => {
        console.error(err)
      })
    },
    setPage: function (value) {
      this.page = value;
    },
  }
}
</script>
<style scoped>
.hiddenfile {
  width: 0px;
  height: 0px;
  overflow: hidden;
}

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

.apps-list-bottom {
  margin-top: 20px;
}

.uk-pagination {
  margin-bottom: 0px;
  vertical-align: middle;
  line-height: 40px;
}
</style>
    