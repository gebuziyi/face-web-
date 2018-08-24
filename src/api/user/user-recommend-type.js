import { newClient } from '../axios-client-factory'

export const getUserRecommendTypeList = function ({ pager }) {
  return newClient().get('/user/recommendType/list', {
    params: {
      page: pager.page,
      limit: pager.limit
    }
  })
}

export const removeUserRecommendType = function (ids) {
  return newClient().post('/user/recommendType/delete', [].concat(ids))
}

export const getUserRecommendTypeDetail = function (typeId) {
  return newClient().get(`/user/recommendType/detail/${typeId}`)
}

export const createUserRecommendType = function (model) {
  return newClient().post('/user/recommendType/save', model)
}

export const updateUserRecommendType = function (model) {
  return newClient().post('/user/recommendType/update', model)
}

export const getAllForComboBox = function () {
  return newClient().get('/user/recommendType/all/userRecommendTypeComboBox')
}
