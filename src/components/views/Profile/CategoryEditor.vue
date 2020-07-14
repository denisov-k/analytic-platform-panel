<template>
    <form>
        <div class="uk-margin-small">
            <label class="uk-form-label">Название</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input" :class="{ 'uk-form-danger': $v.entity.name.$error }" type="text" placeholder="Название категории" v-model="$v.entity.name.$model">
                </div>
            </div>
        </div>
        <div class="uk-margin-small">
            <label class="uk-form-label">Позиция</label>
            <div class="uk-form-controls">
                <div class="uk-inline uk-display-block">
                    <input class="uk-input uk-width-1-2" :class="{ 'uk-form-danger': $v.entity.place.$error }" type="number" min="0" step="1" v-model="$v.entity.place.$model">
                </div>
            </div>
        </div>         
    </form>
</template>
<script>
import _ from 'lodash';
import { required, minLength, integer, minValue } from 'vuelidate/lib/validators';
import TileCategoriesService from './../../../services/TileCategoriesService';

let defaultEntity = TileCategoriesService.tileCategoryEntity;

export default {
    data() {
        return {            
            entity: defaultEntity()
        }
    },
    props: {
        categories: {
            type: Array,
            default: function() { 
                return [];
            }
        }
    },
    validations: {   
        entity: {
            name: {
                required,
                minLength: minLength(2),
                isUniq: function(val) {
                    let n = this.categories.reduce((acc, elem) => {
                        return (elem.name == val && elem._id != this.entity._id) ? acc + 1 : acc;
                    }, 0);
                    return n < 1;
                }
            },
            place: {
                required,
                integer,
                minValue: minValue(0)
            },
        }
    },
    methods: {
        reset() {
            this.entity = defaultEntity();
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
        }
    }
}
</script>
