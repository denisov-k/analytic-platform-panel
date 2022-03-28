<template>
  <div class="layouts--header">
    <div class="logo" v-on:click="onLogoClick">
      <img class="logo-icon" src="@/assets/images/logo-icon.png">
      <span>Analytic Platform</span>
    </div>
    <div class="right-header-part">
      <div class="profile-button">
        <img class="avatar" src="@/assets/images/avatar.png">
        <div class="user-menu">
          <div>
            <span>Это вы: {{ username }}</span>
          </div>
          <div class="logout">
            <a @click="onLogoutClick">Выйти из аккаунта</a>
          </div>
        </div>
      </div>
      <div class="navigation-button" @click="onNavigationButtonClick">
        <img src="@/assets/images/menu-icon.png">
      </div>
    </div>
  </div>
</template>
<script>
// FIXME: Move user-menu in standalone component
import Config from '../utils/Config';


export default {
  data() {
    return {
      avatarUrl: '' //'url(/img/avatar.a5e81f19.png)'
    }
  },
  computed: {
    username: function () {
      return this.$store.state.session.user.username
    }
  },
  methods: {
    "onLogoClick": function () {
      window.location.href = '/';
    },
    "onLogoutClick": function () {
      window.location.href = Config.data.api.http.logoutURL;
    },
    "onNavigationButtonClick": function () {
      this.$parent.navigationIsHide = !this.$parent.navigationIsHide;
    }
  },
  created: function () {

  }
}
</script>
<style scoped>
.layouts--header {
  background: #f5f5f5;
  z-index: 2;
  height: 68px;
  box-shadow: 0 1px 12px 3px rgba(218, 217, 217, 0.5);
}

.logo {
  display: inline-block;
  margin: 5px 20px;
  height: 58px;
}

.logo:hover {
  cursor: pointer;
}

.logo > span {
  /*font-family: "PTSansNarrow-Bold";
  font-size: 26px;*/
  font-size: 24px;
  line-height: 56px;
  font-weight: bold;
  color: #276377;
  margin: 0 10px;
  display: inline-block;
  /*line-height: 56px;*/
}

.logo-icon {
  width: 40px;
  display: inline-block;
  margin: 10px 0;
  float: left;
  -webkit-filter: opacity(.4) drop-shadow(0 0 0 #0468c1);
}

.right-header-part {
  display: inline-block;
  float: right;
  margin-right: 10px;
  vertical-align: middle;
}

.username {
  height: 100%;
  margin: auto;
  line-height: 64px;
  font-size: 18px;
  color: #276377;
}

.avatar {
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  -webkit-filter: opacity(.4) drop-shadow(0 0 0 #000000);
}

.user-menu {
  display: none;
  /*opacity: 0;
  transition: opacity .2s ease-in-out;*/

  position: absolute;
  width: 250px;
  right: 35px;
  background-color: white;
  border: 1px solid #d4d4d4;
  border-radius: 6px;
  padding: 14px;
}

.profile-button:hover .user-menu {
  display: block;
  /*opacity: 1;*/
}

.profile-button:hover .avatar {
  opacity: 1;
}

.profile-button {
  width: 46px;
  height: 46px;
  display: inline-block;
  margin: 11px;
  border-radius: 50%;
  overflow: hidden;
}

.navigation-button {
  width: 40px;
  height: 40px;
  display: none;
  float: right;
  margin: 5px 0 5px 0;
  -webkit-filter: opacity(.4) drop-shadow(0 0 0 #0468c1);
}

.logout {
  margin-top: 5px;
}

@media only screen and (min-width: 868px) {
  .menu-button {
    display: none;
  }
}

@media only screen and (max-width: 868px) {
  .layouts--header {
    height: 50px;
    min-height: 50px !important;
  }

  .logo span {
    font-size: 20px !important;
    line-height: 42px !important;
  }

  .logo img {
    width: 24px !important;
  }

  img.avatar {
    width: 32px !important;
    height: 32px !important;
  }

  .navigation-button {
    display: inline-block;
  }

  .profile-button {
    margin: 9px;
    width: unset;
    height: unset;
  }

}
</style>