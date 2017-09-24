import firebase from 'firebase'

const auth = {
  namespaced: true,
  state: {
    auth: false,
    uid: '',
    email: '',
    emailVerified: false,
    profile: {
      displayName: '',
      email: '',
      phoneNumber: '',
      photoURL: '',
      providerId: '',
      uid: '',
    },
    credential: null,
    providerIds: [],
    error: "",
  },
  getters: {
    auth: (state) => state,
  },
  mutations: {
    set(state, payload) {
      state.auth = true;
      state.uid = payload.uid;
      state.email = payload.email;
      state.emailVerified = payload.emailVerified;
      payload.providerData.forEach(function (profile) {
        if (profile.providerId !== "password") state.emailVerified = true;
        state.profile = profile;
        state.providerIds.push(profile.providerId);
      });
    },
    setCredential(state, payload) {
      state.credential = payload;
    },
    setEmail(state, payload) {
      state.email = payload.email;
      state.emailVerified = false;
    },
    setError(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    init({commit}) {
      return auth.actions.get({commit});
    },
    get({commit}) {
      return new Promise((resolve) => {
        firebase.auth().getRedirectResult().then((result) => {
          if (result.user) {
            commit('setCredential', result.credential);
            commit('set', result.user);
            resolve()
          } else {
            firebase.auth().onAuthStateChanged((user) => {
              if (user) commit('set', user);
              resolve()
            });
          }
        }).catch((error) => {
          commit('setError', error.message);
          resolve()
        })
      });
    },
    reload({commit}) {
      let user = firebase.auth().currentUser;
      user.reload().then(() => {
        commit('set', user);
      })
    },
    changeEmail({commit}, payload) {
      let user = firebase.auth().currentUser;
      let credential;
      credential = firebase.auth.EmailAuthProvider.credential(user.email, payload.password);
      if (credential) {
        user.reauthenticateWithCredential(credential).then(() => {
          user.updateEmail(payload.email).then(() => {
            commit('setEmail', {email: payload.email});
            payload.cb(null);
          }, (error) => {
            payload.cb(error);
          });
        }, (error) => {
          payload.cb(error);
        });
      }
    },
    changePassword({commit}, payload) {
      let user = firebase.auth().currentUser;
      let credential;
      credential = firebase.auth.EmailAuthProvider.credential(user.email, payload.oldPassword);
      if (credential) {
        user.reauthenticateWithCredential(credential).then(() => {
          user.updatePassword(payload.newPassword).then(() => {
            payload.cb(null);
          }, (error) => {
            payload.cb(error);
          });
        }, (error) => {
          payload.cb(error);
        });
      }
    },
    _getProvider({commit}, payload) {
      switch (payload.providerId) {
        case 'twitter.com':
          return new firebase.auth.TwitterAuthProvider();
        case 'google.com':
          return new firebase.auth.GoogleAuthProvider();
        case 'facebook.com':
          return new firebase.auth.FacebookAuthProvider();
      }
    },
    _getCredential({commit}, payload) {
      return new Promise((resolve, reject) => {
        let user = firebase.auth().currentUser;
        if (payload.providerId === "password") {
          const credential = firebase.auth.EmailAuthProvider.credential(user.email, payload.password);
          resolve(credential);
        }
        let provider = auth.actions._getProvider({commit}, payload);
        if (!auth.state.credential) {
          user.reauthenticateWithPopup(provider).then((result) => {
            resolve(result.credential);
          }).catch((error) => {
            reject(error);
          });
        } else {
          resolve(auth.state.credential);
        }
      });
    },
    deleteAccount({commit}, payload) {
      let user = firebase.auth().currentUser;
      auth.actions._getCredential({commit}, payload).then((credential) => {
        user.reauthenticateWithCredential(credential).then(() => {
          user.delete().then(() => {
            payload.cb(null);
          }, (error) => {
            payload.cb(error);
          });
        }, (error) => {
          payload.cb(error);
        });
      }).catch((error)=> {
        payload.cb(error);
      });
    },
  }
};

export default auth