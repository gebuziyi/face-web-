import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  setId: 'set_id',
  createTime: 'set_id'
}

export const getQaSetDaysList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/qa/days/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getQaSetDaysDetail = function(id) {
  return newClient().get('/qa/days/detail/' + id)
}

export const updateQaSetDays = function(model) {
  return newClient().post('/qa/days/update', model)
}

export const removeQaSetDays = function(ids) {
  return newClient().post('/qa/days/delete', [].concat(ids))
}

export const createQaSetDays = function(model) {
  return newClient().post('/qa/days/save', model)
}
