import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  recommendId: 'recommend_id',
}
export const getUserRecommendList = function({query, pager, sorter}) {
  return newClient().get('/user/recommend/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      userId: requireNonNull(query.userId),
      typeId: requireNonNull(query.typeId),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const removeUserRecommend = function(ids) {
  return newClient().post('/user/recommend/delete', [].concat(ids))
}

export const createUserRecommend = function(model) {
  return newClient().post('/user/recommend/save', model)
}

export const getAllRecommendedUsers = function() {
  return newClient().get('/user/recommend/all')
}

export const updateUserRecommendSort = function(payload) {
  return newClient().post('/user/recommend/sort', payload)
}
