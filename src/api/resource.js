import axios from 'axios'
import { Message } from 'element-ui'
import { getToken, setToken, goLogin } from '@/utils/auth'

// create an axios instance
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 20000 // request timeout
})
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  if (getToken()) {
    config.headers.common['Authorization'] = `${getToken()}`
    config.headers.common['joyfishRequest'] = '123'
    // config.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
    // config.headers.token = getToken()
  } else {
    // config.headers.common['Authorization'] = 'Basic dXNlci1jbGllbnQ6MTIzNDU2'
    goLogin()
  }
  
  return config
}, function(error) {
  // 对请求错误做些什么

  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // Token失效
    if(response.data.result === "fail"){
        if (response.data.errorCode === '1004') {
        Message({
          message: '登录失效，请重新登录',
          type: 'error'
        })
        setToken('')
        goLogin()
      }
      // 用户名不存在 || 密码错误
      // if (response.data.errorCode === '414' || response.data.errorCode === '415' || response.data.errorCode === '500') {
      //   Message({
      //     message: response.data.errorMsg,
      //     type: 'error'
      //   })
      // }else{
      //   if(response.data.object){
      //     Message({
      //       type: 'error',
      //       message: response.data.object
      //     })
      //   }else{
      //       if (response.data.errorMsg) {
                // Message({
                //   type: 'error',
                //   message: response.data.errorMsg
                // })
            // }else{
                // Message({
                //   message: '操作失败',
                //   type: 'error'
                // })
      //       }
      //   }
      // }
    }
    return response
  },
  error => {
    if(error.response.status === 500){
      Message({
        message: '500内部连接错误',
        type: 'error'
      })
    }else{
      Message({
        message: error.data.errorMsg,
        type: 'error'
      })
    }
    // 对响应错误做点什么
    console.log('err' + error) // for debug
    return Promise.reject(error)
  })

export default instance

