import firebase from 'firebase'

const auth = {
  namespaced: true,
  state: {
    user: {
      auth: false,
      uid: '',
      email: '',
      displayName: '',
      emailVerified: false,
      profile: null,
    }
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    set(state, payload) {
      state.user = payload
    }
  },
  actions: {
    init({commit}) {
      return new Promise((resolve) => {
        // 現在ログインしているユーザーを取得
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            let _user = {
              auth: true,
              uid: user.uid,
              email: user.email,
              displayName: user.email,
              emailVerified: user.emailVerified,
              profile: null,
            };
            user.providerData.forEach(function (profile) {
              _user.profile = profile;
              if (profile.providerId !== "password") {
                _user.emailVerified = true;
                _user.displayName = profile.displayName;
              }
            });
            commit('set', _user);
          }
          resolve()
        });

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
            let _user = {
              auth: true,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: true,
              profile: null,
            };
            user.providerData.forEach(function (profile) {
              _user.profile = profile;
            });
            console.log(_user.profile);
            commit('set', _user);
          }
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
      })
    }
  }
};

export default auth