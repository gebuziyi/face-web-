import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'create_time'
}

export const getMsgPushTypeList = function({query, pager, sorter}) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/msgpush/type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      typeName: requireNonNull(query.typeName),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getMsgPushTypeDetail = function(typeId) {
  return newClient().get('/msgpush/type/detail/' + typeId)
}

export const updateMsgPushType = function(model) {
  return newClient().post('/msgpush/type/update', model)
}

export const removeMsgPushType = function(ids) {
  return newClient().post('/msgpush/type/delete', [].concat(ids))
}

export const createMsgPushType = function(model) {
  return newClient().post('/msgpush/type/save', model)
}

export const getAllMsgPushType = function() {
  return newClient().get('/msgpush/type/all/lite')
}
