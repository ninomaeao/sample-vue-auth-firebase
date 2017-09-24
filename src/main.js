import './main.scss'

import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'

Vue.use(ElementUI, {locale});

import router from './router'
import store from './store'

import firebase from 'firebase'
import {fireBaseConfig} from './firebase.config'
firebase.initializeApp(fireBaseConfig);

const database = firebase.database();

store.dispatch('auth/init').then(() => {
  const app = new Vue({
    router,
    store,
    database,
    render: h => h(App)
  }).$mount('#app');
});