<template>
  <div>

    <h3>認証情報</h3>

    <div>
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
          <th><i class="el-icon-message"></i><span>メールアドレス</span></th>
          <td>
            {{ auth.email }}<span class="email-verified-error" v-if="!auth.emailVerified">未認証</span>

            <template v-if="auth.profile.providerId === 'password'">
              <el-button type="text" @click="dialogChangeEmailForm = true">Change</el-button>
              <el-alert
                  v-if="changeEmailForm.error"
                  :title="changeEmailForm.error"
                  type="error"
                  style="margin-bottom: 1em"
              >
              </el-alert>
            </template>
          </td>
        </tr>
        <tr v-if="auth.email">
          <th></th>
          <td>

            <!-- メールアドレス認証 -->

            <div v-if="!auth.emailVerified">
              <template v-if="!sendedVerifyEmail">
                <el-button type="warning" @click="sendEmailVerification">認証メールを送信する</el-button>
              </template>
              <template v-else>
                <el-button type="primary" disabled>認証メールを送信しました</el-button>
              </template>
            </div>
          </td>
        </tr>
      </table>

      <template v-if="auth.profile.providerId === 'password'">
        <el-dialog title="Change email" size="small" :visible.sync="dialogChangeEmailForm" v-loading.body="loading.changeEmailForm">
          <el-form ref="changeEmailForm">
            <el-form-item label="New email">
              <el-input v-model="changeEmailForm.newEmail" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="Password">
              <el-input v-model="changeEmailForm.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChangeEmailForm = false">Cancel</el-button>
            <el-button type="primary" @click="changeEmail">Confirm</el-button>
          </div>
        </el-dialog>
      </template>
    </div>

    <template v-if="auth.profile.providerId === 'password'">

      <h3>パスワードの変更</h3>

      <el-form ref="changePasswordForm" label-position="top"
               :model="changePasswordForm"
               :rules="changePasswordFormRules"
               v-loading.body="loading.changePasswordForm">
        <el-form-item label="Old password" prop="oldPassword">
          <el-input v-model="changePasswordForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="New password" prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="Confirm new password" prop="confirmPassword">
          <el-input v-model="changePasswordForm.confirmPassword"></el-input>
        </el-form-item>
        <el-alert
            v-if="changePasswordForm.error"
            :title="changePasswordForm.error"
            type="error"
            style="margin-bottom: 22px"
        >
        </el-alert>
        <el-alert
            v-if="changePasswordForm.success"
            :title="changePasswordForm.success"
            type="success"
            style="margin-bottom: 22px"
        >
        </el-alert>
        <el-form-item>
          <template v-if="!sendedPasswordResetEmail">
            <el-button type="info" @click="changePassword">パスワード変更</el-button>
          </template>
          <template v-else>
            <el-button type="primary" disabled>パスワードを変更</el-button>
          </template>
          <el-button @click="resetForm('changePasswordForm')">リセット</el-button>
        </el-form-item>
      </el-form>

    </template>

    <div style="margin: 2em 0;">
      <el-button @click="logout">ログアウト</el-button>
      <el-button :plain="true" type="danger" @click="dialogDeleteAccountForm = true">アカウント削除</el-button>

      <el-dialog title="Delete account" :visible.sync="dialogDeleteAccountForm" v-loading.body="loading.deleteAccountForm">
        <span>Once you delete your account, there is no going back. Please be certain.</span>

        <template v-if="auth.profile.providerId === 'password'">
          <el-form ref="deleteAccountForm">
            <el-form-item label="Password">
              <el-input v-model="deleteAccountForm.password" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
        </template>

        <el-alert
            v-if="deleteAccountForm.error"
            :title="deleteAccountForm.error"
            type="error"
            style="margin: 1em 0;"
            :closable="false"
        >
        </el-alert>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogDeleteAccountForm = false; deleteAccountForm.error = ''">Cancel</el-button>
          <el-button type="danger" @click="deleteAccount">Delete</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters('auth', ['auth']),
      ...mapGetters('user', ['user']),
    },
    data() {
      let validatePass = (rule, value, callback) => {
        if (value !== '') {
          if (this.changePasswordForm.confirmPassword !== '') {
            this.$refs.changePasswordForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value !== '' && value !== this.changePasswordForm.newPassword) {
          callback(new Error('Two inputs don\'t match!'));
        } else if (value !== '') {
          callback();
        }
      };
      return {
        loading: {
          changeEmailForm: false,
          changePasswordForm: false,
          deleteAccountForm: false,
        },
        dialogChangeEmailForm: false,
        changePasswordForm: {
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
          error: "",
        },
        changeEmailForm: {
          newEmail: "",
          password: "",
          error: "",
          success: "",
        },
        dialogDeleteAccountForm: false,
        deleteAccountForm: {
          password: "",
          error: "",
        },
        sendedVerifyEmail: false,
        sendedPasswordResetEmail: false,
        changePasswordFormRules: {
          oldPassword: [
            {min: 6, max: 30, message: 'Length should be 6 to 30', trigger: 'blur'}
          ],
          newPassword: [
            {validator: validatePass, trigger: 'blur'},
            {min: 6, max: 30, message: 'Length should be 6 to 30', trigger: 'blur'}
          ],
          confirmPassword: [
            {validator: validatePass2, trigger: 'blur'},
          ]
        }
      }
    },
    methods: {
      sendEmailVerification() {
        if (this.auth.email) {
          let user = firebase.auth().currentUser;
          const vm = this;
          user.sendEmailVerification().then(() => {
            vm.sendedVerifyEmail = true;
            let user = firebase.auth().currentUser;
            console.log(user);
          }, (error) => {
            console.log(error)
          });
        }
      },
      changeEmail() {
        const form = this.changeEmailForm;
        if (form.newEmail && form.password) {
          const vm = this;
          vm.loading.changeEmailForm = true;
          vm.loadingChangeEmailForm = true;
          this.$store.dispatch('auth/changeEmail', {
            email: form.newEmail,
            password: form.password,
            cb(error) {
              if (error) {
                form.error = error.message;
              } else {
                vm.sendedVerifyEmail = false;
                form.error = "";
              }
              vm.loading.changeEmailForm = false;
              vm.loadingChangeEmailForm = false;
              vm.dialogChangeEmailForm = false;
              vm.resetForm("changeEmailForm");
            }
          });
        }
      },
      changePassword() {
        const form = this.changePasswordForm;
        if (form.oldPassword && form.newPassword && form.newPassword === form.confirmPassword) {
          const vm = this;
          vm.loading.changePasswordForm = true;
          this.$store.dispatch('auth/changePassword', {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
            cb(error) {
              if (error) {
                form.error = error.message;
              } else {
                form.error = "";
                form.success = "パスワードを変更しました";
              }
              vm.loading.changePasswordForm = false;
              vm.resetForm("changePasswordForm");
            }
          });
        }
      },
      logout() {
        firebase.auth().signOut().then(() => {
          this.$router.go('/login');
        })
      },
      deleteAccount() {
        const providerId = this.auth.profile.providerId;
        let password;
        const form = this.deleteAccountForm;
        if (providerId === 'password') {
          password = form.password;
          if (!password) {
            return;
          }
        }
        this.loading.deleteAccountForm = true;
        const vm = this;
        this.$store.dispatch('auth/deleteAccount', {
          providerId: providerId,
          password: password,
          cb(error) {
            if (error) {
              form.error = "認証に失敗しました";
            } else {
              form.error = "";
              vm.$router.go('/login');
            }
            vm.loading.deleteAccountForm = false;
            vm.resetForm("deleteAccountForm");
          }
        });
      },
      resetForm(formName) {
        if (this.$refs[formName]) this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
  .auth-table tr th {
    padding: 0.5em;
  }

  .email-verified-error {
    color: red;
    display: inline-block;
    margin-left: .5em;
  }
</style>