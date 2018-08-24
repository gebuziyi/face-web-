import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  gid: 'gid',
  createTime: 'gid'
}

export const getG11nInfoList = function ({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/globalization/info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      country: requireNonNull(query.country),
      cn: requireNonNull(query.cn),
      keys: requireNonNull(query.keys),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getG11nInfoDetail = function (id) {
  return newClient().get('/globalization/info/detail/' + id)
}

export const updateG11nInfo = function (model) {
  return newClient().post('/globalization/info/update', model)
}

export const removeG11nInfo = function (ids) {
  return newClient().post('/globalization/info/delete', [].concat(ids))
}

export const createG11nInfo = function (model) {
  return newClient().post('/globalization/info/save', model)
}
