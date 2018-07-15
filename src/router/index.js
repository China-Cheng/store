import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';

const Login = () => import('@/views/Login');
const Home = () => import('@/views/Home');
const Users = () => import('@/views/users/users');
const Rights = () => import('@/views/roles/rights');
const Roles = () => import('@/views/roles/roles');
const Category = () => import('@/views/goods/Category');
const GoodsList = () => import('@/views/goods/List');
const GoodsAdd = () => import('@/views/goods/Add');
const OrderList = () => import('@/views/orders/List');
const Reports = () => import('@/views/repots/Index');
const NProgress = () => import('nprogress');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'category',
          path: '/categories',
          component: Category
        },
        {
          name: 'goods-list',
          path: '/goods',
          component: GoodsList
        },
        {
          name: 'goods-add',
          path: '/goods/add',
          component: GoodsAdd
        },
        {
          name: 'order-list',
          path: 'orders',
          component: OrderList
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
});

// 路由的前置守卫
router.beforeEach((to, from, next) => {

  NProgress.start();
  // console.log(to, from);
  // 判断当前访问的路由是否是login，如果是login直接next
  if (to.name === 'login') {
    next();
  } else {
    // 判断有没有token
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转到登录页面
      router.push({ name: 'login' });
      // 提示
      Message.warning('请先登录');
      return;
    }
    next();
  }
  router.afterEach((to, from) => {
    NProgress.done();
  });
});

export default router;
