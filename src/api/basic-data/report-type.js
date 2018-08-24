import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id'
}

export const getReportTypeList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/report/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      tname: requireNonNull(query.tname),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllReportType = function() {
  return newClient().get('/report/type/listall/lite')
}

export const getReportTypeDetail = function(id) {
  return newClient().get('/report/type/detail/' + id)
}

export const createReportType = function(model) {
  return newClient().post('/report/type/save', model)
}

export const updateReportType = function(model) {
  return newClient().post('/report/type/update', model)
}

export const deleteReportType = function(ids) {
  return newClient().post('/report/type/delete', [].concat(ids))
}
