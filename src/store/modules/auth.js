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
        state.emailVerified = true;
        state.profile = profile;
        state.providerIds.push(profile.providerId);
      });
    },
    setError(state, payload) {
      state.error = payload
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
  }
};

export default auth