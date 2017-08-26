import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter);

import Error404 from '../views/error404.vue'
import Top from '../views/top.vue'
import Login from '../views/auth/login.vue'
import MyPage from '../views/auth/mypage.vue'

const routes = [
  {path: '*', component: Error404},
  {name: 'top', path: '/', component: Top},
  {
    name: 'login', path: '/login', component: Login,
    beforeEnter: (to, from, next) => {
      if (store.getters['auth/user'].auth === true) {
        next('/myPage')
      } else {
        next()
      }
    }
  },
  {
    name: 'myPage', path: '/myPage', component: MyPage,
    meta: {requiresAuth: true}
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters['auth/user'].auth !== true) {
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
