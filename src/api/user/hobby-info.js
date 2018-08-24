import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  hobbyId: 'hobby_id',
  createTime: 'create_time'
}

export const getHobbyInfoList = function({query, pager, sorter}) {
  return newClient().get('/user/hobby/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      tags: requireNonNull(query.tags),
      type: requireNonNull(query.type),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getHobbyInfoDetail = function(id) {
  return newClient().get('/user/hobby/detail/' + id)
}

export const updateHobbyInfo = function(model) {
  return newClient().post('/user/hobby/update', model)
}

export const removeHobbyInfo = function(ids) {
  return newClient().post('/user/hobby/delete', [].concat(ids))
}

export const createHobbyInfo = function(model) {
  return newClient().post('/user/hobby/save', model)
}
