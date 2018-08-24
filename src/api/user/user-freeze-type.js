import { newClient } from '../axios-client-factory'

export const getAllFreezeType = function () {
  return newClient().get('/user/freeze-type/all')
}

export const getUserFreezeTypeList = function ({ pager }) {
  return newClient().get('/user/freeze-type/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}

export const createUserFreezeType = function (model) {
  return newClient().post('/user/freeze-type/save', model)
}

export const updateUserFreezeType = function (model) {
  return newClient().post('/user/freeze-type/update', model)
}

export const getUserFreezeTypeDetail = function (freezeTypeId) {
  return newClient().get(`/user/freeze-type/detail/${freezeTypeId}`)
}

export const removeUserFreezeType = function (ids) {
  return newClient().post('/user/freeze-type/delete', [].concat(ids))
}
