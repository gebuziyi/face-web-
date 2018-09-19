import { newClient } from '../axios-client-factory'
import { sortOrderMapping } from '../../utils/constants'
const propIndexMapping = {
  typeId: 'type_id'
}

export const getUserRecommendTypeList = function ({ pager, sorter }) {
  return newClient().get('/user/recommendType/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
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
