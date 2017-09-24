<template>
  <div id="app">

    <!-- メニュー -->

    <el-menu theme="dark" :default-active="this.$route.name" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="top">
        <router-link to="/">トップ</router-link>
      </el-menu-item>
      <el-menu-item index="account" v-if="auth.auth">
        <router-link to="/account">アカウント</router-link>
      </el-menu-item>
      <el-menu-item index="login" v-else>
        <router-link to="/login">ログイン</router-link>
      </el-menu-item>
    </el-menu>

    <!-- コンテンツ -->

    <main>
      <template v-if="!this.$route.meta.side">
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
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'app',
    computed: {
      ...mapGetters('auth', ['auth']),
    },
    components: {
      sideCommon
    },
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
