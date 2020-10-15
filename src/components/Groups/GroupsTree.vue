<template>
    <div class="group-tree">
      <div class="group" v-for="(group, groupIndex) in groupsTree" v-bind:key="groupIndex">
        <v-collapse-wrapper v-on:beforeToggle="beforeToggle">

          <div class="header" v-collapse-toggle>
            <vk-icons-users></vk-icons-users>

            <div class="name">
              <input class="input-value" v-model="group.newName">
              <div class="accept-changes-button" v-show="group.newName !== group.name" v-on:click="saveValue(group, group)">
                <vk-icons-check></vk-icons-check>
              </div>
            </div>
            <span class="sub-title">Группа ({{ group.filters.length }})</span>

            <div class="manage-buttons">
              <div class="add-node" v-on:click.stop.prevent="addFilter(group)"><vk-icons-plus-circle></vk-icons-plus-circle></div>
              <div class="remove-node" v-on:click.stop.prevent="deleteGroup(group)"><vk-icons-close></vk-icons-close></div>
            </div>
          </div>

          <div class="my-content" v-collapse-content>
            <span v-if="!group.filters.length">Список фильтров пуст</span>

            <div class="filter" v-for="(filter, filterIndex) in group.filters" v-bind:key="filterIndex">

              <v-collapse-wrapper v-on:beforeToggle="beforeToggle">
                <div class="header" v-collapse-toggle>
                  <vk-icons-thumbnails></vk-icons-thumbnails>

                  <div class="name">
                    <input class="input-value" v-model="filter.newName">
                    <div class="accept-changes-button" v-show="filter.newName !== filter.name" v-on:click="saveValue(filter, group)">
                      <vk-icons-check></vk-icons-check>
                    </div>
                  </div>
                  <span class="sub-title">Фильтр ({{ filter.values.length }})</span>
                  <div class="manage-buttons">
                    <div class="add-node" v-on:click.stop.prevent="addValue(group, filterIndex)"><vk-icons-plus-circle></vk-icons-plus-circle></div>
                    <div class="remove-node" v-on:click.stop.prevent="deleteFilter(group, filterIndex)"><vk-icons-close></vk-icons-close></div>
                  </div>
                </div>

                <div class="my-content" v-collapse-content>
                  <div class="value" v-for="(value, valueIndex) in filter.values" v-bind:key="valueIndex">
                    <div class="header">
                      <vk-icons-hashtag></vk-icons-hashtag>
                      <div class="name">
                        <input class="input-value" v-model="value.newName">
                        <div class="accept-changes-button" v-show="value.newName !== value.name" v-on:click="saveValue(value, group)">
                          <vk-icons-check></vk-icons-check>
                        </div>
                      </div>
                      <span class="sub-title">Значение</span>
                      <div class="manage-buttons">
                        <div class="remove-node" v-on:click.stop.prevent="deleteValue(group, filterIndex, valueIndex)"><vk-icons-close></vk-icons-close></div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-collapse-wrapper>

            </div>
          </div>
        </v-collapse-wrapper>
      </div>
      <div class="uk-float-right">
        <vk-button type="primary" @click="addGroup">Добавить группу</vk-button>
      </div>
      <div class=""></div>
    </div>
</template>

<script>
    import GroupsService from "../../services/GroupsService";

    const groupsManager = new GroupsService();

    export default {
        name: "TreeExample",
        components: {

        },
        data() {
            return {
                groupsTree: [],
                groupsTreeOriginal: []
            }
        },
        mounted() {
            this.getGroupsList()
        },
        computed: {

        },
        methods: {
            getGroupsList() {

                groupsManager.getList().then(list => {
                    this.groupsTree = list.map(item => {
                      return {
                        ...item,
                        newName: item.name,
                        filters: item.filters.map(item => {
                          return {
                            ...item,
                            newName: item.name,
                            values: item.values.map(item => {
                              return { ...item, newName: item.name }
                            })
                          }
                        })
                      }
                    })
                })
            },

            deleteGroup(group) {
                groupsManager.delete(group._id).then(() => {
                    this.groupsTree.splice(this.groupsTree.findIndex(item => item._id === group._id), 1)
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
                group.filters.push({ name: 'New filter', values: [] });

                this.saveGroup(group);
            },
            addValue(group, filterIndex) {
                group.filters[filterIndex].values.push({ name: 'New value' });

                this.saveGroup(group);
            },
            changeValue($event, item) {

              console.log($event.target.value, item);

              item.newName = $event.target.value

              //obj.newName = newValue;
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
                        values: group.filters[key].values.map(item => { return { name: item.name } })
                    };
                });

                groupsManager.edit(group._id, group.name, filters);
            },

            addGroup() {
                let name = 'New group';

                groupsManager.create(name).then(groupId => {

                    let node = {
                        _id: groupId,
                        id: groupId,
                        name: name,
                        type: 'group',
                        filters: []
                    };

                    this.groupsTree.push(node);
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