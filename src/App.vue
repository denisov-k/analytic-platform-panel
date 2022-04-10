<template>
  <div id="app">
    <router-view name="header"></router-view>
    <vk-grid class="uk-flex-1" gutter="collapse" id="body-grid" :class="{ 'showNavigation': showNavigation }">
      <div class="uk-width-auto uk-position-relative uk-height-1-1" id="sidebar">
        <transition name="app-router-fade" mode="out-in">
          <router-view name="aside"></router-view>
        </transition>
      </div>
      <transition name="app-router-fade" mode="out-in">
        <router-view :key="defaultViewKey" id="app-content"></router-view>
      </transition>
    </vk-grid>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        showNavigation: true
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
    margin-right: 0;
    width: calc(100% - 220px);
    margin-left: auto;
  }

  #app-content section {
    padding: 80px 10px 10px;
  }

  #body-grid {
    background: #f7f7f7 !important;
  }

  #sidebar {
    position: fixed !important;
    z-index: 1;
    top: 0;
    left: -231px;
    height: 100%;
    overflow-y: auto;
    padding-top: 40px;
    background-color: #f7f7f7;
  }

  .showNavigation #sidebar {
    left: 0;
  }
  :not(.showNavigation) > #app-content {
    width: 100%;
  }

  @media only screen and (max-width: 868px) {
    #app-content section {
      padding: 60px 10px 10px;
    }
    #sidebar {
      border-right: 1px solid #dcdcdc;
    }
    #app-content {
      width: 100%;
    }
  }
</style>