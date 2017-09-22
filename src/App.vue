<template>
  <div id="app">
    <el-menu theme="dark" :default-active="this.$route.name" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="top">
        <router-link to="/">トップ</router-link>
      </el-menu-item>
      <el-menu-item index="myPage" v-if="user">
        <router-link to="/myPage">マイページ</router-link>
      </el-menu-item>
      <el-menu-item index="login" v-if="!user">
        <router-link to="/login">ログイン</router-link>
      </el-menu-item>
    </el-menu>
    <main>
      <template v-if="this.$route.name === 'login' || this.$route.name === 'register'">
        <el-row :gutter="24">
          <el-col :sm="24" class="contents">
            <router-view></router-view>
          </el-col>
        </el-row>
      </template>
      <template v-else>
        <el-row :gutter="24">
          <el-col :sm="18" class="contents">
            <router-view></router-view>
          </el-col>
          <el-col :sm="6" class="sidebar">
            <side-common></side-common>
          </el-col>
        </el-row>
      </template>
    </main>
  </div>
</template>

<script>
  import sideCommon from './components/side-common.vue';
  import moment from 'moment'
  import firebase from 'firebase'

  export default {
    name: 'app',
    data() {
      return {
        user: null
      }
    },
    components: {
      sideCommon
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user
        }
      })
    }
  }
</script>

<style lang="scss">
  @import "./main";

  #app {
    background: $mainColor;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 5px;
  }

  header {
    padding: 30px 0;
    text-align: center;
    color: $accentColor;
  }

  nav ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    background: $mainColorDark;
    margin: 0 10px;
    padding: 10px;
    li {
      list-style: none;
    }
  }

  main {
    .contents {
      h2 {
        color: $accentColor;
        margin: 1em 0 1em;
        font-weight: bold;
        font-size: 24px;
      }
      h3 {
        margin: 1em 0;
      }
    }
  }

  .el-menu-item, .el-submenu__title {
    padding: 0;
    a {
      display: block;
      padding: 0 20px;
    }
  }

</style>
