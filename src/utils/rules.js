/* eslint-disable*/
/**
 * 表单错误校验相关
 */
import {
  isMobilePhone,
  isPostalCode,
  isIP,
  isMD5,
  isInt,
  isURL
} from 'validator'

const isPhone = (value) => {
  return isMobilePhone(value, ['zh-CN'])
}
/**
 * 校验非0开始的ip 例如：00.0.0.1，0.00.0.1
 */
const isIPS = (value) => {
  const arr = value.split('.')
  if (arr.length === 4 && (arr.some(item => /^0[0-2]+/.test(item)) || value.indexOf(':') !== -1)) {
    return false
  }
  if (value.indexOf('::') !== -1) {
    return false
  }
  return isIP(value)
}

const isIP4 = (value) => {
  if (isIP(value, '4')) {
    if (value.split('.').some(item => /^0[0-2]+/.test(item))) {
      return false
    }
    return true
  }
  return false
}

const isPort = (val) => {
  return isInt(val, {
    allow_leading_zeroes: false,
    min: 0,
    max: 65535
  })
}
/**
 * 基于validator的校验函数, 自定义校验函数时使用
 * @param {*} verifyFn  接收的validator.js 函数
 * @param {*} errMsg    特定的错误消息
 * @param {*} required  是否必填, true/false 当为false时必填  FIXME: 后两个参数为非必选项或使用同一校验函数, 错误消息不同使用
 */
const verifyRule = function ({ verifyFn, errMsg, required = true }) {
  return function (rule, value, callback) {
    if ((required || value) && !verifyFn(value)) {
      callback(new Error(errMsg))
    } else {
      callback()
    }
  }
}
// 自定义校验函数 - 校验特殊字符 %'()\/"&=+;#@<>,?和空格
function validatorSpecChar(value) {
  if (/[%'()/"&=+;#@<>,?\\\s]/.test(value)) return false
  return true
}

// 自定义校验函数 - 校验邮政编码
function validatorPostalCode(value) {
  return isPostalCode(value, 'RU')
}

// 自定义校验函数 - 校验特殊字符 `~!@#$^&*()=|{}':;',\\[\\].<>/?·！￥…（）——【】「」‘；：”“。，、？
function checkSpecialKey(value) {
  if (new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?·！￥…（）——【】「」‘；：”“。，、？]").test(value)) return false
  return true
}

/**
 * 校验规则
 */
const rules = {
  required: { required: true, message: '当前字段不能为空', trigger: ['blur', 'change'] },
  // eslint-disable-next-line
  specialChar: { validator: verifyRule({ verifyFn: validatorSpecChar, errMsg: `不允许使用空格和特殊字符：%'()/"&=+;#@<>,\\?`, required: false }), trigger: 'blur' },
  numRange: (min, max) => {
    return {
      trigger: 'blur',
      validator: (rule, value, cb) => {
        if (value !== 0 && !value) {
          return cb()
        }
        value = Number(value)
        if (Number.isNaN(value)) {
          return cb(new Error('请输入数字'))
        }
        if (value < min) {
          return cb(new Error('不能小于' + min))
        }
        if (value > max) {
          return cb(new Error('不能大于' + max))
        }

        return cb()
      }
    }
  },
  justInt: (min = 0, max, length) => {
    return {
      trigger: ['blur', 'change'],
      validator: (rule, value, cb) => {
        if (!value) return cb()
        const reg = new RegExp('^(([1-9][0-9]*)|' + min + ')$')
        if (Number(value) < min || !(reg.test(value))) {
          return cb(new Error(`请输入正整数${min === 0 || min === '0' ? '' : ('，且不小于' + min)}！`))
        } else if (max && Number(value) > max) {
          return cb(new Error('不能大于' + max))
        } else if (length && value.length > length) {
          return cb(new Error(`最多${length}个字符`))
        }
        return cb()
      }
    }
  },
  range: (min, max) => {
    return {
      min,
      max,
      message: `长度限制为${min}-${max}个字符`, trigger: 'blur'
    }
  },
  phone: { validator: verifyRule({ verifyFn: isPhone, errMsg: '请输入正确的手机号码', required: false }), trigger: 'blur' },
  email: { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  postalCode: { validator: verifyRule({ verifyFn: validatorPostalCode, errMsg: '请输入正确的邮政编码', required: false }) },
  ip: { validator: verifyRule({ verifyFn: isIPS, errMsg: '请输入正确的IP地址', required: false }), trigger: 'blur' },
  ip4: { validator: verifyRule({ verifyFn: isIP4, errMsg: '请输入正确的IPv4地址', required: false }), trigger: 'blur' },
  ipRange: {
    validator: (rule, val, cb) => {
      let arr = val.split('~')
      let str = '请输入IP或IP区间，区间用“~”连接，如10.2.1.1或10.2.1.1~10.2.1.5'
      if (arr.length > 2) {
        return cb(new Error(str))
      } else if (arr.length === 2 && arr.some(ip => !isIPS(ip))) {
        return cb(new Error(str))
      } else if (arr.length === 1 && !isIPS(val)) {
        return cb(new Error(str))
      }
      return cb()
    },
    trigger: 'blur'
  },
  md5: { validator: verifyRule({ verifyFn: isMD5, errMsg: '请输入正确的MD5', required: false }), trigger: 'blur' },
  port: { validator: verifyRule({ verifyFn: isPort, errMsg: '请输入正确的端口号', required: false }), trigger: ['blur', 'change'] },
  portRange: {
    validator: (rule, val, cb) => {
      let arr = val.split('~')
      let str = '请输入端口或端口区间，区间用“~”连接，如8080或8080~8081'
      if (arr.length > 2) {
        return cb(new Error(str))
      } else if (arr.length === 2 && arr.some(port => !isPort(port))) {
        return cb(new Error(str))
      } else if (arr.length === 1 && !isPort(val)) {
        return cb(new Error(str))
      }
      return cb()
    },
    trigger: 'blur'
  },
  url: { validator: verifyRule({ verifyFn: isURL, errMsg: '请输入正确的url', required: false }), trigger: ['blur'] },
  fullSpecialChar: { validator: verifyRule({ verifyFn: checkSpecialKey, errMsg: '不能含有特殊字符', required: false }), trigger: 'blur' }
}
export default rules
