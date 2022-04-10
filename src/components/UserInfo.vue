<template>
  <div class="user-info-container">
    <div class="user-info">
      <div>
        <span>Это вы: {{ username }}</span>
      </div>
      <div class="logout">
        <a @click="onLogoutClick">Выйти из аккаунта</a>
      </div>
    </div>
  </div>
</template>

<script>
import Config from "../utils/Config";

export default {
  name: "UserInfo",
  methods: {
    onLogoutClick: function () {
      window.location.href = Config.data.api.http.logoutURL;
    },
  },
  computed: {
    username: function () {
      return this.$store.state.session.user.username
    }
  },
}
</script>

<style scoped>
  .user-info-container {
    display: none;
    position: absolute;
    width: 250px;
    right: 40px;
    top: 25px;
    padding: 25px;
    box-sizing: content-box;
  }
  .user-info {
    background-color: white;
    border: 1px solid #d4d4d4;
    border-radius: 6px;
    padding: 14px;
  }
</style>