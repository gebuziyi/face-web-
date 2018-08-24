import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  reId: 're_id',
  createTime: 're_id'
}

export const getQaRecommendList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/recommend/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      theme: requireNonNull(query.theme),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getQaRecommendDetail = function(reId) {
  return newClient().get('/qa/recommend/detail/' + reId)
}

export const updateQaRecommend = function(model) {
  return newClient().post('/qa/recommend/update', model)
}

export const removeQaRecommend = function(ids) {
  return newClient().post('/qa/recommend/delete', [].concat(ids))
}

export const createQaRecommend = function(model) {
  return newClient().post('/qa/recommend/save', model)
}
