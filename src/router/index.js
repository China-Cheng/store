import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/users';
import Rights from '@/views/roles/rights';
import Roles from '@/views/roles/roles';
import { Message } from 'element-ui';
import Category from '@/views/goods/Category';
import GoodsList from '@/views/goods/List';
import GoodsAdd from '@/views/goods/Add';

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
        }
      ]
    }
  ]
});

// 路由的前置守卫
router.beforeEach((to, from, next) => {
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
});

export default router;
