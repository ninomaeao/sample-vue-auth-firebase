<template>
  <div>
    <h3>プロフィール</h3>

    <el-form ref="userForm" label-position="left" label-width="6em">
      <el-form-item label="画像" prop="name" v-if="auth.profile.photoURL">
        <img :src="auth.profile.photoURL" class="auth-photo">
      </el-form-item>
      <el-form-item label="なまえ" prop="name">
        <div>{{ user.name }}</div>
        <el-input v-model="userForm.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-alert
            v-if="user.error"
            :title="user.error"
            type="error"
            style="margin-bottom: 1em"
        >
        </el-alert>
        <el-button type="primary" @click="updateUser">更新</el-button>
      </el-form-item>
    </el-form>
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
      return {
        userForm: {
          name: "",
        },
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      updateUser() {
        this.$store.dispatch('user/update', {
          uid: this.auth.uid,
          name: this.userForm.name
        });
      },
      fetchData() {
        this.userForm.name = this.user.name;
        const vm = this;
        this.$store.dispatch('user/get', {
          uid: this.auth.uid,
          cb(err, user) {
            if (user) {
              vm.userForm.name = user.name;
            }
          }
        })
      },
    }
  }
</script>

<style scoped>
  .auth-photo {
    width: 60px;
  }

  table th span {
    display: inline-block;
    margin: 0 .5em;
  }
</style>