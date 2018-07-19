import Vue from 'vue';
import Router from 'vue-router';
import goods from '../components/goods/goods';
import ratings from '../components/ratings/ratings';
import seller from '../components/seller/seller';

Vue.use(Router);

/**
 * route，是一条路由
 * routes 是一组路由
 * Router 是一个机制，相当于一个管理者
 * path 路径
 * component 组件
 */
const routes = [{
  path: '/',  
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

export default new Router({
  linkActiveClass: 'active',
  routes
});
