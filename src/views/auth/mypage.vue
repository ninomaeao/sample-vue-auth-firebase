<template>
  <div>
    <h2>マイページ</h2>

    <table>
      <template v-if="user.profile.providerId !== 'password'">
        <tr>
          <th><span>プロバイダ</span></th>
          <td>{{ user.profile.providerId }}</td>
        </tr>
        <tr>
          <th><span>なまえ</span></th>
          <td>{{ user.profile.displayName }}</td>
        </tr>
      </template>
      <tr v-if="user.email">
        <th><i class="el-icon-message"></i><span>Email</span></th>
        <td>{{ user.email }}<span class="email-verified-error" v-if="!user.emailVerified">未認証</span></td>
      </tr>
    </table>

    <div v-if="!user.emailVerified">
      <template v-if="!sendVerifyEmail">
        <el-button type="info" @click="verifyEmail">メールアドレスに認証メールを送信する</el-button>
      </template>
      <template v-else>
        <el-button type="primary" disabled>メールアドレスに認証メールを送信しました</el-button>
      </template>
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
    data() {
      return {
        sendVerifyEmail: false,
      }
    },
    methods: {
      verifyEmail() {
        if (this.user) {
          let user = firebase.auth().currentUser;
          let that = this;
          user.sendEmailVerification().then(function () {
            // Email sent.
            that.sendVerifyEmail = true
          }, function (error) {
            // An error happened.
          });
        }
      }
    }
  }
</script>

<style>
  .email-verified-error {
    color: red;
    display: inline-block;
    margin-left: .5em;
  }

  table th {
    display: inline-block;
    margin: 0 .5em;
  }
</style>