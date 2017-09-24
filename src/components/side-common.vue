<template>
  <div class="box">

    <!-- サイドバー -->

    <div v-if="auth.auth">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="auth-photoURL" v-if="auth.profile.photoURL">
            <img :src="auth.profile.photoURL" class="auth-photo">
          </div>
          <span style="font-size: 12px; "><router-link to="/myPage">{{ name }}</router-link></span>
        </div>
        <div style="text-align: center; ">
          <el-button @click="logout">ログアウト</el-button>
        </div>
      </el-card>
    </div>
    <div v-else>
      <div style="text-align: right; ">
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
      ...mapGetters('auth', ['auth']),
      ...mapGetters('user', ['user']),
    },
    data() {
      return {
        name: "",
      }
    },
    methods: {
      ...mapActions('user', ['get']),
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.go('/login');
        })
      },
      login() {
        this.$router.go('/login');
      },
    },
    created() {
      if (this.auth.auth) {
        this.name = this.user.name;
        const vm = this;
        this.get({
          uid: this.auth.uid,
          cb: (err, user) => {
            if (user.name) {
              vm.name = user.name
            } else {
              vm.name = "名無し"
            }
          }
        });
      }
    },
  }
</script>

<style scoped>
  .box {
    padding: 5px;
    margin: 5px;
  }

  .auth-photo {
    max-width: 60px;
  }

  .auth-displayName {
    font-size: 12px;
  }
</style>