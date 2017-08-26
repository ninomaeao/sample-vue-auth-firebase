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
        <el-button type="primary" @click="login">ログイン</el-button>
        <el-button type="primary" @click="twitter">Twitterでログイン</el-button>
        <el-button @click="resetForm('loginForm')">リセット</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      return {
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
          firebase.auth().signInWithEmailAndPassword(this.form.email, this.form.password)
        }
      },
      logout() {
        firebase.auth().signOut()
      },
      twitter() {
        const provider = new firebase.auth.TwitterAuthProvider();
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
</style>