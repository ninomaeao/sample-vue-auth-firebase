import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import user from './modules/user'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  modules: {
    auth,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
});

export default store
