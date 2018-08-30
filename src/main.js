// import Vue from 'vue'
// import Vuex from 'vuex'
// import App from './App'
// import VueRouter from 'vue-router'
// // import VueResource from 'vue-resource'
// import axios from 'axios'
// import goods from './components/goods/goods';
// import ratings from './components/ratings/ratings';
// import seller from './components/seller/seller';

// import "./common/sass/index.scss";

// Vue.use(VueRouter);
// // Vue.use(VueResource);
// Vue.use(Vuex);
// Vue.prototype.axios = axios; //axios并不是vue插件，这里不能使用Vue.use，绑定的了原型链上

// /* eslint-disable no-new */
// const routes = [
//     { path: '/goods', component: goods },
//     { path: '/ratings', component: ratings },
//     { path: '/seller', component: seller }
// ];

// const router = new VueRouter({
//     mode: 'history',
//     base: __dirname,
//     linkActiveClass: 'active', //指定选中路由所加的类名
//     routes // （缩写）相当于 routes: routes
// })

// const app = new Vue({
//     router,
//     render: h => h(App),
//     data: {
//         eventHub: new Vue()
//     }
// }).$mount('#app')

// // router.push('/goods')

// /* const router = new VueRouter({
//     routes: [{
//         path: '/goods',
//         component: goods
//     }, {
//         path: '/ratings',
//         component: ratings
//     }, {
//         path: '/seller',
//         component: seller
//     }],
//     linkActiveClass: 'active'
// })

// new Vue({
//     router,
//     store,
//     template: '<App/>',
//     components: {
//         App
//     },
//     data: {
//         eventHub: new Vue()
//     }
// }).$mount('#app')

// router.push('goods') */

import Vue from 'vue';
import axios from 'axios'
import App from './App';
import Vuex from 'vuex'
import router from './router/index.js';

import "./common/sass/index.scss";

Vue.use(Vuex);
Vue.prototype.axios = axios; //axios并不是vue插件，这里不能使用Vue.use，绑定的了原型链上
Vue.config.productionTip = false  //去掉vue警告 You are running Vue in development mode （用于生产不提示）

new Vue({
    el: '#app',
    router,
    data: {
        eventHub: new Vue()
    },
    render: h => h(App)
});

