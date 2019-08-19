import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
    },
    {
      path: '/:graphid',
      name: 'main',
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
      props: route => ({graphid: route.params.graphid}),
    },
  ],
});
