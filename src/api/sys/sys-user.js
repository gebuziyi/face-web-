import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'

export const getSysUserList = function({query, pager}) {
  return newClient().get('/sys/user/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      username: requireNonNull(query.username)
    }
  })
}
export const getAllSysUserList = function () {
  return newClient().get('/sys/user/all')
}
export const getSysUserDetail = function(userId) {
  return newClient().get('/sys/user/info/' + userId)
}

export const updateSysUser = function(model) {
  return newClient().post('/sys/user/update', model)
}

export const removeSysUser = function(ids) {
  return newClient().post('/sys/user/delete', [].concat(ids))
}

export const createSysUser = function(model) {
  return newClient().post('/sys/user/save', model)
}

export const changePwd = function(msg) {
  return newClient().post('/sys/user/password', msg)
}

export const getAllSysUser = function() {
  return newClient().get('/sys/user/listall/lite')
}

export const resetPassword = function(id) {
  return newClient().post(`/sys/user/${id}/resetpwd`)
}
