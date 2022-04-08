<template>
  <div class="sidebar uk-position-relative uk-height-1-1">
    <div class="layouts--aside uk-width-medium uk-height-1-1">
      <div class="uk-flex uk-flex-column uk-height-1-1">
        <div class="menu-holder">
          <aside-menu class="uk-nav uk-nav-default uk-padding uk-padding-remove-left uk-padding-remove-right"
                      :menu="menu"></aside-menu>
        </div>
        <div class="version-info">
          <!--<img class="logo-icon" src="@/assets/images/logo-icon-2.png">
          <div class="uk-padding-small uk-text-small">v.{{appVersion}} ({{appRev}})</div>-->
          <div class="uk-padding-small uk-text-small">v.{{ appVersion }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AsideMenu from './AsideMenu';
import Config from '../utils/Config';
import {version as appVersion} from '../../package.json';

export default {
  components: {
    AsideMenu
  },
  data() {
    return {
      appVersion
    }
  },
  computed: {
    menu: function () {
      return this.$router.options.routes;
    },
    appRev: function () {
      return Config.rev;
    }
  },
}
</script>
<style>
.sidebar {
  max-width: 230px;
}

.version-info {
  padding: 0 10px;
  color: #babfc3;
  user-select: none;
}

.version-info img {
  width: 40px;
  padding-top: 4px;
}

.uk-padding-small {
  padding: 0 5px !important;
  display: inline-block;
}
</style>
