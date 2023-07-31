export function getUrlKey(name, loc) {
  return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(loc) || ['', ''])[1].replace(/\+/g, '')) || null;
}
// 数字转中文
export function toChinesNum(num) {
  const changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = ['', '十', '百', '千', '万'];
  num = parseInt(num);
  const getWan = (temp) => {
    const strArr = temp.toString().split('').reverse();
    let newNum = '';
    for (let i = 0; i < strArr.length; i++) {
      if (!(i === 0 && strArr[i] === 0)) {
        if (!(i > 0 && strArr[i] === 0 && strArr[i - 1] === 0)) {
          newNum += changeNum[strArr[i]] + (strArr[i] === 0 ? unit[0] : unit[i]);
        }
      }
    }
    return newNum;
  };
  const overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = `0${noWan}`;
  }
  return overWan ? `${getWan(overWan)}万${getWan(noWan)}` : getWan(num);
}
// 万转化为亿
export function wanToYi(value) {
  if (!Number(value)) {
    return '';
  }
  if (value >= 10000) {
    value = Number(value) + ''
    const index = value.indexOf('.') > 0 ? value.indexOf('.') : value.length
    value = value.slice(0, index - 4) + '.' + value.slice(index - 4, index)
    return parseFloat((+value).toFixed(2)) + '亿'
  }
  return parseFloat((+value).toFixed(2)) + '万'
}
// 元转化为万或亿
export function yuanToYi(value, returnType) {
  if (!Number(value)) {
    return '';
  }
  if (value >= 100000000) {
    value = Number(value) + ''
    const index = value.indexOf('.') > 0 ? value.indexOf('.') : value.length
    value = value.slice(0, index - 8) + '.' + value.slice(index - 8, index)
    if (returnType === 'object') {
      return {
        value: parseFloat((+value).toFixed(2)),
        unit: '亿'
      }
    }
    return parseFloat((+value).toFixed(2)) + '亿'
  } else if (value >= 10000) {
    value = Number(value) + ''
    const index = value.indexOf('.') > 0 ? value.indexOf('.') : value.length
    value = value.slice(0, index - 4) + '.' + value.slice(index - 4, index)
    if (returnType === 'object') {
      return {
        value: parseFloat((+value).toFixed(2)),
        unit: '万'
      }
    }
    return parseFloat((+value).toFixed(2)) + '万'
  }
  return parseFloat((+value).toFixed(2))
}
// 获取cookie、
export function getCookie(name) {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  if (arr) {
    return (unescape(arr[2]));
  }
  return null;
}

// 设置cookie,
export function setCookie(cName, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = `${cName}=${escape(value)}${(expiredays === null) ? '' : `;expires=${exdate.toGMTString()}`}`;
}

// 删除cookie
export function delCookie(name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval !== null) {
    document.cookie = `${name}=${cval};expires=${exp.toGMTString()}`;
  }
}

// 时间格式转换
export function formatDuring(mss, type) {
  const days = parseInt(mss / (1000 * 60 * 60 * 24));
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.ceil((mss % (1000 * 60)) / 1000);
  if (type === 1) {
    const h = hours + days * 24;
    return `${h < 10 ? `0${h}` : h}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }
  if (days !== 0) {
    return `${days}天${hours}小时${minutes}分钟${seconds}秒`;
  }
  if (hours !== 0) {
    return `${hours}小时${minutes}分钟${seconds}秒`;
  }
  if (minutes !== 0) {
    return `${minutes}分钟${seconds}秒`;
  }
  return `${+seconds}秒`;
}

// 时间戳转化为yyyy-MM-dd
export function timestampToNormal(date, format = '-') {
  const time = new Date(+date);
  const year = time.getFullYear(); // 年
  const month = ('0' + (time.getMonth() + 1)).slice(-2); // 月
  const day = ('0' + time.getDate()).slice(-2); // 日
  return year + format + month + format + day;
}
// 时间戳转化为yyyy-MM-dd hh:mm:ss
export function timestampToDateTime(date, format = '-') {
  const time = new Date(typeof date === 'string'?date: +date);
  const year = time.getFullYear(); // 年
  const month = ('0' + (time.getMonth() + 1)).slice(-2); // 月
  const day = ('0' + time.getDate()).slice(-2); // 日
  const hour = ('0' + time.getHours()).slice(-2);
  const minute = ('0' + time.getMinutes()).slice(-2);
  const second = ('0' + time.getSeconds()).slice(-2);
  return year + format + month + format + day + ` ${hour}:${minute}:${second}`;
}

// 时间戳转多少时间前
export function formatterTime(time) {
  const currentDate = new Date().getTime()
  const createTime = time
  const poorDate = Math.floor((currentDate - createTime) / (1000 * 60))
  let msg = '刚刚'
  if (poorDate >= 1) {
    msg = poorDate + '分钟前'
  }
  if (poorDate >= 60) {
    msg = Math.floor(poorDate / 60) + '小时前'
  }
  if (poorDate >= 60 * 24) {
    msg = Math.floor(poorDate / 60 / 24) + '天前'
  }
  if (poorDate >= 60 * 24 * 30) {
    msg = Math.floor(poorDate / 60 / 24 / 30) + '月前'
  }
  if (poorDate >= 60 * 24 * 30 * 12) {
    msg = Math.floor(poorDate / 60 / 24 / 30 / 12) + '年前'
  }
  return msg
}

// 加密
export function toCode(str) { // 加密字符串
  // 定义密钥，36个字母和数字
  const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = key.length; // 获取密钥的长度
  const a = key.split(''); // 把密钥字符串转换为字符数组
  let s = '';
  let b;
  let b1;
  let b2;
  let b3; // 定义临时变量
  for (let i = 0; i < str.length; i++) { // 遍历字符串
    b = str.charCodeAt(i); // 逐个提取每个字符，并获取Unicode编码值
    b1 = b % L; // 求Unicode编码值得余数
    b = (b - b1) / L; // 求最大倍数
    b2 = b % L; // 求最大倍数的于是
    b = (b - b2) / L; // 求最大倍数
    b3 = b % 1; // 求最大倍数的余数
    s += a[b3] + a[b2] + a[b1]; // 根据余数值映射到密钥中对应下标位置的字符
  }
  return s; // 返回这些映射的字符
}
// 解密
export function fromCode(str) {
  // 定义密钥，36个字母和数字
  const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = key.length; // 获取密钥的长度
  let b;
  let b1;
  let b2;
  let b3;
  let d = 0;
  // 定义临时变量
  const s = new Array(Math.floor(str.length / 3)); // 计算加密字符串包含的字符数，并定义数组
  b = s.length; // 获取数组的长度
  for (let i = 0; i < b; i++) { // 以数组的长度循环次数，遍历加密字符串
    b1 = key.indexOf(str.charAt(d)); // 截取周期内第一个字符串，计算在密钥中的下标值
    d++;
    b2 = key.indexOf(str.charAt(d)); // 截取周期内第二个字符串，计算在密钥中的下标值
    d++;
    b3 = key.indexOf(str.charAt(d)); // 截取周期内第三个字符串，计算在密钥中的下标值
    d++;
    s[i] = b1 * L * L + b2 * L + b3; // 利用下标值，反推被加密字符的Unicode编码值
  }
  b = eval(`String.fromCharCode(${s.join(',')})`); // 用fromCharCode()算出字符串
  return b; // 返回被解密的字符串
}

// 数量精简
export function shortNum(num) {
  if (!num) {
    return 0;
  }
  num = parseFloat(num);
  if (num < 1e3) {
    return num;
  }
  if (num < 1e4) {
    return `${(num / 1e3).toFixed(2)}k`;
  }
  return `${(num / 1e4).toFixed(2)}w`;
}

// 保存文件
export function expordFile(res, fileName) {
  const blob = new Blob([res]);
  const elink = document.createElement('a'); // 创建a标签
  elink.download = fileName; // a标签添加属性
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click(); // 执行下载
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink); // 释放标签
}

// uuid生成器
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
export function getUUID() {
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
}

// 判断给定值是否为空
export const isEmpty = val => (typeof val === 'string' && val.trim() === '') || val === null || val === undefined

/* 字符串解析成元素节点类型 */
export function parseElement(str) {
  const o = document.createElement('div');
  o.innerHTML = str;
  return o.childNodes;
}
/* 元素节点类型解析成字符串 */
export function stringIze(obj) {
  const o = document.createElement('div');
  o.appendChild(obj);
  return o.innerHTML;
}
export function formatterProvince(areaValue, end) {
  if (!areaValue) {
    return '';
  }
  // 只处理省份，如果市直辖市或地级市直接返回, 例如end === '市'
  if (end && areaValue.endsWith(end)) {
    return areaValue
  }
  let province = ''
  if (areaValue.includes('内蒙古') || areaValue.includes('黑龙江')) {
    province = areaValue.slice(0, 3)
  } else {
    province = areaValue.slice(0, 2)
  }
  return province
}
// d对企业评分进行四舍五入，为0 则返回0.01
export function toFixedEntValue(num) {
  const entValue = Number(num).toFixed(2) || '0.00';
  return entValue === '0.00' ? 0.01 : entValue;
}
export function switchIndustryTab(num) {
  // eslint-disable-next-line
  switch (num) {
    case 0:
      return 1
    case 1:
      return 2;
    case 2:
      return 2;
    case 3:
      return 3
  }
}
export function switchIndustryTabAbstract(num) {
  // eslint-disable-next-line
  switch (num) {
    case 0:
      return 0
    case 1:
      return 1;
    case 2:
      return 1;
    case 3:
      return 2
  }
}
export function switchissuancePeriod(val) {
  let obj = {
    start: '',
    end: ''
  }
  // eslint-disable-next-line
  switch (val) {
    case 1:
      obj = {
        start: '0',
        end: '1'
      }
      break;
    case 2:
      obj = {
        start: '1',
        end: '3'
      }
      break;
    case 3:
      obj = {
        start: '3',
        end: '5'
      }
      break;
    case 4:
      obj = {
        start: '5',
        end: '7'
      }
      break;
    case 5:
      obj = {
        start: '7',
        end: '10'
      }
      break;
    case 6:
      obj = {
        start: '10',
        end: ''
      }
      break;
  }
  return obj
}

// 获取文本长度
export function computedTextWidth2(text, fontSize = 14) {
  let canvas = document.getElementById('computedTextWidth');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'computedTextWidth';
    canvas.style.cssText = 'visibility:hidden;position: absolute;left: -999em;top:-999em;';
    document.body.appendChild(canvas);
  }
  const context = canvas.getContext('2d');
  context.font = `${fontSize}px`;
  context.fillText(text, 0, 0);
  return context.measureText(text).width;
}
