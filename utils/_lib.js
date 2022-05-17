const md5 = require('md5');
const axios = require('axios');

const isMobileAccess = () => {
  if (typeof window !== 'undefined') {
    var sUserAgent = navigator.userAgent;
    var mobileAgents = ['Windows CE', 'iPad', 'iPhone', 'iPod', 'Android', 'android', 'Windows Phone', 'Symbian', 'BlackBerry', 'Linux'];
    for (var i = 0, len = mobileAgents.length; i < len; i++) {
      if (sUserAgent.indexOf(mobileAgents[i]) !== -1) {
        return true;
      }
    }
    return false;
  }
}
const sysPlatform = () => {
  if (typeof window !== 'undefined') {
    let isMobile = isMobileAccess(),
      userAgent = navigator.userAgent.toLowerCase(),
      sys = "";

    if (isMobile) {
      //安卓
      if (userAgent.match(/android/i)) {
        sys = "android";
      }
      //苹果
      if (userAgent.match(/(iphone|ipad|ipod|ios)/i)) {
        sys = "ios";
      }
      //微信
      if (userAgent.match(/MicroMessenger/i) == "micromessenger") {
        sys = "weixin";
      }
      return sys;
    } else return false;
  }
}

/**
 * Get token and idfa for api use
 */
const getInfo = () => {
  if (typeof window !== 'undefined') {
    let info;
    if (typeof uiObject !== 'undefined' || (window.webkit && window.webkit.messageHandlers) !== undefined) {
      switch (sysPlatform()) {
        case 'ios':
          return info = JSON.parse(window.webkit.messageHandlers.getInfo.postMessage())
        case 'android':
          return info = JSON.parse(uiObject.getInfo())
      }
    } else return info = { token: '522a830aff04fb7bab2e142da06d67a0', idfa: 'idfa' }
  }
}

/**
 * 安卓跳转页面调用pushView(int viewTag)方法
 * 参数如下：
 * 4、个人页面
 * 11、关闭网页
 * 12、登入页
 * 13、登入页(登入成功会跳转到入金页)
 */
const pushView = (pageCode) => {
  if (typeof window !== 'undefined') {
    console.log(`sysPlatform ${sysPlatform()}`);
    if (typeof uiObject !== 'undefined' || (window.webkit && window.webkit.messageHandlers) !== undefined) {
      switch (sysPlatform()) {
        case 'ios':
          return window.webkit.messageHandlers.pushView.postMessage(pageCode)
        case 'android':
          return uiObject.pushView(pageCode)
      }
    } else {
      console.log(`typeof uiObject !== 'undefined' ${typeof uiObject !== 'undefined'}`);
      console.log(`(window.webkit && window.webkit.messageHandlers) !== undefined ${(window.webkit && window.webkit.messageHandlers) !== undefined}`);
    }
  }
}

const fetchData_cms = async (params) => {
  try {
    let result = await (await axios.get('/api/cms', { params: params })).data
    if (result.ret !== 200) console.error(`${result.ret}: ${result.msg}`)
    return result
  } catch (error) { console.error(error) }
}


/**
 * Encrypt params as an md5 key
 * @param {object} params
 */
const getSign = (params) => {
  let keys = Object.keys(params).sort(),
    str = ''
  for (let i of keys) {
    str += params[i]
  }
  return md5(str + process.env.NEXT_PUBLIC_KEY)
}

/**
 * Check email format
 * @param {string} email
 */
const validateEmail = email => {
  let re = /\S+@\S+\.\S+/;
  return re.test(email);
};

/**
 * Check password qualified
 * @param {string} password
 */
const validatePassword = password => {
  let validates = [
    { validate: '必須多於或等於8個字符', isValid: false },
    { validate: '需有大小階', isValid: false },
    { validate: '需有數字', isValid: false },
    { validate: '不可有特殊字符', isValid: false },
  ]

  const updateState = (validate, isValid) => {
    let newVal = [...validates];
    newVal.filter(x => x.validate === validate).map(x => x.isValid = isValid)
    return validates = newVal
  }

  let isContainsSymbol = /^(?=.*[~`!@#$%^&*\s()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/,
    isContainsNumber = /^(?=.*[0-9]).*$/

  if (password.length >= 8) {
    updateState('必須多於或等於8個字符', true)
  } else updateState('必須多於或等於8個字符', false)

  if (password !== password.toUpperCase() && password !== password.toLowerCase()) {
    updateState('需有大小階', true)
  } else updateState('需有大小階', false)

  if (isContainsNumber.test(password)) {
    updateState('需有數字', true)
  } else updateState('需有數字', false)

  if (!isContainsSymbol.test(password)) {
    updateState('不可有特殊字符', true)
  } else updateState('不可有特殊字符', false)

  return validates
}

/**
 * limited input[type="number"] by 8 decimal places
 * @param {object} e
 */
const input8Decimal = e => {
  let value = e.target.value;
  if (value.indexOf('.') >= 0) {
    value = value.substr(0, value.indexOf('.')) + value.substr(value.indexOf('.'), 9)
    return e.target.value = value
  }
}

/**
 * 跟踪号方便调试
 */
const genTrack = () => {
  let id = [
    new Date().getYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
    new Date().getHours(),
    new Date().getMinutes(),
    new Date().getSeconds(),
  ].join("");
  let str = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2).toUpperCase();
  return id + str;
}

/**
 * 异常代码说明
 */
const messageHandler = (msg) => {
  let errList = {
    'AMS501': '中台接口异常',
    'NET001': 'API口异常',
    'LD001': '登陆数据异常',
    'SWIDAMS501': '获取通道配置异常',
    'RATEAMS501': '获取汇率异常',
    'FEEAMS501': '获取手续费异常',
    'CINFOAMS501': '获取用户信息异常',
    'VAAMS501': '校验提案异常',
    'ADAMS501': '添加提案异常',
    'PW0001': '加密数据异常',
    'PSLASM001': '渠道异常',
    'PAY001': '支付失败',
    'SIN001': '解密数据异常',
    'SHAMS501': '审核提案异常',
    'CAC0001': '重复请求',
    'ORD001': '订单过期',
  }
  return errList[msg] !== undefined ? errList[msg] : '帳戶未能進行相關操作，請聯絡客服。'
}
const getStorage = (key) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key)
  }
}
const setStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    return window.localStorage.setItem(key, value)
  }
}

const getQueryString = (key) => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search).get(key)
  }
}

const showModal = (id) => {
  var successModal = new bootstrap.Modal(document.getElementById(id))
  successModal.show()
}

const preventNumberSymbol = (e) => {
  // -,-,+,+,e
  return [69, 107, 109, 187, 189].includes(e.keyCode) && e.preventDefault()
}

const Lib = {
  getSign,
  validateEmail,
  validatePassword,
  input8Decimal,
  genTrack,
  messageHandler,
  getStorage,
  setStorage,
  getQueryString,
  showModal,
  preventNumberSymbol,
  getInfo,
  pushView,
  fetchData_cms,
}
export default Lib