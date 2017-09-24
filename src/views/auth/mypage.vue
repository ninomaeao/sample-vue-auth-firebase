<template>
  <div class="myPage">

    <h2>マイページ</h2>

    <el-tabs v-model="activeTab">

      <el-tab-pane label="プロフィール" name="profile">

        <h3>プロフィール</h3>

        <el-form ref="loginForm" label-position="left" label-width="6em" :rules="rules">
          <el-form-item label="画像" prop="name">
            <img :src="auth.profile.photoURL" class="auth-photo">
          </el-form-item>
          <el-form-item label="なまえ" prop="name">
            <div>{{ user.name }}</div>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-alert
                v-if="user.error"
                :title="user.error"
                type="error"
                style="margin-bottom: 1em"
            >
            </el-alert>
            <el-button type="primary" @click="update">更新</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>

      <el-tab-pane label="認証情報" name="auth">

        <h3>認証情報</h3>

        <table class="auth-table">
          <template v-if="auth.profile.providerId !== 'password'">
            <tr>
              <th><span>プロバイダ</span></th>
              <td>{{ auth.profile.providerId }}</td>
            </tr>
            <tr>
              <th><span>なまえ</span></th>
              <td>{{ auth.profile.displayName }}</td>
            </tr>
          </template>
          <tr v-if="auth.email">
            <th><i class="el-icon-message"></i><span>Email</span></th>
            <td>{{ auth.email }}<span class="email-verified-error" v-if="!auth.emailVerified">未認証</span></td>
          </tr>
        </table>

        <div v-if="!auth.emailVerified">
          <template v-if="!sendVerifyEmail">
            <el-button type="info" @click="verifyEmail">メールアドレスに認証メールを送信する</el-button>
          </template>
          <template v-else>
            <el-button type="primary" disabled>メールアドレスに認証メールを送信しました</el-button>
          </template>
        </div>

        <div style="margin: 2em 0;">
          <el-button @click="logout">ログアウト</el-button>
        </div>

      </el-tab-pane>
    </el-tabs>

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
        activeTab: 'profile',
        form: {
          name: "",
        },
        sendVerifyEmail: false,
        rules: {}
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      ...mapActions('user', {
        userUpdate: 'update'
      }),
      verifyEmail() {
        if (this.auth) {
          let auth = firebase.auth().currentUser;
          const vm = this;
          auth.sendEmailVerification().then(() => {
            vm.sendVerifyEmail = true
          }, (error) => {
            console.log(error)
          });
        }
      },
      update() {
        this.userUpdate({uid: this.auth.uid, name: this.form.name});
      },
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.go('/login');
        })
      },
      fetchData() {
        this.form.name = this.user.name;
        const vm = this;
        this.$store.dispatch('user/get', {
          uid: this.auth.uid,
          cb(err, user) {
            if (user) {
              vm.form.name = user.name;
            }
          }
        })
      },
    }
  }
</script>

<style>
  .myPage {
    max-width: 600px;
    margin: 0 auto;
  }

  .auth-table tr th {
    padding: 0.2em;
  }

  .email-verified-error {
    color: red;
    display: inline-block;
    margin-left: .5em;
  }

  table th span {
    display: inline-block;
    margin: 0 .5em;
  }
</style>