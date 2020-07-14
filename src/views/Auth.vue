<template>
    <div class="views--auth uk-height-1-1">
        <vk-grid class="uk-child-width-1-2 uk-height-1-1 promo-holder">
            <div class="uk-flex uk-flex-safe-middle uk-flex-center">
                <div class="uk-logo">Box.admin</div>
                <sup>v.{{ appVersion }}</span></sup>
            </div>
            <div class="uk-flex uk-flex-safe-middle form-holder">
                <form>
                    <div class="uk-margin-small-bottom">
                        <div class="uk-form-controls">
                            <div class="uk-inline uk-display-block">
                                <div class="icon uk-form-icon"><i class="mdi mdi-account mdi-18px"></i></div>
                                <input class="uk-input" type="text" placeholder="Логин">
                            </div>
                        </div>
                    </div>
                    <div class="uk-margin-bottom">
                        <div class="uk-form-controls">
                            <div class="uk-inline uk-display-block">
                                <div class="icon uk-form-icon"><i class="mdi mdi-textbox-password mdi-18px"></i></div>
                                <input class="uk-input" type="password" placeholder="Пароль">
                            </div>
                        </div>
                    </div>
                    <vk-button type="primary">Войти</vk-button>
                </form>
            </div>
        </vk-grid>
    </div>
</template>

<script>
import { version as appVersion } from './../../package';
export default {
    data() {
        return {
            appVersion
        }
    }
};
</script>
