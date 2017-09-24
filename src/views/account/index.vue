<template>
  <div class="settings">

    <h2>アカウント</h2>

    <el-tabs v-model="activeTab" @tab-click="changeTab">

      <el-tab-pane label="プロフィール" name="profile">
        <profile></profile>
      </el-tab-pane>

      <el-tab-pane label="認証情報" name="auth">
        <auth></auth>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import firebase from 'firebase'
  import profile from './_profile.vue';
  import auth from './_auth.vue';

  export default {
    components: {
      profile,
      auth,
    },
    data() {
      return {
        activeTab: 'profile',
      }
    },
    methods: {
      changeTab(tab, event) {
        if (tab.name === "auth") {
          this.$store.dispatch('auth/reload')
        }
      },
    }
  }
</script>

<style>
  .settings {
    max-width: 600px;
    margin: 0 auto;
  }
</style>