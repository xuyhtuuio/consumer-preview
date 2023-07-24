import Vue from "vue";
import axios from "axios";
import Qs from "qs";
import router from "@/router";

import { Notification, MessageBox, Message } from "element-ui";
// 第三方插件
import "element-ui/lib/theme-chalk/index.css";

Vue.prototype.$axios = axios;
// 字体图标
const noToken = [`uaa/oauth/token`, `uaa/captcha`, `uaa/loginByPwd`, `uaa/validCodeSms`, `uaa/user/getToken`];

const service = axios.create({
	baseURL: process.env.BASE_API,
	timeout: 12 * 5000
});

service.defaults.withCredentials = true; // 让ajax携带cookie
service.interceptors.request.use(
	// 每次请求都自动携带Cookie
	config => {
		let {
      url,
      isCancel,
      params,
      data,
    } = config;
		//config.headers.Cookie = document.cookie
		if (
      config.contentType === "application/x-www-form-urlencoded;charset=utf-8"
    ) {
      config.headers = {
        "Content-Type": config.contentType,
      };
      config.data = Qs.stringify(config.data);
    } else if (config.contentType === "application/x-www-form-urlencoded") {
      config.headers = {
        "Content-Type": config.contentType,
      };
      config.data = Qs.stringify(config.data);
    } else if (config.contentType === "multipart/form-data") {
      config.headers = {
        "Content-Type": config.contentType,
      };
    } else if (
      config.contentType === "application/octet-stream;charset=utf-8"
    ) {
      config.headers = {
        "Content-Type": config.contentType,
      };
    } else {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

		if (noToken.indexOf(url) === -1) {
      // 产业大脑会话保持
      const satoken = window.localStorage.getItem('AI_token');
      satoken && (config.headers.Authorization = `bearer ${satoken}`)
      // 风控请求
      const Authorization = window.localStorage.getItem("Authorization");
      (Authorization && config.url.indexOf('/consumer_test/') === 0) && (config.headers.Authorization = `bearer ${Authorization}`)
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
		console.log("请求", err);
		switch (err.response.status) {
			case 401:
				router.push({
					name: 'login',
				});
				break;
			case 403:
				//Message.warning("抱歉，您无权访问！")
				break;
			case 500:
				Notification.error({ title: "提醒", message: "服务器出了点小错误" });
				break;
			case 404:
				Notification({
					title: "提醒",
					message: "未找到，检查参数",
					type: "warning"
				});
				break;
			default:
				return Promise.reject(err.response ? err.response : {});
		}
		return Promise.reject(err.response ? err.response : {});
	}
);

export default service;
