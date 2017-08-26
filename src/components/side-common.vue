<template>
  <div class="box">
    <div v-if="user">
      <div class="user-photoURL">
        <img :src="user.photoURL">
      </div>
      <div class="user-displayName">{{ user.displayName }}</div>
      <el-button @click="logout">ログアウト</el-button>
    </div>
    <div v-else>
      <router-link to="/login">ログイン</router-link>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  import firebase from 'firebase'

  export default {
    data() {
      return {
        user: null
      }
    },
    methods: {
      logout() {
        firebase.auth().signOut().then(() => {
          router.go('/login');
        })
      },
    },
    created() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.user = user;
          user.providerData.forEach(function (profile) {
            console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL);
          });
        } else {
          this.user = null
        }
      })
    }
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