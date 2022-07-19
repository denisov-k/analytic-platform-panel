<template>
  <v-collapse-group :onlyOneActive="false" style="overflow: unset;">
    <v-collapse-wrapper class="uk-margin-small" :active="collapsed" @onStatusChange="(data) => collapsed = data.status">
      <div class="list-controller">
        <span class="icon">
            <i class="mdi mdi mdi-chevron-up mdi-18px" v-if="collapsed"></i>
            <i class="mdi mdi mdi-chevron-down mdi-18px" v-else></i>
        </span>
        <vk-button type="text" v-collapse-toggle>{{ caption }} ({{ list.length }})</vk-button>
        <vk-button class="uk-margin-small-left" type="link">
          <div class="icon"><i class="mdi mdi-plus-circle-outline mdi-18px"></i></div>
        </vk-button>
        <vk-dropdown class="uk-border-rounded">
          <ul class="uk-nav uk-dropdown-nav">
            <li><a @click="onParamAddBtnClick('id')">
              <div class="icon uk-margin-small-right">
                <i class="mdi mdi-pound mdi-18px"></i>
              </div>ID</a>
            </li>
            <li><a @click="onParamAddBtnClick('expression')">
              <div class="icon uk-margin-small-right">
                <i class="mdi mdi-variable mdi-18px"></i>
              </div>Название</a>
            </li>
          </ul>
        </vk-dropdown>
      </div>
      <div v-collapse-content>
        <vk-grid class="uk-flex-middle uk-margin-small-top" gutter="collapse" v-for="(item, i) in list" :key="i">
          <div class="uk-width-expand">
            <input class="uk-input uk-form-small" :class="{ 'uk-form-danger': item.name.$error }" type="text"
                   placeholder="Название" v-model="item.name">
          </div>
          <div class="uk-width-auto">
            <span class="uk-margin-small-left uk-margin-small-right">
              <div class="icon">
                <i class="mdi mdi-pound mdi-18px" v-if="item.type === 'id'"></i>
                <i class="mdi mdi-variable mdi-18px" v-else></i>
              </div>
            </span>
          </div>
          <div class="uk-width-expand">
            <input class="uk-input uk-form-small" type="text" placeholder="ID" v-model="item.id"
                   v-if="item.type === 'id'">
            <expression-input :hints="variables" :value.sync="item.qName" v-else></expression-input>

          </div>
          <div class="uk-width-auto">
            <vk-button class="uk-margin-small-left" type="link" @click="onParamDeleteBtnClick(list, i)">
              <div class="icon"><i class="mdi mdi-trash-can-outline mdi-18px"></i></div>
            </vk-button>
          </div>
        </vk-grid>
      </div>
    </v-collapse-wrapper>
  </v-collapse-group>
</template>

<script>
import ExpressionInput from './ExpressionInput';

class Variable {
  constructor(type) {
    this.name = '';
    this.qName = '';
    this.id = '';
    this.type = type;
  }
}

export default {
  name: "VariablesList",
  components: {
    ExpressionInput
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    variables: {
      type: Array
    },
    caption: String
  },
  data() {
    return {
      collapsed: true
    }
  },
  methods: {
    onParamAddBtnClick(type) {
      this.list.push(new Variable(type));
    },
    onParamDeleteBtnClick: function (collection, i) {
      collection.splice(i, 1);
    },
  }
}
</script>

<style scoped>

</style>