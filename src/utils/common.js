// import moment = require("moment")
// import moment from 'moment'

export default {
  setLocalStorage(key, value) {
    window.localStorage.setItem(key, value)
  },
  getLocalStorage(key) {
    return window.localStorage.getItem(key)
  },
  getUser(key) {
    return JSON.parse(window.localStorage.getItem('user') || '{}')[key] || ''
  },
  setUser(value) {
    return window.localStorage.setItem('user', JSON.stringify(value || {}))
  },
  getToken() {
    return window.localStorage.getItem('token') || ''
  },
  setToken(value) {
    window.localStorage.setItem('token', value || '')
  },
  removeToken() {
    window.localStorage.removeItem('token')
  },
  fTime(timestamp) {
    const minuteexp = 1000 * 60
    const secondexp = 1000

    let minute = Math.floor(timestamp / minuteexp)
    timestamp = timestamp % minuteexp

    let second = Math.floor(timestamp / secondexp)
    timestamp = timestamp % secondexp

    minute = `${minute}`.replace(/^(\d)$/, '0$1')
    second = `${second}`.replace(/^(\d)$/, '0$1')

    return `${minute}:${second}`
  },
  cTime(st, et) {
    et = et || Date.now()

    // const dayexp = 1000 * 60 * 60 * 24;
    // const hourexp = 1000 * 60 * 60;
    const minuteexp = 1000 * 60
    const secondexp = 1000

    let calcTime = et - st

    // let day = Math.floor(calcTime / dayexp)
    // calcTime = calcTime % dayexp

    // let hour = Math.floor(calcTime / hourexp)
    // calcTime = calcTime % hourexp

    let minute = Math.floor(calcTime / minuteexp)
    calcTime = calcTime % minuteexp

    let second = Math.floor(calcTime / secondexp)
    calcTime = calcTime % secondexp

    minute = `${minute}`.replace(/^(\d)$/, '0$1')
    second = `${second}`.replace(/^(\d)$/, '0$1')

    return `${minute}:${second}`
  },
  browser: function() {
    var u = navigator.userAgent
    return {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('Adr') > -1 // android终端
    }
  },
  setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(window.WebViewJavascriptBridge)
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback)
    }
    window.WVJBCallbacks = [callback]
    var WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe)
    }, 0)
  },
  getIOSData(methodName) {
    return new Promise((resolve, reject) => {
      this.setupWebViewJavascriptBridge(bridge => {
        bridge.callHandler(methodName, data => {
          resolve(data)
        })
      })
    })
  },
  getAndroidData(methodName) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(window.Student[methodName]()))
    })
  },
  getAppData(methodName) {
    if (this.browser().ios) {
      return this.getIOSData(methodName)
    }
    if (this.browser().android) {
      return this.getAndroidData(methodName)
    }
    return new Promise(resolve => {
      resolve({
        token: localStorage.getItem('token') // 获取 token
      })
    })
  },
  setIOSData(methodName, value) {
    this.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler(methodName, value)
    })
  },
  setAndroidData(methodName, value) {
    if (methodName) {
      window.Student[methodName](value)
    }
  },
  setBarColor(methodName, value) {
    if (this.browser().ios) {
      return this.setIOSData(methodName, value)
    }
    if (this.browser().android) {
      return this.setAndroidData(methodName, value.statusBarColor)
    }
  },
  executeIOSMethod(methodName) {
    this.setupWebViewJavascriptBridge(bridge => {
      bridge.callHandler(methodName)
    })
  },
  executeAppMethod(methodName, value) {
    if (this.browser().ios) {
      this.executeIOSMethod(methodName)
    }
    if (this.browser().android) {
      window.Student[methodName] = window.Student[methodName] || function() {}
      if (value) {
        window.Student[methodName](value)
      } else {
        window.Student[methodName]()
      }
    }
  }
}
