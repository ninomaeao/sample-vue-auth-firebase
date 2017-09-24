<template>
  <div>

    <h2>ログイン</h2>

    <el-form ref="loginForm" label-position="left" label-width="9em" :model="form" :rules="rules">
      <el-form-item label="メールアドレス" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="パスワード" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-alert
            v-if="error"
            :title="error"
            type="error"
            style="margin-bottom: 1em"
        >
        </el-alert>
        <el-alert
            v-if="auth.error"
            :title="auth.error"
            type="error"
            style="margin-bottom: 1em"
        >
        </el-alert>
        <el-button type="primary" @click="login">ログイン</el-button>
        <el-button @click="resetForm('loginForm')">リセット</el-button>
      </el-form-item>
      <el-form-item class="sns-buttons">
        <el-button type="primary" @click="twitter">Twitterでログイン</el-button>
        <el-button type="primary" @click="google">Googleでログイン</el-button>
        <el-button type="primary" @click="facebook">Facebookでログイン</el-button>
      </el-form-item>
      <div style="text-align: center;">
        <router-link to="/register">ユーザー登録はこちら</router-link>
      </div>
    </el-form>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    computed: {
      ...mapGetters('auth', ['auth']),
    },
    data() {
      return {
        error: "",
        form: {
          email: '',
          password: '',
        },
        rules: {
          email: [
            {required: true, message: 'Please input email address', trigger: 'blur'},
            {type: 'email', message: 'Please input correct email address', trigger: 'blur,change'}
          ],
          password: [
            {required: true, message: 'Please input password', trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      login() {
        if (this.form.email && this.form.password) {
          const vm = this;
          firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password).catch((error) => {
            vm.error = error.message;
          }).then((user) => {
            if (user) {
              vm.$router.go('/mypage')
            }
          })
        }
      },
      logout() {
        firebase.auth().signOut()
      },
      twitter() {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      },
      google() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      },
      facebook() {
        const provider = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>

<style scoped>
  form {
    width: 90%;
    max-width: 500px;
    margin: 0 auto;
  }

  h2 {
    text-align: center;
  }

  .sns-buttons button {
    margin: 0;
    font-size: 12px;
    padding: 7px 8px;
  }
</style>