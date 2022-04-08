<template>
  <div id="app">
    <router-view name="header"></router-view>
    <vk-grid class="uk-flex-1" gutter="collapse" id="body-grid" :class="{ 'showNavigation': navigationIsHide }">
      <div class="uk-width-auto uk-position-relative uk-height-1-1">
        <transition name="app-router-fade" mode="out-in">
          <router-view name="aside"></router-view>
        </transition>
      </div>
      <transition name="app-router-fade" mode="out-in">
        <router-view :key="defaultViewKey" id="app-content" class="uk-width-expand uk-position-relative"></router-view>
      </transition>
    </vk-grid>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navigationIsHide: false
    }
  },
  computed: {
    defaultViewKey: function () {
      return this.$route.name;
    }
  },
  created: function () {

  }
}
</script>
<style>
@font-face {
  font-family: "PT Sans Narrow";
  src: url("assets/fonts/PTSansNarrow-Bold.ttf") format("ttf");
}
#app {
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
#app-content {

}

#app-content section {
  padding: 90px 10px 10px;
}

#body-grid {
  background: #f7f7f7 !important;
}
/*#body-grid > div:first-child {
  position: fixed !important;
  z-index: 1;
  height: calc(100% - 60px);
}*/

/*#body-grid > div:nth-child(2) {
  margin-left: 230px;
}*/

#body-grid > .uk-first-column {
  position: fixed !important;
}
#body-grid > div:nth-child(2) {
  margin-left: 220px;
}

@media only screen and (max-width: 868px) {
  #body-grid > div:first-child {
    z-index: 1;
    transition: left 0.4s linear;
    top: 0;
    left: -231px;
    border-right: 1px solid #dcdcdc;
    height: 100%;
    overflow-y: auto;
    padding-top: 40px;
    background-color: #f7f7f7;
  }

  #body-grid > div:nth-child(2) {
    margin-left: 0;
  }

  #body-grid.showNavigation > div:first-child {
    left: -0px;
  }

  #body-grid.showNavigation > div:nth-child(2) {

  }

  #app-content section {
    padding: 60px 10px 10px;
  }
}
</style>