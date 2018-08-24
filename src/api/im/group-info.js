import { newClient } from '../axios-client-factory'
import { requireNonNull } from '../../utils/coding-utils'
import { sortOrderMapping } from '../../utils/constants'

const propIndexMapping = {
  newsletterId: 'newsletter_id',
  createTime: 'type_id',
  activity: 'activity'
}

export const getGroupInfoList = function({ query, pager, sorter }) {
  let createTimeStart = null
  let createTimeEnd = null

  if (query.createTime !== null && typeof query.createTime !== 'undefined') {
    createTimeStart = query.createTime[0]
    createTimeEnd = query.createTime[1]
  }

  return newClient().get('/im/group-info/list', {
    params: {
      page: pager.page,
      limit: pager.limit,
      groupName: requireNonNull(query.groupName),
      typeId: requireNonNull(query.typeId),
      imId: requireNonNull(query.imId),
      username: requireNonNull(query.username),
      createTimeStart: requireNonNull(createTimeStart),
      createTimeEnd: requireNonNull(createTimeEnd),
      sidx: propIndexMapping[sorter.prop],
      order: sortOrderMapping[sorter.order]
    }
  })
}

export const getGroupInfoDetail = function(typeId) {
  return newClient().get('/im/group-info/detail/' + typeId)
}

export const updateGroupInfo = function(model) {
  return newClient().post('/im/group-info/update', model)
}

export const removeGroupInfo = function(id) {
  return newClient().post('/im/group-info/delete', [].concat(id))
}
