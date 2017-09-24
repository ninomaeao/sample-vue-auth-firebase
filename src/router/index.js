import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter);

import Error404 from '../views/error404.vue'
import Top from '../views/top.vue'
import Login from '../views/auth/login.vue'
import Register from '../views/auth/register.vue'
import Account from '../views/account/index.vue'

const routes = [
  {path: '*', component: Error404},
  {name: 'top', path: '/', component: Top, meta: { side: true }},
  {
    name: 'login', path: '/login', component: Login, meta: { side: false },
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/auth'].auth === true) {
        next('/account')
      } else {
        next()
      }
    }
  },
  {
    name: 'register', path: '/register', component: Register, meta: { side: false },
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/auth'].auth === true) {
        next('/account')
      } else {
        next()
      }
    }
  },
  {
    name: 'account', path: '/account', component: Account,
    meta: {requiresAuth: true, side: false}
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/auth'].auth !== true) {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router
