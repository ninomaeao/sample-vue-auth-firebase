<template>
  <div class="box">
    <div v-if="user.auth">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="user-photoURL" v-if="user.profile.photoURL">
            <img :src="user.profile.photoURL">
          </div>
          <span style="font-size: 12px; "><router-link to="/myPage">{{ user.displayName }}</router-link></span>
        </div>
        <div style="text-align: center; ">
          <el-button @click="logout">ログアウト</el-button>
        </div>
      </el-card>
    </div>
    <div v-else>
      <div style="text-align: center; ">
        <router-link tag="el-button" to="/login">ログイン</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
    },
    methods: {
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.go('/login');
        })
      },
      login() {
        this.$router.go('/login');
      },
    },
  }
</script>

<style scoped>
  .box {
    padding: 5px;
    margin: 5px;
  }

  .user-displayName {
    font-size: 12px;
  }
</style>