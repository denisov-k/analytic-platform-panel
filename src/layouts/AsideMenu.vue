<template>
  <ul>
    <li v-for="menuItem in menuItems" :key="menuItem.path">
      <router-link :to="menuItem.name ? { name: menuItem.name } : menuItem.path"
                   :exact-active-class="menuExactActiveClass(menuItem)" active-class="active" exact>
        {{ menuItem.meta.title }}
      </router-link>
      <aside-menu class="uk-nav-sub" v-if="menuItem.children.length" :menu="menuItem.children"></aside-menu>
    </li>
  </ul>
</template>
<script>
import AuthUtils from './../utils/AuthUtils';

export default {
  name: 'aside-menu',
  props: {
    menu: {
      type: Array,
      required: true,
      default: function () {
        return {};
      }
    }
  },
  computed: {
    menuItems: function () {
      return this.menu.filter((elem) => elem.meta.visible && this.checkRouteGroups(elem));
    }
  },
  methods: {
    menuExactActiveClass: function (menuItem) {
      return menuItem.redirect == null ? 'active-exact' : 'active-exact-redirect'
    },
    checkRouteGroups(route) {
      return AuthUtils.hasGroupsAll(this.$store.state.session.user.groups, route.meta.authGroups);
    }
  }
}
</script>
<style>
.uk-nav {
  float: none;
  clear: both;
  /*width: 30%;
  margin: 10% auto;
  background: #eee;*/
}

ul.uk-nav {
  display: table-cell;
  vertical-align: middle;
}

.uk-nav li {
  float: none;
  width: 100%;
}

.uk-nav li a {
  display: block;
  width: 100%;
  /*padding: 20px;
  border-left: 5px solid;*/
  position: relative;
  z-index: 2;
  text-decoration: none;
  color: #444;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  background: unset !important;
}

.uk-nav li a:hover {
  border-bottom: 0px;
  color: #fff;
}

.uk-nav li a:after {
  background: #00000017 !important;
}

.uk-nav li a:after {
  content: "";
  height: 100%;
  left: 0;
  top: 0;
  width: 0px;
  position: absolute;
  transition: all 0.3s ease 0s;
  -webkit-transition: all 0.3s ease 0s;
  z-index: -1;
}

.uk-nav li a:hover:after {
  width: 100%;
}

.menu-holder {
  display: table;
  height: calc(100% - 42px);
  color: black;
}

.layouts--aside {
  background: #f7f7f7 !important;
}
</style>