import Vue from 'vue'
import ElementUI from 'element-ui';
import TrsWebComponents from 'trs-web-components'
import gloCptsFn from '@/utils/globalCmps'
import 'element-ui/lib/theme-chalk/index.css';
import Empty from '@/components/common/empty'
import Ellipsis from '@/components/common/Ellipsis'
import WDialog from '@/components/common/WDialog'
import $GLOBAL from '@/utils/const';
import http from '@/api/request'; /* eslint-disable */
import bus from '@/utils/bus';
import * as echarts from 'echarts'

import 'trs-web-components/lib/common.less';
import 'trs-web-components/lib/element.less';
import "@/assets/theme.less";
import "@/assets/global.css";
import '@/assets/icon/iconfont.css';
import '@/assets/icon/iconfont.js';
import '@/assets/css/common.less';
import '@/mixins'
import 'echarts-wordcloud'

import App from './App'
import router from "./router";
import store from './store'

import onceClick from './utils/click-once';
Vue.use(ElementUI);
Vue.use(TrsWebComponents);
Vue.use(gloCptsFn);
Vue.component('Empty', Empty)
Vue.use(Ellipsis);
Vue.use(WDialog);
Vue.use(onceClick);
Vue.use(bus);
Vue.prototype.$GLOBAL = $GLOBAL; // 全局常量
Vue.prototype.$http = http; // 请求库
Vue.prototype.$echarts = echarts


Vue.config.productionTip = false

Vue.prototype.BASE_URL = 'http://' + (process.env.NODE_ENV === 'development' ? "192.168.210.76" : "192.168.210.76");

Vue.prototype.$isNotEmpty = function (obj) {
  return (obj !== undefined && obj !== null && obj !== '' && obj !== 'null')
}

Vue.prototype.$isEmpty = val => {
  return !val || val === '' || val === 'undefined' || val === 'null'
}

Vue.prototype.$getDefalut = function (obj, key, df) {
  return (obj === undefined || key === undefined || !this.$isNotEmpty(obj[key])) ? df : obj[key];
}

Vue.prototype.$deepCopy = function (obj) { return JSON.parse(JSON.stringify(obj)) }

Vue.prototype.$hasMicro = function () {
  return window.microApp
 }
 Vue.prototype.$routerPush = function (type, paramsObj = {}) {
   const data = {
     message: '/admin/manage/', // 后台管理页面
     home: '/', // 首页
     loginOut: '/loginOut' // 退出登录
   }
   window.microApp.dispatch({ path: data[type], time: new Date().getTime() , ...paramsObj})
 }

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
