import Vue from 'vue';
import axios from 'axios';
import Qs from 'qs';
import router from '@/router';

import { Message } from 'element-ui';
// 第三方插件
import 'element-ui/lib/theme-chalk/index.css';

Vue.prototype.$axios = axios;
// 字体图标
const noToken = ['uaa/oauth/token', 'uaa/captcha', 'uaa/loginByPwd', 'uaa/validCodeSms', 'uaa/user/getToken'];

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 12 * 5000
});

service.defaults.withCredentials = true; // 让ajax携带cookie
service.interceptors.request.use(
  // 每次请求都自动携带Cookie
  config => {
    const {
      url,
    } = config;
    // config.headers.Cookie = document.cookie
    if (
      config.contentType === 'application/x-www-form-urlencoded;charset=utf-8'
    ) {
      config.headers = {
        'Content-Type': config.contentType,
      };
      config.data = Qs.stringify(config.data);
    } else if (config.contentType === 'application/x-www-form-urlencoded') {
      config.headers = {
        'Content-Type': config.contentType,
      };
      config.data = Qs.stringify(config.data);
    } else if (config.contentType === 'multipart/form-data') {
      config.headers = {
        'Content-Type': config.contentType,
      };
    } else if (
      config.contentType === 'application/octet-stream;charset=utf-8'
    ) {
      config.headers = {
        'Content-Type': config.contentType,
      };
    } else {
      config.headers = {
        'Content-Type': 'application/json',
      };
    }

    if (noToken.indexOf(url) === -1) {
      // 产业大脑会话保持
      // const satoken = window.localStorage.getItem('AI_token');
      const satoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsicmVzNyIsInJlczAiXSwidXNlcl9uYW1lIjoie1wiY29zdFwiOjk0NyxcImZ1bGxuYW1lXCI6XCLnjovlpZXmnahcIixcImlkXCI6MTEzMyxcImxhdGVseUxvZ2luVGltZVwiOlwiMjAyMy0wOS0xMSAxMzozOTo1OVwiLFwibWFpbFwiOlwieWl5YW5nMDY2M0AxNjMuY29tXCIsXCJtb2JpbGVcIjpcIjEzNjk0NzcwNjYzXCIsXCJvcmdJZFwiOjAsXCJvcmdzXCI6W3tcImNoaWxkXCI6W10sXCJjb2RlXCI6XCJHMDAyMTAwMjNcIixcImlkXCI6MjMsXCJuYW1lXCI6XCLnoJTlj5Hnu4RcIixcInBhcmVudENvZGVcIjpcIkcwMDIxXCIsXCJyb2xlc1wiOltdfV0sXCJwYXNzd29yZFwiOlwiKioqKioqXCIsXCJwZXJtaXNzaW9uc1wiOltdLFwicGxhdGZvcm1cIjpcInJ3c2NkYXRhLHRlaXNkYXRhXCIsXCJyb2xlc1wiOlt7XCJjbGllbnRJZFwiOlwiY3ByXCIsXCJjb2RlXCI6XCJjcHItYWRtaW5cIixcImRhdGFUeXBlXCI6MCxcImlkXCI6NDksXCJuYW1lXCI6XCLmtojkv53lrqHmn6Ut6LaF57qn566h55CG5ZGYXCIsXCJwb2ludFwiOi0xfV0sXCJzdGF0dXNcIjoxLFwidXNlcm5hbWVcIjpcIndhbmd5aXlhbmdcIn0iLCJzY29wZSI6WyJjcHIiXSwiZXhwIjoxNjk1MDI2NDc4LCJhdXRob3JpdGllcyI6WyJ3b3JrZmxvd1ZpZXciLCJ1c2VyTWFuYWdlbWVudCIsImZsb3dhYmxlTWFuYWdlbWVudCIsIm90aGVyRGlzcG9zaXRpb24iLCJ0YWdNYW5hZ2VtZW50IiwiYXBwbGljYXRpb25Gb3JtRGV0YWlscyIsImFwcGxpY2F0aW9uRGV0YWlsIiwic3RhdHV0ZXNNYW5hZ2VtZW50IiwibmV3QXBwbGljYXRpb24iLCJ3b3JrZmxvd0NvbmZpZ3VyYXRpb24iLCJiYWNrTWFuYWdlbWVudCIsImRhdGFQZXJtaXNpb24iLCJyb2xlUGVybU1hbmFnZW1lbnQiLCJzbWFydEFwcHJvdmFscyIsImZvcm1NYW5hZ2VtZW50IiwiZWRpdEFwcGxpY2F0aW9uIiwib25saW5lQ29tcGFyaXNvbiIsIndvcmtmbG93UHJvY2Vzc0Rlc2lnbiIsIndvcmtTcGFjZSIsImFwcHJvdmFsQ2VudGVyIiwid29ya2Zsb3dCYXNlSW5mbyIsImFsbFRhc2siLCJhcHBsaWNhdGlvbkxpc3QiLCJ3b3JrZmxvd0Rlc2lnbiIsImhvbWUiLCJvcGluaW9uTWFuYWdlbWVudCIsInByb2R1Y3RHcmFwaCIsInN0YXRpc3RpY3NDZW50ZXIiXSwianRpIjoiMmM4OTMyMWUtZmNjYS00ZTQ3LTljNzQtMTI4MDBiY2ZlY2EwIiwiY2xpZW50X2lkIjoiY3ByIn0.nV22jsA_M1p5qDxKPVr_243_Z9mf7UKDFBpcaYfyDqU';
      satoken && (config.headers.Authorization = `bearer ${satoken}`)
    }

    return config;
  },
  // eslint-disable-next-line handle-callback-err
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  rsp => {
    return rsp;
  },
  // 拦截异常的响应
  err => {
    // console.log('请求', err);
    switch (err.response.status) {
      case 401:
        router.push({
          name: 'login',
        });
        break;
      case 403:
        // Message.warning("抱歉，您无权访问！")
        break;
      case 500:
        Message.error({ offset: 40, title: '提醒', message: '服务器出了点小错误' });
        break;
      case 404:
        Message({
          offset: 40,
          title: '提醒',
          message: '未找到，检查参数',
          type: 'warning'
        });
        break;
      default:
        return Promise.reject(err.response ? err.response : {});
    }
    return Promise.reject(err.response ? err.response : {});
  }
);

export default service;
