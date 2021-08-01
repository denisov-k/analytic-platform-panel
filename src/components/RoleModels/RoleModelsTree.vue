<template>
  <div class="group-tree">
    <div class="groups-list">
      <div class="group" v-for="(group, groupIndex) in pageEntities" v-bind:key="groupIndex">
        <v-collapse-wrapper v-on:beforeToggle="beforeToggle">

          <div class="header" v-collapse-toggle>
            <vk-icons-users></vk-icons-users>

            <div class="name">
              <select id="appId" name="appId">
                <option value="">Please choose</option>
                <option value="Mr">Mr</option>
              </select>
              <input class="input-value" v-model="group.newName" placeholder="Название группы">
              <div class="accept-changes-button" v-show="group.newName !== group.name"
                   v-on:click="saveValue(group, group)">
                <vk-icons-check></vk-icons-check>
              </div>
            </div>
            <span class="sub-title">Группа ({{ group.filters.length }})</span>

            <div class="manage-buttons">
              <div class="add-node" v-on:click.stop.prevent="addFilter(group)">
                <vk-icons-plus-circle></vk-icons-plus-circle>
              </div>
              <div class="remove-node" v-on:click.stop.prevent="deleteGroup(group)">
                <vk-icons-close></vk-icons-close>
              </div>
            </div>
          </div>

          <div class="my-content" v-collapse-content>
            <span v-if="!group.filters.length">Список фильтров пуст</span>

            <div class="filter" v-for="(filter, filterIndex) in group.filters" v-bind:key="filterIndex">

              <v-collapse-wrapper v-on:beforeToggle="beforeToggle">
                <div class="header" v-collapse-toggle>
                  <vk-icons-thumbnails></vk-icons-thumbnails>

                  <div class="name">
                    <input class="input-value" v-model="filter.newName" placeholder="Поле в Qlik">
                    <div class="accept-changes-button" v-show="filter.newName !== filter.name"
                         v-on:click="saveValue(filter, group)">
                      <vk-icons-check></vk-icons-check>
                    </div>
                  </div>
                  <span class="sub-title">Фильтр ({{ filter.values.length }})</span>
                  <div class="manage-buttons">
                    <div class="add-node" v-on:click.stop.prevent="addValue(group, filterIndex)">
                      <vk-icons-plus-circle></vk-icons-plus-circle>
                    </div>
                    <div class="remove-node" v-on:click.stop.prevent="deleteFilter(group, filterIndex)">
                      <vk-icons-close></vk-icons-close>
                    </div>
                  </div>
                </div>

                <div class="my-content" v-collapse-content>
                  <div class="value" v-for="(value, valueIndex) in filter.values" v-bind:key="valueIndex">
                    <div class="header">
                      <vk-icons-hashtag></vk-icons-hashtag>
                      <div class="name">
                        <input class="input-value" v-model="value.newName" placeholder="Значение фильтра">
                        <div class="accept-changes-button" v-show="value.newName !== value.name"
                             v-on:click="saveValue(value, group)">
                          <vk-icons-check></vk-icons-check>
                        </div>
                      </div>
                      <span class="sub-title">Значение</span>
                      <div class="manage-buttons">
                        <div class="remove-node" v-on:click.stop.prevent="deleteValue(group, filterIndex, valueIndex)">
                          <vk-icons-close></vk-icons-close>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-collapse-wrapper>

            </div>
          </div>
        </v-collapse-wrapper>
      </div>
    </div>
    <div class="entities-control">
      <div class="pages">
        <vk-pagination :page.sync="page" :perPage="perPage" :total="entitiesFiltered.length">
          <vk-pagination-page-prev></vk-pagination-page-prev>
          <vk-pagination-pages></vk-pagination-pages>
          <vk-pagination-page-next></vk-pagination-page-next>
        </vk-pagination>
      </div>
      <div class="uk-float-right">
        <vk-button type="primary" @click="addGroup">Добавить группу</vk-button>
      </div>
    </div>
  </div>
</template>

<script>
import RoleModelsService from "../../services/RoleModelsService";

const roleModelsManager = new RoleModelsService();

export default {
  name: "RoleModelTree",
  components: {},
  data() {
    return {
      entities: [],
      entitiesSort: {},
      entitiesSearchQuery: '',
      entitiesSearchDelay: 250,
      page: 1,
      perPage: 10,
    }
  },
  mounted() {
    this.getGroupsList()
  },
  computed: {
    entitiesFiltered: function () {
      let q = this.entitiesSearchQuery;
      return q.length ? this.entities.filter((item) => item.email && item.email.indexOf(q) >= 0 || item.username && item.username.indexOf(q) >= 0) : this.entities;
    },
    pageEntities: function () {
      let s = (this.page - 1) * this.perPage;
      return this.entitiesFiltered.slice(s, s + this.perPage);
    }
  },
  methods: {
    getRoleModelsList() {

      roleModelsManager.getList().then(list => {
        this.entities = list.map(item => {
          return {
            ...item,
            newName: item.name,
            filters: item.filters.map(item => {
              return {
                ...item,
                newName: item.name,
                values: item.values.map(item => {
                  return {...item, newName: item.name}
                })
              }
            })
          }
        })
      })
    },

    deleteGroup(group) {
      roleModelsManager.delete(group._id).then(() => {
        this.entities.splice(this.entities.findIndex(item => item._id === group._id), 1)
      })
    },
    deleteFilter(group, filterIndex) {
      group.filters.splice(filterIndex, 1);

      this.saveGroup(group);
    },
    deleteValue(group, filterIndex, valueIndex) {
      group.filters[filterIndex].values.splice(valueIndex, 1);

      this.saveGroup(group);
    },
    addFilter(group) {
      group.filters.push({name: 'New filter', values: []});

      this.saveGroup(group);
    },
    addValue(group, filterIndex) {
      group.filters[filterIndex].values.push({name: 'New value'});

      this.saveGroup(group);
    },
    changeValue($event, item) {
      item.newName = $event.target.value

      this.$nextTick();
    },
    saveValue(item, group) {
      item.name = item.newName;

      this.saveGroup(group);
    },
    saveGroup(group) {
      let filters = Object.keys(group.filters).map((key) => {
        return {
          name: group.filters[key].name,
          values: group.filters[key].values.map(item => {
            return {name: item.name}
          })
        };
      });

      roleModelsManager.edit(group._id, group.name, filters);
    },

    addRoleModel(appId) {
      roleModelsManager.create(appId).then(roleModelId => {

        let group = {
          _id: roleModelId,
          id: roleModelId,
          groups: []
        };

        this.entities.push(group);

        this.page = Math.ceil(this.entitiesFiltered.length / this.perPage);
      })
    },
    beforeToggle($el) {
      if (document.activeElement === $el.$data.nodes.toggle.querySelector('input'))
        $el.status = false;
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less">

.pages {
  display: inline-block;
}

.uk-pagination {
  margin: auto;
}

.name {
  position: relative;
  display: inline-block;
}

.accept-changes-button {
  width: 18px;
  height: 20px;
  position: absolute;
  right: 2px;
  top: 3px;
  padding: 0 1px;
}

.accept-changes-button:hover {
  box-shadow: 1px 1px 4px #a6a6a6;
  border-radius: 20px;
}

.accept-changes-button svg {
  margin-bottom: 4px;
}

.group {
  /*border: 1px solid black;*/
  border-radius: 8px;
  background-color: #ececec;
  margin-bottom: 10px;
  padding: 5px 5px 5px 8px;
  cursor: pointer;
}

.filter {
  /*border: 1px solid black;*/
  border-radius: 8px;
  background-color: #ffffff;
  margin-top: 10px;
  padding: 5px 5px 5px 8px;
  cursor: pointer;
}

.value {
  /*border: 1px solid black;*/
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  margin-top: 10px;
  padding: 5px 5px 5px 8px;
}

div:hover > .manage-buttons {
  display: inline-block;
}

.manage-buttons {
  display: none;
  margin-right: 10px;
  float: right;
  line-height: 20px;
}

.manage-buttons > div {
  display: inline-block;
}

.filter > div > .header {
  margin-left: 15px;
}

.value > .header {
  margin-left: 7px;
}

.input-value {
  margin-left: 10px;
  background-color: #fbfbfb;
  border: 1px solid #bfbfbf;
  padding: 4px;
  border-radius: 4px;
  width: 300px;
}

.sub-title {
  float: right;
  padding-right: 10px;
  font-size: 12px;
  line-height: 22px;
}


.vtl {
  /*.vtl-drag-disabled {
      background-color: #d0cfcf;
      &:hover {
          background-color: #d0cfcf;
      }
  }
  .vtl-disabled {
      background-color: #d0cfcf;
  }*/
}
</style>

<style lang="less" rel="stylesheet/less" scoped>
.icon {
  &:hover {
    cursor: pointer;
  }
}

.muted {
  color: gray;
  font-size: 80%;
}
</style>