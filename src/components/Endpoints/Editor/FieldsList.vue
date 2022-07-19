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
              </div>Выражение</a>
            </li>
          </ul>
        </vk-dropdown>
      </div>
      <div v-collapse-content>
        <vk-grid class="field-item uk-flex-middle uk-margin-small-top" gutter="collapse" v-for="(item, i) in list" :key="i">
          <div class="input-container">
            <textarea class="input" :class="{ 'uk-form-danger': item.name.$error }"
                   placeholder="Метка" v-model="item.name"></textarea>
          </div>
          <div class="uk-width-auto">
            <span class="uk-margin-small-left uk-margin-small-right">
              <div class="icon">
                <i class="mdi mdi-pound mdi-18px" v-if="item.type === 'id'"></i>
                <i class="mdi mdi-variable mdi-18px" v-else></i>
              </div>
            </span>
          </div>
          <div class="input-container">
            <textarea class="input" placeholder="ID" v-model="item.id" v-if="item.type === 'id'"></textarea>
            <expression-input :hints="fields" :value.sync="item.expression" v-else></expression-input>
          </div>
          <div class="delete-button-container uk-width-auto" @click="onParamDeleteBtnClick(list, i)">
            <vk-button class="delete-button" type="link">
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

class Field {
  constructor(type) {
    this.id = '';
    this.name = '';
    this.expression = '';
    this.type = type;
  }
}

export default {
  name: "FieldsList",
  components: {
    ExpressionInput
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    fields: {
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
      this.list.push(new Field(type));
    },
    onParamDeleteBtnClick: function (collection, i) {
      collection.splice(i, 1);
    },
  }
}
</script>

<style scoped>
  .field-item {
    height: 30px;
  }
  .field-item:focus-within {
    height: 100px;
  }

  .input-container {
    flex: 1;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    margin: 0;
    height: 100%;
  }
  .delete-button-container {
    margin-left: 10px;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .delete-button {
    border: 1px solid #c8c8c8;
  }
  .delete-button:hover {
    background-color: #ff33332e;
    color: unset;
  }

  >>> .input {
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    color: #4a4a4a;
    background-color: #DEEAEC;
    line-height: 18px;
    text-align: start;
    font-family: sans-serif;
    resize: none;
    word-break: break-all;
    overflow: hidden;
  }

</style>