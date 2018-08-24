import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  // 按点赞时间排序=按主键ID排序
  createTime: 'type_id'
}

export const getPayTypeList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/pay/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      payName: requireNonNull(query.payName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getAllPayType = function() {
  return newClient().get('/pay/type/listall/lite')
}

export const getPayTypeDetail = function(id) {
  return newClient().get('/pay/type/detail/' + id)
}

export const createPayType = function(model) {
  return newClient().post('/pay/type/save', model)
}

export const updatePayType = function(model) {
  return newClient().post('/pay/type/update', model)
}
