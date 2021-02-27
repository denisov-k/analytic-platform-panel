<template>
  <form>
    <div class="uk-margin-small">
      <label class="uk-form-label">Email</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.email.$error }" type="text" placeholder=""
                 v-model="$v.entity.email.$model">
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <label class="uk-form-label">Username</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.username.$error }" type="text" placeholder=""
                 v-model="$v.entity.username.$model">
        </div>
      </div>
    </div>
    <!--
    <div class="uk-margin-small">
        <label class="uk-form-label">Directory</label>
        <div class="uk-form-controls">
            <div class="uk-inline uk-display-block">
                <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.directory.$error }" type="text" placeholder="" v-model="$v.entity.directory.$model">
            </div>
        </div>
    </div>
    -->
    <div class="uk-margin-small">
      <label class="uk-form-label">Password</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.password.$error }" type="password"
                 placeholder="" v-model="$v.entity.password.$model">
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <label class="uk-form-label">Groups</label>
      <div class="uk-form-controls">
        <div class="uk-inline uk-display-block">
          <multiselect class="groups-select" :class="{ 'uk-form-danger': $v.entity.groups.$error }"
                       v-model="$v.entity.groups.$model" :multiple="true"
                       :options="groups" placeholder="Выберите группы" label="name" :searchable="true" track-by="_id" :closeOnSelect=false>
            <template slot="option" slot-scope="props"><span class="group-item">{{ props.option.name }}</span></template>
            <template slot="noOptions">Список пуст</template>
            <template slot="noResult">Ничего не найдено</template>
          </multiselect>
        </div>
      </div>
    </div>
    <div class="uk-margin-small">
      <div class="uk-form-controls">
        <label>
          <span class="uk-checkbox-switch uk-margin-small-right"><input type="checkbox"
                                                                        v-model="$v.entity.isAdmin.$model"><span></span></span>
          <span>права администратора</span>
        </label>
      </div>
    </div>
  </form>
</template>
<script>
import {required, minLength, email} from 'vuelidate/lib/validators';
import UsersService from '../../services/UsersService';
import GroupsService from '../../services/GroupsService';
import Multiselect from 'vue-multiselect';
import _ from 'lodash';

let defaultEntity = UsersService.userEntity();

export default {
  components: {
    Multiselect
  },
  data() {
    return {
      entity: defaultEntity,
      groups: []
    }
  },
  props: {},
  validations: {
    entity: {
      email: {
        required,
        email,
        minLength: minLength(2)
      },
      username: {
        required,
        minLength: minLength(2)
      },
      directory: {
        minLength: minLength(2)
      },
      password: {},
      groups: {},
      isAdmin: {}
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
    onGroupSelect(selectedOption, id) {
      //console.log('onGroupSelect', selectedOption, id);
      //this.entity.groups.push(selectedOption);
    },
    onGroupRemove(selectedOption, id) {
      //console.log('onGroupRemove', selectedOption, id)
      //this.entity.groups = this.entity.groups.filter((elem) => elem !== selectedOption);
    }
  },
  mounted() {
    new GroupsService().getList().then(list => {
      this.groups = list;
    })
  }
}
</script>
<style>
.groups-select {
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
  outline: none;

  background: #f4f7fb url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%234A4A4A' d='M12 1L9 6h6zM12 13L9 8h6z'/%3E%3C/svg%3E") no-repeat 100% 50%;
  vertical-align: middle;
  display: inline-block;
  padding: 8px 10px;
  line-height: 25px;
}
.groups-select .multiselect__input {
  outline: none;
}
.groups-select .multiselect__content-wrapper {
  border: 1px solid #dadada;
}
.group-item {
  line-height: 40px;
}
</style>
