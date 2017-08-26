import firebase from 'firebase'

const auth = {
  namespaced: true,
  state: {
    user: {}
  },
  getters: {
    user: (state) => state.user
  },
  mutations: {
    set (state, payload) {
      state.user = payload
    }
  },
  actions: {
    init({commit}) {
      return new Promise((resolve) => {
        // Twitter認証完了後の処理
        firebase.auth().getRedirectResult().then(function (result) {
          if (result.credential) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            let token = result.credential.accessToken;
            let secret = result.credential.secret;
          }
          let profile = {
            auth: false,
            uid: null,
            email: null,
            displayName: null
          };
          let user = result.user;
          if (user) {
            profile = {
              auth: true,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName
            }
          }
          commit('set', profile);
          resolve()
        }).catch(function (error) {
          console.log(error);
          // Handle Errors here.
          let errorCode = error.code;
          let errorMessage = error.message;
          // The email of the user's account used.
          let email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          let credential = error.credential;
          // ...
        });

        // 現在ログインしているユーザーを取得
        firebase.auth().onAuthStateChanged((user) => {
          let profile = {
            auth: false,
            uid: '',
            email: '',
            displayName: ''
          };
          if (user) {
            profile = {
              auth: true,
              uid: user.uid,
              email: user.email,
              displayName: user.email
            }
          }
          commit('set', profile);
          resolve()
        })
      })
    }
  }
};

export default auth