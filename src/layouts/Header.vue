<template>
  <div class="layouts--header">
    <div class="logo" v-on:click="onLogoClick">
      <inline-svg :src="require('@/assets/images/logo-icon.svg')"  class="logo-icon" />
      <span>Analytic Platform</span>
    </div>
    <div class="buttons-group">
      <div class="profile-button">
        <inline-svg :src="require('@/assets/images/profile-icon.svg')"  class="avatar" />
        <user-info></user-info>
      </div>
      <div class="navigation-button" @click="onNavigationButtonClick">
        <inline-svg :src="require('@/assets/images/menu-icon.svg')" />
      </div>
    </div>
  </div>
</template>
<script>
// FIXME: Move user-menu in standalone component
import Config from '../utils/Config';

import UserInfo from "@/components/UserInfo";
import InlineSvg from 'vue-inline-svg';

export default {
  components: {
    InlineSvg,
    UserInfo
  },
  data() {
    return {
      avatarUrl: '' //'url(/img/avatar.a5e81f19.png)'
    }
  },
  methods: {
    onLogoClick: function () {
      window.location.href = '/';
    },
    onNavigationButtonClick: function () {
      this.$parent.showNavigation = !this.$parent.showNavigation;
    }
  },
  created: function () {

  }
}
</script>
<style scoped>
.layouts--header {
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #f5f5f5;
  z-index: 2;
  height: 60px;
  box-shadow: 0 1px 12px 3px rgba(218, 217, 217, 0.5);
}

.logo {
  display: flex;
  margin: 5px 20px;
}

.logo:hover {
  cursor: pointer;
}

.logo > span {
  font-size: 22px;
  font-weight: bold;
  color: #276377;
  margin: 0 10px;
  display: inline-block;
  align-self: center;
}

.logo-icon {
  width: 30px;
  height: -webkit-fill-available;
  display: inline-block;
  margin: auto;
  float: left;
  fill: #276377;
}

.buttons-group {
  display: flex;
  float: right;
  margin-right: 10px;
  vertical-align: middle;
  fill: #276377;
}

.username {
  height: 100%;
  margin: auto;
  line-height: 64px;
  font-size: 18px;
  color: #276377;
}

.avatar {

}



.profile-button:hover .user-info-container {
  display: block;
  /*opacity: 1;*/
}

.profile-button:hover .avatar {

}

.profile-button {
  width: 30px;
  height: 30px;
  display: inline-block;
  margin: auto 4px;
  border-radius: 50%;
  overflow: hidden;
}

.navigation-button {
  width: 18px;
  float: right;
  margin: auto 4px;
  display: flex;
  padding: 6px;
  cursor: pointer;
}
.navigation-button:hover {
  background-color: #dedede;
  border-radius: 15px;
}

.logout {
  margin-top: 5px;
}

@media only screen and (max-width: 868px) {
  .layouts--header {
    height: 50px;

  }

  .logo span {
    font-size: 20px !important;
    line-height: 42px !important;
  }

  .navigation-button {

  }

  .profile-button {

  }

}
@media only screen and (max-width: 400px) {
  .logo span {
    display: none;
  }
}
</style>