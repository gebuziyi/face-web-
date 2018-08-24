import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  groupId: 'group_id',
  createTime: 'group_id'
}

export const getUserGroupList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/im/user-group/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      groupImId: requireNonNull(query.groupName),
      role: requireNonNull(query.role),
      imId: requireNonNull(query.imId),
      ownerUsername: requireNonNull(query.ownerUsername),
      username: requireNonNull(query.username),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getUserGroupDetail = function(id) {
  return newClient().get('/im/user-group/detail/' + id)
}

export const updateUserGroup = function(model) {
  return newClient().post('/im/user-group/update', model)
}

export const removeUserGroup = function(id) {
  return newClient().post('/im/user-group/delete', [].concat(id))
}

export const getAllGroupRole = function() {
  return newClient().get('/im/user-group/role/list')
}
