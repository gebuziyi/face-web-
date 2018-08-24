import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  typeId: 'type_id',
  createTime: 'type_id',
  heatRe: 'heat_re'
}

export const getGroupTypeList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/im/group-type/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      gname: requireNonNull(query.gname),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getGroupTypeDetail = function(typeId) {
  return newClient().get('/im/group-type/detail/' + typeId)
}

export const updateGroupType = function(model) {
  return newClient().post('/im/group-type/update', model)
}

export const removeGroupType = function(id) {
  return newClient().post('/im/group-type/delete', [].concat(id))
}

export const createGroupType = function(model) {
  return newClient().post('/im/group-type/save', model)
}

export const getAllGroupType = function() {
  return newClient().get('/im/group-type/listall/lite')
}
