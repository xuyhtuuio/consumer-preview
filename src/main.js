/*
 * @Author: nimeimix huo.linchun@trs.com.cn
 * @Date: 2023-11-06 09:22:53
 * @LastEditors: nimeimix huo.linchun@trs.com.cn
 * @LastEditTime: 2023-11-06 09:25:23
 * @FilePath: /consumer-preview/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
import '@/assets/css/element.less';
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

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
