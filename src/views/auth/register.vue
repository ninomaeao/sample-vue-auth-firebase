<template>
  <div>

    <h2>ユーザー登録</h2>

    <el-form ref="registerForm" label-position="left" label-width="9em" :model="registerForm" :rules="rules">
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
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.registerForm.passwordConfirm !== '') {
            this.$refs.registerForm.validateField('passwordConfirm');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        registerForm: {
          email: '',
          password: '',
          passwordConfirm: '',
        },
        rules: {
          email: [
            {required: true, message: 'Please input email address', trigger: 'blur'},
            {type: 'email', message: 'Please input correct email address', trigger: 'blur,change'}
          ],
          password: [
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 30, message: 'Length should be 6 to 30', trigger: 'blur'}
          ],
          passwordConfirm: [
            {validator: validatePass2, trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let that = this;
            firebase.auth().createUserWithEmailAndPassword(this.registerForm.email, this.registerForm.password)
              .catch(function (error) {
                // Handle Errors here.
                let errorCode = error.code;
                let errorMessage = error.message;
                if (errorCode == 'auth/weak-password') {
                  alert('The password is too weak.');
                } else {
                  alert(errorMessage);
                }
                console.log(error);
              }).then(function (user) {
              if (user) {
                that.$router.go('/mypage')
              }
            })
          } else {
            console.log('error submit!!');
            return false;
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