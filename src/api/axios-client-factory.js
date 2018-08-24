import axios from 'axios'
import { Notification } from 'element-ui'
import router from '../router'

export const newClient = function () {
  const localToken = localStorage.getItem('token')
  const newClient = axios.create({
    baseURL: '/faceshow-admin',
    timeout: 30000,
    headers: {
      token: localToken
    },
    withCredentials: true
  })
  newClient.interceptors.response.use((response) => {
    const data = response.data
    if (data.code === 0) {
      return response
    } else {
      Notification.error({
        dangerouslyUseHTMLString: true,
        message: '<p><strong>执行失败!错误信息: </strong></p><p>' + data.msg + '</p>'
      })
      if (data.code === 401) {
        router.push({
          path: '/login?code=' + 401,
          query: {
            code: 401
          }
        })
      } else if (data.code === 403) {
        // 没有权限, 转向上一页
        router.go(-1)
      }
      return Promise.reject(data.msg)
    }
  }, (error) => {
    if (error.response.status === 401) {
      Notification.error({
        message: 'Token失效, 请重新登录!',
        duration: 3000
      })
      router.push({
        path: '/login',
        query: {
          code: 401
        }
      })
    } else {
      Notification.error({
        message: '请求失败!请求路径: ' + error.config.url + ', 错误码: ' + error.response.status + ', 错误信息: ' + error.response.statusText,
        duration: 3000
      })
    }
    return Promise.reject(error)
  })

  return newClient
}
