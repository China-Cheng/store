// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/style.css';
import MyAxios from '@/piugins/MyAxios';
import moment from 'moment';
import MyBreadcrumb from '@/components/MyBreadcrumb';

Vue.config.productionTip = false;
// 注册全局组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);
// 全局过滤器
Vue.filter('fmtDate', (v, fmString) => {
  return moment(v).format(fmString);
});
// 注册axios插件
Vue.use(MyAxios);
/* eslint-disable no-new */
Vue.use(ElementUI);
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
