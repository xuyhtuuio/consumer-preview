import axios from 'axios';
import Qs from 'qs';
import router from '@/router';

// 并发请求封装
export default function axiosAll(options) {

  const arr = [];
  const keys = [];
  for (const key in options) {
    keys.push(key);
    const config = options[key];
    const query = {
      url: config.url,
      method: config.method,
      headers: {},
    };
    const token = window.localStorage.getItem('AI_token');
    if (config.method === 'get') {
      query.params = config.params;
    } else if (config.method === 'post') {
      if (config.contentType) {
        query.headers = {
          'Content-Type': config.contentType,
        };
        if (['application/x-www-form-urlencoded;charset=utf-8', 'application/x-www-form-urlencoded'].indexOf(config.contentType) !== -1) {
          query.data = Qs.stringify(config.params);
        }
      } else {
        query.headers = {
          'Content-Type': 'application/json',
        };
        query.data = JSON.stringify(config.params);
      }
    }
    query.headers.Authorization = `bearer ${token}`; // 如果要求携带在请求头中
    arr.push(axios(query));
  }
  return axios.all(arr).then(
    axios.spread((...args) => {
      const result = {};
      for (let i = 0; i < args.length; i++) {
        const item = args[i];
        if (item) {
          if (item.data) {
            if (item.data.status === 401) {
              router.replace('login');
            }
            result[keys[i]] = item.data;
          } else {
            result[keys[i]] = {
              success: false,
            };
          }
        }
      }
      return result;
    }),
  ).catch(() => {});
}
