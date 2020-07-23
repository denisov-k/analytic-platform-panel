<template>
    <div class="group-tree">
        <div class="group" v-for="group in groupsTree">
            <v-collapse-wrapper>
                <div class="header" v-collapse-toggle>
                    <vk-icons-users></vk-icons-users>
                    <span class="title">{{ group.name }}</span>
                    <span class="sub-title">Группа</span>
                    <div class="manage-buttons">
                        <div class="add-node" v-on:click.stop.prevent="group.addChild()"><vk-icons-plus-circle></vk-icons-plus-circle></div>
                        <div class="remove-node" v-on:click.stop.prevent="onDel(group)"><vk-icons-close></vk-icons-close></div>
                    </div>
                </div>
                <div class="my-content" v-collapse-content>
                    <span v-if="!group.children.length">
                        Список фильтров пуст
                    </span>
                    <div class="filter" v-for="filter in group.children">
                        <v-collapse-wrapper>
                            <div class="header" v-collapse-toggle>
                                <vk-icons-thumbnails></vk-icons-thumbnails>
                                <span class="title">{{ filter.name }}</span>
                                <span class="sub-title">Фильтр</span>
                                <div class="manage-buttons">
                                    <div class="add-node" v-on:click.stop.prevent="filter.addChild()"><vk-icons-plus-circle></vk-icons-plus-circle></div>
                                    <div class="remove-node" v-on:click.stop.prevent="onDel(filter)"><vk-icons-close></vk-icons-close></div>
                                </div>
                            </div>
                            <div class="my-content" v-collapse-content>
                                <div class="value" v-for="value in filter.children">
                                    <div class="header">
                                        <vk-icons-hashtag></vk-icons-hashtag>
                                        <span class="title">{{ value.name }}</span>
                                        <span class="sub-title">Значение</span>
                                        <div class="manage-buttons">
                                            <div class="remove-node" v-on:click.stop.prevent="onDel(value)"><vk-icons-close></vk-icons-close></div>
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
    import GroupsService from "../../../services/GroupsService";

    const groups = new GroupsService();

    export default {
        name: "TreeExample",
        components: {

        },
        data() {
            return {
                groupsTree: []
            }
        },
        mounted() {
            this.getGroupsList()
        },
        computed: {
          tree() {

              return [

              ];
          }
        },
        methods: {
            getGroupsList() {

                groups.getList().then(list => {
                    let groupsTree = list.map((item, id) => {

                        let group = {
                            id: item._id,
                            name: item.name,
                            type: 'group',
                            children: [],
                            addChild: function () {
                                this.children.push({ name: 'New filter' })
                            }
                        };

                        group.children = item.filters.map(item => {

                            let filter = {
                                id: item.id,
                                name: item.name,
                                children: [],
                                type: 'filter',
                                parent: group,
                                addChild: function () {
                                    this.children.push({ name: 'New value' })
                                }
                            }

                            filter.children = item.values.map(item => {
                                return {
                                    id: item.id,
                                    name: item.name,
                                    type: 'value',
                                    parent: filter
                                }
                            })

                            return filter;
                        })

                        return group
                    })

                    this.groupsTree = groupsTree;
                    console.log(this.groupsTree)
                })

            },
            changeFilters(node) {
                let group = null;

                if (node.type === 'filter')
                    group = node.parent
                else if (node.type === 'value')
                    group = node.parent.parent
                else
                    group = node;


                let children = group.children ? group.children.map(item => {

                    let values = item.children ? item.children.map(item => {
                        return {
                            id: item.id,
                            name: item.name
                        }
                    }) : [];

                    return {
                        id: item.id,
                        name: item.name,
                        values
                    }
                }) : [];

                groups.edit(group.id, group.name, children);
            },
            onDel(node) {
                console.log(node);

                if (node.type === 'group')
                    groups.delete(node.id);
                else {
                    this.changeFilters(node);
                }
            },

            onChangeName(params) {
                if (params.eventType === 'blur') {
                    let node = this.findNode(params.id, this.data.children);

                    this.changeFilters(node);
                }
            },
            findNode(id, array) {

                return array.reduce((accum, item) => {

                    if (accum)
                        return accum;

                    if (item.id === id)
                        return item;

                    if (item.children)
                        return this.findNode(id, item.children);

                    return null;
                }, null);

            },
            createNode(type) {
                params.dragDisabled = true;
                if (params.parent.type === 'group'){
                    params.type = 'filter';
                    params.name = 'New filter';
                    params.addLeafNodeDisabled = true;
                    this.changeFilters(params);
                }
                else if (params.parent.type === 'filter') {
                    params.type = 'value';
                    params.name = 'New value';
                    params.addTreeNodeDisabled = true;
                    params.addLeafNodeDisabled = true;
                    params.isLeaf = true;
                    this.changeFilters(params);
                }
            },

            addGroup() {
                let name = 'New group',
                    self = this;

                groups.create(name).then(groupId => {

                    let node = {
                        id: groupId,
                        name: name,
                        type: 'group',
                        children: []
                    };

                    self.groupsTree.push(node);
                })
            },
        }
    };
</script>

<style lang="less" rel="stylesheet/less">
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
        background-color: #ececec;
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
    .title {
        margin-left: 10px;
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