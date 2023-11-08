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
import '@/assets/css/element.less'
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

// 子应用接收 父应用数据
function dataListener (data) {
  switch (data.actionType) {
    case 'routerPush':
      router.push({
        name: data.name,
        params: data.params
      });
      break;
    default:
      break;
  }
  
}
/**
 * 绑定监听函数，监听函数只有在数据变化时才会触发
 * dataListener: 绑定函数
 * autoTrigger: 在初次绑定监听函数时如果有缓存数据，是否需要主动触发一次，默认为false
 * !!!重要说明: 因为子应用是异步渲染的，而基座发送数据是同步的，
 * 如果在子应用渲染结束前基座应用发送数据，则在绑定监听函数前数据已经发送，在初始化后不会触发绑定函数，
 * 但这个数据会放入缓存中，此时可以设置autoTrigger为true主动触发一次监听函数来获取数据。
 */
window.microApp.addDataListener(dataListener, true)

// 解绑监听函数
window.microApp.removeDataListener(dataListener)

// 清空当前子应用的所有绑定函数(全局数据函数除外)
window.microApp.clearDataListener()
