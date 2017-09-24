import firebase from 'firebase'

const user = {
  namespaced: true,
  state: {
    name: "",
    error: "",
  },
  getters: {
    user: (state) => state,
  },
  mutations: {
    set(state, payload) {
      if (payload) {
        state.name = payload.name
      }
    },
    setError(state, payload) {
      state.error = payload
    },
  },
  actions: {
    get({commit}, payload) {
      firebase.database().ref(`/users/${payload.uid}`).on('value', (snapshot) => {
        commit('set', snapshot.val());
        if (payload.cb) payload.cb(null, snapshot.val())
      }, (error) => {
        commit('setError', error.message);
      })
    },
    update({commit}, payload) {
      firebase.database().ref(`/users/${payload.uid}`).set({
        name: payload.name,
      }, (error) => {
        if (error) {
          commit('setError', "エラー！");
        } else {
          commit('set', payload);
        }
      });
    }
  }
};

export default user