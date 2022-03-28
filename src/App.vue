<template>
  <div id="app">
    <router-view name="header"></router-view>
    <vk-grid class="uk-flex-1" gutter="collapse" id="body-grid" :class="{ 'showNavigation': navigationIsHide }">
      <div class="uk-width-auto uk-position-relative uk-height-1-1">
        <transition name="app-router-fade" mode="out-in">
          <router-view name="aside"></router-view>
        </transition>
      </div>
      <div class="uk-width-expand uk-position-relative">
        <transition name="app-router-fade" mode="out-in">
          <router-view :key="defaultViewKey" id="app-content"></router-view>
        </transition>
      </div>
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
  position: inherit;
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

@media only screen and (max-width: 868px) {
  #body-grid > div {
    position: fixed !important;
  }

  #body-grid > div:first-child {
    z-index: 1;
    transition: left 0.4s linear;
    top: 0px;
    left: -231px;
    border-right: 1px solid #dcdcdc;
    height: 100%;
    overflow-y: auto;
    padding-top: 40px;
    background-color: #f7f7f7;
  }

  #body-grid > div:nth-child(2) {
    margin-left: 0px;
    position: inherit !important;
    display: inline-grid;
  }

  #body-grid.showNavigation > div:first-child {
    left: -0px;
  }

  #body-grid.showNavigation > div:nth-child(2) {

  }

  #app-content section {
    padding: 10px;
  }

  .search-input-container {
    max-width: 100%;
  }

  .uk-card-body {
    padding: 15px 15px !important;
  }

  .uk-card-header {
    padding: 15px 15px !important;
  }

  .uk-card-header h2 {
    font-size: 22px;
  }
}
</style>