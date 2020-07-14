<template>
    <form>
        <div class="uk-margin-small">
            <label class="uk-form-label">Эл.почта</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.email.$error }" type="text" placeholder="" v-model="$v.entity.email.$model">
                </div>
            </div>
        </div>                       
        <div class="uk-margin-small">
            <label class="uk-form-label">Username</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.username.$error }" type="text" placeholder="" v-model="$v.entity.username.$model">
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Directory</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.directory.$error }" type="text" placeholder="" v-model="$v.entity.directory.$model">
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Роли</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <multiselect class="uk-select" :class="{ 'uk-form-danger': $v.entity.roles.$error }" @select="onRolesSelect" @remove="onRolesRemove" v-model="$v.entity.roles.$model" :multiple="true" :options="roles" placeholder="Выберите роли">
                        <template slot="noOptions">Список пуст</template>
                        <template slot="noResult">Ничего не найдено</template>
                    </multiselect>
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <div class="uk-form-controls">
                <label>
                    <span class="uk-checkbox-switch uk-margin-small-right"><input type="checkbox" v-model="$v.entity.isAdmin.$model"><span></span></span>
                    <span>права администратора</span>
                </label>
            </div>
        </div>
    </form>
</template>
<script>
import { required, minLength, email } from 'vuelidate/lib/validators';
import UsersService from './../../../services/UsersService';
import Multiselect from 'vue-multiselect';
import _ from 'lodash';

let defaultEntity = UsersService.userEntity();

export default {
    components: {
        Multiselect
    },
    data() {
        return {
            entity: defaultEntity
        }
    },
    props: {
        roles: {
            type: Array,
            default: function() {
                return [];
            },
            required: true
        }
    },
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
                required,
                minLength: minLength(2)
            },
            roles: {},
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
        onRolesSelect(selectedOption, id) {
            console.log('onRolesSelect', selectedOption, id);
            //this.entity.roles.push(selectedOption);
        },
        onRolesRemove(selectedOption, id) {
            console.log('onRolesRemove', selectedOption, id)
            //this.entity.roles = this.entity.roles.filter((elem) => elem != selectedOption);
        }
    }
}
</script>
