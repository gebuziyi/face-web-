import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  levelId: 'level_id',
  createTime: 'create_time',
  sort: 'sort'
}

export const getUserLevelList = function ({ query, pager, sorter }) {
  return newClient().get('/user/level/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      names: requireNonNull(query.names),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getUserLevelDetail = function (id) {
  return newClient().get(`/user/level/detail/${id}`)
}

export const updateUserLevel = function (model) {
  return newClient().post('/user/level/update', model)
}

export const removeUserLevel = function (ids) {
  return newClient().post('/user/level/delete', [].concat(ids))
}

export const createUserLevel = function (model) {
  return newClient().post('/user/level/save', model)
}
