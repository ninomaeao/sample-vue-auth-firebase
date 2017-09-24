<template>
  <div>

    <h2>ユーザー登録</h2>

    <el-form ref="registerForm" label-position="left" label-width="9em" :model="registerForm" :rules="rules"
             v-loading.body="loading">
      <el-form-item label="メールアドレス" prop="email">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>
      <el-form-item label="パスワード" prop="password">
        <el-input v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item label="パスワード確認" prop="passwordConfirm">
        <el-input v-model="registerForm.passwordConfirm"></el-input>
      </el-form-item>
      <el-form-item>
        <el-alert
            v-if="registerForm.error"
            :title="registerForm.error"
            type="error"
            style="margin-bottom: 1em"
        >
        </el-alert>
        <el-button type="primary" @click="submitForm('registerForm')">ユーザーを登録する</el-button>
        <el-button @click="resetForm('registerForm')">リセット</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value !== '') {
          if (this.registerForm.passwordConfirm !== '') {
            this.$refs.registerForm.validateField('passwordConfirm');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value !== '' && value !== this.registerForm.password) {
          callback(new Error('Two inputs don\'t match!'));
        } else if (value !== '') {
          callback();
        }
      };
      return {
        loading: false,
        registerForm: {
          email: '',
          password: '',
          passwordConfirm: '',
          error: "",
        },
        rules: {
          email: [
            {required: true, message: 'Please input email address', trigger: 'blur'},
            {type: 'email', message: 'Please input correct email address', trigger: 'blur'}
          ],
          password: [
            {required: true, message: 'Please input password', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 30, message: 'Length should be 6 to 30', trigger: 'blur'}
          ],
          passwordConfirm: [
            {required: true, message: 'Please input confirm password', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const vm = this;
            firebase.auth().createUserWithEmailAndPassword(this.registerForm.email, this.registerForm.password).catch(function (error) {
              this.loading = false;
              vm.registerForm.error = error.message;
            }).then(function (user) {
              if (user) {
                vm.$router.go('/account')
              }
            })
          }
        });
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