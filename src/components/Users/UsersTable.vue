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
    <div class="uk-overflow-auto" v-if="entitiesFiltered.length">
      <table class="uk-table uk-table-hover uk-table-divider uk-text-nowrap">
        <thead>
        <tr>
          <th class="uk-width-1-4">
            <span class="uk-link" @click="toggleSort('username')">Username<div class="icon"><i class="mdi"
                                                                                               :class="{ 'mdi-chevron-up': entitiesSort['username'] == 'asc', 'mdi-chevron-down': entitiesSort['username'] == 'desc', 'mdi-sort-variant': entitiesSort['username'] == null }"></i></div></span>
          </th>
          <!--<th>Directory</th>-->
          <th>Группы</th>
          <th class="uk-table-shrink">
            <span class="uk-link" @click="toggleSort('createdAt')">Дата создания<div class="icon"><i class="mdi"
                                                                                                     :class="{ 'mdi-chevron-up': entitiesSort['username'] == 'asc', 'mdi-chevron-down': entitiesSort['username'] == 'desc', 'mdi-sort-variant': entitiesSort['username'] == null }"></i></div></span>
          </th>
          <th class="uk-table-shrink"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in pageEntities" :key="item._id">
          <td>{{ item.username }}</td>
          <!--<td>{{ item.directory }}</td>-->
          <td>
            <template v-if="item.groups != null">
              <div class="uk-badge uk-margin-small-right" v-for="group in item.groups" :key="group._id">{{
                  group.name
                }}
              </div>
            </template>
          </td>
          <td class="uk-text-nowrap">{{ item.createdAt.toLocaleDateString() }}</td>
          <td>
            <button class="uk-button uk-button-none" @mouseover="dropdownShowEntityId = item._id">
              <div class="icon"><i class="mdi mdi-dots-vertical"></i></div>
            </button>
            <vk-dropdown class="uk-border-rounded"
                         v-if="dropdownShowEntityId == item._id && !isEditorShow && !isDeleteConfirmShow">
              <ul class="uk-nav uk-dropdown-nav">
                <li><a @click="onRowEditClick(item)">Изменить</a></li>
                <li><a @click="onRowDeleteClick(item)">Удалить</a></li>
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
          <input class="uk-input" type="search" placeholder="Эл.почта или username" v-model="entitiesSearchQuery">
        </div>
        <a class="icon" @click="entitiesSearchQuery = ''" v-if="entitiesSearchQuery.length > 0"><i
            class="mdi mdi-close"></i></a>
      </div>
    </div>

    <api-error-modal :show="isApiErrorShow" :error="apiError"></api-error-modal>

    <vk-modal center :overflow-auto="false" size="large" :show.sync="isEditorShow">
      <vk-modal-close @click="isEditorShow = false"></vk-modal-close>
      <vk-modal-title slot="header">Редактор пользователя</vk-modal-title>
      <user-editor ref="editor" :groups="groups"></user-editor>
      <div class="uk-text-right" slot="footer">
        <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
        <vk-button class="uk-margin-right" @click="isEditorShow = false">Отмена</vk-button>
        <vk-button type="primary" @click="onEditorSubmitClick">Сохранить</vk-button>
      </div>
    </vk-modal>

    <vk-modal center :overflow-auto="false" size="large" :show.sync="isDeleteConfirmShow">
      <vk-modal-close @click="isDeleteConfirmShow = false"></vk-modal-close>
      <vk-modal-title slot="header">Удаление пользователя</vk-modal-title>
      <p>Вы уверены, что хотите удалить пользователя <b>{{ entityToDeleteUsername }}</b>?</p>
      <div class="uk-text-right" slot="footer">
        <vk-spinner class="uk-margin-right" v-if="loading"></vk-spinner>
        <vk-button class="uk-margin-right" @click="isDeleteConfirmShow = false">Отмена</vk-button>
        <vk-button type="primary" @click="onDeleteConfirmSubmitClick">Удалить</vk-button>
      </div>
    </vk-modal>

  </vk-card>
</template>

<script>

import _ from 'lodash';
import UsersService from '@/services/UsersService';
import UserEditor from '@/components/Users/UserEditor';
import ApiErrorModal from '@/components/ApiErrorModal';

const SORT_ASC = 'asc';
const SORT_DESC = 'desc';

export default {
  name: "UsersTable",
  components: {
    ApiErrorModal,
    UserEditor
  },
  data() {
    return {
      loading: false,
      isApiErrorShow: false,
      apiError: '',
      isEditorShow: false,
      isDeleteConfirmShow: false,
      dropdownShowEntityId: null,
      entityToDeleteId: null,
      entities: [],
      entitiesSort: {},
      entitiesSearchQuery: '',
      entitiesSearchDelay: 250,
      groups: [],
      page: 1,
      perPage: 10,
    }
  },
  computed: {
    entitiesFiltered: function () {
      let q = this.entitiesSearchQuery;
      return q.length ? this.entities.filter((item) => item.email && item.email.indexOf(q) >= 0 || item.username && item.username.indexOf(q) >= 0) : this.entities;
    },
    pageEntities: function () {
      let s = (this.page - 1) * this.perPage;
      return this.entitiesFiltered.slice(s, s + this.perPage);
    },
    entityToDeleteUsername: function () {
      if (!this.entityToDeleteId) {
        return '';
      }
      let entity = this.entities.find((elem) => elem._id == this.entityToDeleteId);
      return entity ? (entity.username ? entity.username : entity.email) : '';
    }
  },
  created() {
    this.service = new UsersService();
    this.loading = true;
    Promise.all([this.service.getGroupsList(), this.service.getList()]).then(([groups, users]) => {
      this.groups = groups;
      this.entities = users;
      this.loading = false;
    })
        .catch(this.apiErrorHandler);
  },
  beforeDestroy() {
    this.service.transport.cancelAllRequests();
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
    showEditor: function (entity = null) {
      this.$refs.editor.reset();
      if (entity != null) {
        this.$refs.editor.entity = _.cloneDeep(entity);
      }
      this.isEditorShow = true;
    },
    apiErrorHandler: function (error) {
      this.loading = false;
      this.apiError = error;
      this.isApiErrorShow = true;
    },
    onCreateBtnClick: function () {
      this.showEditor();
    },
    onRowEditClick: function (entity) {
      this.showEditor(entity);
    },
    onRowDeleteClick: function (entity) {
      this.entityToDeleteId = entity._id;
      this.isDeleteConfirmShow = true;
    },
    onEditorSubmitClick: function () {
      this.$refs.editor.validationTouch();
      if (!this.$refs.editor.validationIsValid()) {
        return;
      }
      let entity = this.$refs.editor.entity;
      this.loading = true;
      this.service.save(entity).then((resEntity) => {
        if (entity._id == '') {
          this.$set(this.entities, this.entities.length, resEntity);
        } else {
          let i = this.entities.findIndex((elem) => elem._id == entity._id);
          if (i >= 0) {
            this.$set(this.entities, i, entity);
          }
        }
        this.loading = false;
      })
          .catch(this.apiErrorHandler);
      this.isEditorShow = false;
    },
    onDeleteConfirmSubmitClick: function () {
      this.loading = true;
      this.service.delete(this.entityToDeleteId).then(() => {
        this.entities = this.entities.filter((elem) => elem._id != this.entityToDeleteId);
        this.entityToDeleteId = null;
        this.isDeleteConfirmShow = false;
        this.loading = false;
      })
          .catch(this.apiErrorHandler);
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
</style>