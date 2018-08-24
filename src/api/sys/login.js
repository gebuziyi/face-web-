import {newClient} from '../axios-client-factory'

// 登录
export const login = function({username, password, kaptcha}) {
  // TODO
  const postData = 'username=' + username + '&password=' + password + '&captcha=' + kaptcha
  return newClient().post('/sys/login', postData)
}

export const kaptchaSrc = function() {
  return '/faceshow-admin/' + 'captcha.jpg?t=' + new Date().getTime()
}
